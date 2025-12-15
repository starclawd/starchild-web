import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { useEffect, useCallback, useMemo } from 'react'
import {
  updateStrategyBacktestData,
  changeIsLoadingStrategyBacktest,
  setIsBacktestStreaming,
  resetStreamingSteps,
  addStreamingStep,
  updateStreamingStepMessage,
  completeStreamingStep,
  StreamingStepDataType,
} from '../reducer'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useGetStrategyBacktestDataQuery } from 'api/strategyBacktest'
import { useUserInfo } from 'store/login/hooks'
import { useActiveLocale } from 'hooks/useActiveLocale'
import { useAiChatKey } from 'store/chat/hooks'
import { API_LANG_MAP } from 'constants/locales'
import { useSleep } from 'hooks/useSleep'
import { useStrategyDetail } from './useStrategyDetail'
import { STRATEGY_STATUS } from '../createstrategy'

// Backtest SSE 事件类型
export type BacktestStreamStep =
  | 'strategy_generating'
  | 'strategy_generated'
  | 'data_loading'
  | 'data_loaded'
  | 'backtest_running'
  | 'backtest_complete'
  | 'metrics_calculating'
  | 'complete'

export interface BacktestStreamEvent {
  step: BacktestStreamStep
  message: string
  progress?: number
  timestamp: string
  data?: any
  result?: any
}

export function useStrategyBacktest({ strategyId }: { strategyId: string }) {
  const dispatch = useDispatch()
  const strategyBacktestData = useSelector((state: RootState) => state.createstrategy.strategyBacktestData)
  const isLoadingStrategyBacktest = useSelector((state: RootState) => state.createstrategy.isLoadingStrategyBacktest)
  const { data, isLoading, error, refetch } = useGetStrategyBacktestDataQuery(
    { strategyId },
    {
      skip: !strategyId,
      refetchOnMountOrArgChange: true,
    },
  )

  useEffect(() => {
    if (data) {
      dispatch(updateStrategyBacktestData(data))
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(changeIsLoadingStrategyBacktest({ isLoadingStrategyBacktest: isLoading }))
  }, [isLoading, dispatch])

  return {
    strategyBacktestData,
    isLoadingStrategyBacktest,
    error,
    refetch,
  }
}

// 获取流式 steps 状态
export function useStreamingSteps(): [StreamingStepDataType[], boolean] {
  const streamingSteps = useSelector((state: RootState) => state.createstrategy.streamingSteps)
  const isBacktestStreaming = useSelector((state: RootState) => state.createstrategy.isBacktestStreaming)
  return [streamingSteps, isBacktestStreaming]
}

/**
 * SSE 流式获取 Backtest 数据
 */
export function useGetBacktestStreamData() {
  const dispatch = useDispatch()
  const { strategyId } = useParsedQueryString()
  const [{ userInfoId }] = useUserInfo()
  const aiChatKey = useAiChatKey()
  const activeLocale = useActiveLocale()
  const { sleep } = useSleep()
  const { refetch: refetchStrategyBacktest } = useStrategyBacktest({
    strategyId: strategyId || '',
  })

  // 打字机效果渲染消息（包含添加 step 的逻辑）
  const typewriterRenderStep = useCallback(
    async (stepData: { step: string; message: string; progress?: number; timestamp: string; data?: any }) => {
      const { message } = stepData

      // 先添加该 step 到 streamingSteps
      dispatch(addStreamingStep(stepData))

      let index = 0
      const charPerFrame = 3 // 每帧显示的字符数

      while (index < message.length) {
        const endIndex = Math.min(index + charPerFrame, message.length)
        const displayMessage = message.slice(0, endIndex)
        // 使用 -1 表示更新最后一个 step
        dispatch(updateStreamingStepMessage({ stepIndex: -1, displayMessage }))
        index = endIndex
        await sleep(30) // 打字机速度
      }

      // 完成该 step 的打字机效果
      dispatch(completeStreamingStep({ stepIndex: -1 }))
    },
    [dispatch, sleep],
  )

  const fetchBacktestStream = useCallback(
    async ({ strategyId }: { strategyId: string }) => {
      let reader: ReadableStreamDefaultReader<Uint8Array> | null = null
      // 使用队列来存储所有待处理的消息
      const messageQueue: Array<() => Promise<void>> = []
      let isProcessing = false

      // 处理队列中的消息
      const processQueue = async () => {
        if (isProcessing || messageQueue.length === 0) return

        isProcessing = true
        try {
          while (messageQueue.length > 0) {
            const processMessage = messageQueue.shift()
            if (processMessage) {
              await processMessage()
            }
          }
        } catch (error) {
          console.error('Queue processing error:', error)
        } finally {
          isProcessing = false
        }
      }

      try {
        dispatch(setIsBacktestStreaming(true))
        dispatch(resetStreamingSteps())

        window.backtestAbortController = new AbortController()

        const response = await fetch(
          `https://backtest-api-testnet-760098600eae.herokuapp.com/strategy/backtest/stream`,
          {
            method: 'POST',
            headers: {
              'USER-INFO-ID': `${userInfoId || ''}`,
              'ACCOUNT-API-KEY': `${aiChatKey || ''}`,
              'Content-Type': 'application/json',
              Accept: 'text/event-stream',
              language: API_LANG_MAP[activeLocale],
            },
            signal: window.backtestAbortController.signal,
            body: JSON.stringify({ strategy_id: strategyId }),
          },
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        if (!response.body) {
          throw new Error('Response body is null')
        }

        reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }

          buffer += decoder.decode(value, { stream: true })

          // 处理 SSE 格式: event: xxx\ndata: xxx\n\n
          const events = buffer.split('\n\n')
          buffer = events.pop() || ''

          for (const eventBlock of events) {
            if (!eventBlock.trim()) continue

            const lines = eventBlock.split('\n')
            let eventData: string | null = null

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                eventData = line.slice(6)
              }
            }

            if (eventData) {
              try {
                const parsedData: BacktestStreamEvent = JSON.parse(eventData)

                // 将打字机渲染加入队列（在队列中添加 step 并渲染）
                messageQueue.push(async () => {
                  await typewriterRenderStep({
                    step: parsedData.step,
                    message: parsedData.message,
                    progress: parsedData.progress,
                    timestamp: parsedData.timestamp,
                    data: parsedData.data,
                  })
                })
                processQueue()

                // 当收到 complete 事件时，更新最终数据并调用 refetch
                if (parsedData.step === 'complete') {
                  // 等待队列处理完成后再 refetch
                  messageQueue.push(async () => {
                    // 调用 refetch 获取完整数据，优先使用接口返回的 steps
                    await refetchStrategyBacktest()
                    dispatch(setIsBacktestStreaming(false))
                  })
                  processQueue()
                }
              } catch (parseError) {
                console.error('Error parsing SSE message:', parseError)
              }
            }
          }
        }

        // 确保所有消息都被处理
        await processQueue()
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Backtest stream error:', error)
        }
        window.backtestAbortController?.abort()
        dispatch(setIsBacktestStreaming(false))
      } finally {
        if (reader) {
          try {
            reader.releaseLock()
          } catch (err) {
            console.error('Error releasing reader lock:', err)
          }
        }
      }
    },
    [dispatch, userInfoId, aiChatKey, activeLocale, typewriterRenderStep, refetchStrategyBacktest],
  )

  return {
    fetchBacktestStream,
  }
}

export function useHandleRunBacktest() {
  const { strategyId } = useParsedQueryString()
  const { strategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })
  const { fetchBacktestStream } = useGetBacktestStreamData()
  const [, isBacktestStreaming] = useStreamingSteps()
  const isCodeGenerated = useMemo(() => {
    return strategyDetail?.status === STRATEGY_STATUS.DRAFT_READY
  }, [strategyDetail])
  const handleRunBacktest = useCallback(async () => {
    if (!strategyId || isBacktestStreaming || !isCodeGenerated) return
    await fetchBacktestStream({ strategyId })
  }, [strategyId, isBacktestStreaming, isCodeGenerated, fetchBacktestStream])
  return handleRunBacktest
}

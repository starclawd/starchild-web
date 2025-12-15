import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { useEffect, useCallback, useState } from 'react'
import { updateStrategyBacktestData, changeIsLoadingStrategyBacktest } from '../reducer'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useGetStrategyBacktestDataQuery } from 'api/strategyBacktest'
import { useUserInfo } from 'store/login/hooks'
import { useActiveLocale } from 'hooks/useActiveLocale'
import { useAiChatKey } from 'store/chat/hooks'
import { API_LANG_MAP } from 'constants/locales'

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

/**
 * SSE 流式获取 Backtest 数据
 */
export function useGetBacktestStreamData() {
  const dispatch = useDispatch()
  const [streamEvent, setStreamEvent] = useState<BacktestStreamEvent | null>(null)
  const [progress, setProgress] = useState(0)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamError, setStreamError] = useState<Error | null>(null)
  const [{ userInfoId }] = useUserInfo()
  const aiChatKey = useAiChatKey()
  const activeLocale = useActiveLocale()

  const cleanup = useCallback(() => {
    window.backtestAbortController?.abort()
    setIsStreaming(false)
  }, [])

  const fetchBacktestStream = useCallback(
    async ({ strategyId }: { strategyId: string }) => {
      let reader: ReadableStreamDefaultReader<Uint8Array> | null = null

      try {
        setIsStreaming(true)
        setStreamError(null)
        setProgress(0)

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
                setStreamEvent(parsedData)

                if (parsedData.progress !== undefined) {
                  setProgress(parsedData.progress)
                }

                // 当收到 complete 事件时，更新最终数据
                if (parsedData.step === 'complete' && parsedData.result) {
                  dispatch(updateStrategyBacktestData(parsedData.result))
                }
              } catch (parseError) {
                console.error('Error parsing SSE message:', parseError)
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          setStreamError(error)
          console.error('Backtest stream error:', error)
        }
        cleanup()
      } finally {
        if (reader) {
          try {
            reader.releaseLock()
          } catch (err) {
            console.error('Error releasing reader lock:', err)
          }
        }
        setIsStreaming(false)
      }
    },
    [dispatch, cleanup, userInfoId, aiChatKey, activeLocale],
  )

  return {
    fetchBacktestStream,
    streamEvent,
    progress,
    isStreaming,
    streamError,
    cleanup,
  }
}

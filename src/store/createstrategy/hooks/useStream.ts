import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { useAiChatKey } from 'store/chat/hooks/useContentHooks'
import { useActiveLocale } from 'hooks/useActiveLocale'
import { useIsLogin, useUserInfo } from 'store/login/hooks'
import { chatDomain } from 'utils/url'
import { useChatValue, useChatResponseContentList, useGetStrategyChatContents } from './useChatContent'
import { useIsAnalyzeContent, useIsLoadingChatStream, useIsRenderingData } from './useLoadingState'
import {
  ACTION_TYPE,
  ChatResponseContentDataType,
  STRATEGY_TAB_INDEX,
  SuggestedActionsDataType,
} from '../createstrategy'
import { ROLE_TYPE, STREAM_DATA_TYPE } from 'store/chat/chat'
import { nanoid } from '@reduxjs/toolkit'
import { API_LANG_MAP } from 'constants/locales'
import { combineResponseData, setChatSteamData, setShouldRefreshData } from '../reducer'
import { useSleep } from 'hooks/useSleep'
import { useAddUrlParam } from 'hooks/useAddUrlParam'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useCurrentStrategyTabIndex, useIsCreateStrategy, useStrategyDetail } from './useStrategyDetail'
import { useCodeLoadingPercent, useIsGeneratingCode, useStrategyCode } from './useCode'
import { useIsPausingPaperTrading, useIsStartingPaperTrading } from './usePaperTrading'
import { usePaperTradingPublic } from 'store/vaultsdetail/hooks/usePaperTradingPublic'
import { t } from '@lingui/core/macro'

export function useCloseStream() {
  return useCallback(() => {
    window.strategyEventSourceStatue = false
    setTimeout(() => {
      window.strategyEventSourceStatue = true
    }, 3000)
  }, [])
}

export function useSteamRenderText() {
  const { sleep } = useSleep()
  const dispatch = useDispatch()
  const [, setIsAnalyzeContent] = useIsAnalyzeContent()
  return useCallback(
    async ({
      streamText,
      id = nanoid(),
      thoughtId,
      type = STREAM_DATA_TYPE.FINAL_ANSWER,
    }: {
      streamText: string
      id?: string
      type?: STREAM_DATA_TYPE
      thoughtId?: string
    }) => {
      window.strategyEventSourceStatue = true
      let index = 0
      const sliceText = (startIndex: number, endIndex: number) => {
        return streamText.slice(startIndex * 5, endIndex * 5)
      }
      if (type === STREAM_DATA_TYPE.FINAL_ANSWER || type === STREAM_DATA_TYPE.ERROR) {
        setIsAnalyzeContent(false)
      }
      while (sliceText(index, index + 1)) {
        let text = ''
        if (!window.strategyEventSourceStatue) {
          text = sliceText(index, index + 1000000000)
          index += 1000000000
        } else {
          text = sliceText(index, index + 1)
          index += 1
        }
        if (text) {
          const msg = {
            id,
            type,
            content: text,
            threadId: '',
          }
          dispatch(setChatSteamData({ chatSteamData: msg }))
          if (type === STREAM_DATA_TYPE.FINAL_ANSWER) {
            await sleep(17)
          } else {
            await sleep(34)
          }
        }
      }
    },
    [sleep, dispatch, setIsAnalyzeContent],
  )
}

export function useGetChatStreamData() {
  const dispatch = useDispatch()
  const aiChatKey = useAiChatKey()
  const activeLocale = useActiveLocale()
  const [{ userInfoId }] = useUserInfo()
  const steamRenderText = useSteamRenderText()
  const { fetchStrategyDetail } = useStrategyDetail({
    strategyId: '',
  })
  const { fetchStrategyCode } = useStrategyCode({ strategyId: '' })
  const { fetchPaperTradingPublic } = usePaperTradingPublic({ strategyId: '' })
  const triggerGetStrategyChatContents = useGetStrategyChatContents()
  const [, setIsRenderingData] = useIsRenderingData()
  const [, setIsAnalyzeContent] = useIsAnalyzeContent()
  const [, setIsLoadingChatStream] = useIsLoadingChatStream()
  const [, setCodeLoadingPercent] = useCodeLoadingPercent()
  const [, setIsCreateStrategy] = useIsCreateStrategy()
  const [, setIsGeneratingCode] = useIsGeneratingCode()
  const [, setIsStartingPaperTrading] = useIsStartingPaperTrading()
  const [, setIsPausingPaperTrading] = useIsPausingPaperTrading()
  const [, setCurrentStrategyTabIndex] = useCurrentStrategyTabIndex()
  const addUrlParam = useAddUrlParam()

  // 抽取清理逻辑为独立函数
  const cleanup = useCallback(() => {
    window.strategyAbortController?.abort()
    setIsRenderingData(false)
    setIsAnalyzeContent(false)
    setIsLoadingChatStream(false)
    setIsGeneratingCode(false)
    setIsCreateStrategy(false)
    setIsStartingPaperTrading(false)
    setIsPausingPaperTrading(false)
    setCodeLoadingPercent(0)
  }, [
    setIsRenderingData,
    setIsAnalyzeContent,
    setIsLoadingChatStream,
    setIsGeneratingCode,
    setIsCreateStrategy,
    setIsStartingPaperTrading,
    setIsPausingPaperTrading,
    setCodeLoadingPercent,
  ])

  return useCallback(
    async ({ userValue, strategyId }: { userValue: string; strategyId: string }) => {
      let reader: ReadableStreamDefaultReader<Uint8Array> | null = null

      try {
        const domain = chatDomain['restfulDomain' as keyof typeof chatDomain]
        window.strategyEventSourceStatue = true
        // 使用队列来存储所有待处理的消息
        const messageQueue: Array<() => Promise<void>> = []
        let isProcessing = false

        // 处理队列中的消息
        const processQueue = async () => {
          if (isProcessing || messageQueue.length === 0) return

          isProcessing = true
          try {
            // 处理队列中的所有消息
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

        window.strategyAbortController = new AbortController()
        // const formData = new URLSearchParams()
        // formData.append('message', userValue)
        // formData.append('strategy_id', strategyId)

        // 使用原生fetch API代替fetchEventSource
        const response = await fetch(`${domain}/vibe-trading/chat`, {
          method: 'POST',
          headers: {
            'USER-INFO-ID': `${userInfoId || ''}`,
            'ACCOUNT-API-KEY': `${aiChatKey || ''}`,
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            language: API_LANG_MAP[activeLocale],
          },
          body: JSON.stringify({
            message: userValue,
            strategy_id: strategyId,
          }),
          signal: window.strategyAbortController.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        if (!response.body) {
          throw new Error('Response body is null')
        }

        reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = '' // 创建一个字符串缓冲区用于累积数据

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }

          // 解码收到的数据并添加到缓冲区
          buffer += decoder.decode(value, { stream: true })

          // 处理缓冲区中的完整行
          let newlineIndex
          while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
            const line = buffer.slice(0, newlineIndex).trim()
            buffer = buffer.slice(newlineIndex + 1)

            if (line === '') continue

            try {
              const data: {
                content: string
                type: STREAM_DATA_TYPE
                strategy_id: string
                msg_id: string
                action_type: ACTION_TYPE
                suggested_actions: SuggestedActionsDataType[]
              } = JSON.parse(line)
              // 如果 URL 中没有 strategyId 参数，则添加
              const url = new URL(window.location.href)
              if (!url.searchParams.has('strategyId') && data.strategy_id) {
                addUrlParam('strategyId', data.strategy_id)
              }
              if (data.type !== STREAM_DATA_TYPE.ERROR) {
                if (data.type === STREAM_DATA_TYPE.ACTION_CALL) {
                  if (data.action_type === ACTION_TYPE.CREATE_STRATEGY) {
                    setIsCreateStrategy(true)
                    setCurrentStrategyTabIndex(STRATEGY_TAB_INDEX.CREATE)
                  } else if (data.action_type === ACTION_TYPE.GENERATE_CODE) {
                    setCodeLoadingPercent(0)
                    setIsGeneratingCode(true)
                    setCurrentStrategyTabIndex(STRATEGY_TAB_INDEX.CODE)
                  } else if (data.action_type === ACTION_TYPE.START_PAPER_TRADING) {
                    setIsStartingPaperTrading(true)
                    setCurrentStrategyTabIndex(STRATEGY_TAB_INDEX.PAPER_TRADING)
                  } else if (data.action_type === ACTION_TYPE.STOP_PAPER_TRADING) {
                    setIsPausingPaperTrading(true)
                    setCurrentStrategyTabIndex(STRATEGY_TAB_INDEX.PAPER_TRADING)
                  }
                } else if (data.type === STREAM_DATA_TYPE.THINKING) {
                  messageQueue.push(async () => {
                    setIsRenderingData(true)
                    // THINKING 类型直接 dispatch 完整内容，每次推送替代前面的内容
                    dispatch(
                      setChatSteamData({
                        chatSteamData: {
                          id: data.msg_id,
                          type: data.type,
                          content: data.content,
                          threadId: '',
                        },
                      }),
                    )
                  })
                  processQueue()
                } else if (data.type === STREAM_DATA_TYPE.FINAL_ANSWER) {
                  messageQueue.push(async () => {
                    setIsRenderingData(true)
                    await steamRenderText({
                      id: data.msg_id,
                      type: data.type,
                      streamText: data.content,
                    })
                  })
                  processQueue()
                } else if (data.type === STREAM_DATA_TYPE.END_THINKING) {
                  messageQueue.push(async () => {
                    dispatch(combineResponseData())
                    setIsRenderingData(false)
                    if (data.strategy_id) {
                      await fetchStrategyDetail(data.strategy_id)
                    }
                    await triggerGetStrategyChatContents(data.strategy_id)
                    if (data.action_type === ACTION_TYPE.CREATE_STRATEGY) {
                      setIsCreateStrategy(false)
                    } else if (data.action_type === ACTION_TYPE.GENERATE_CODE) {
                      await fetchStrategyCode(data.strategy_id)
                      setIsGeneratingCode(false)
                    } else if (data.action_type === ACTION_TYPE.START_PAPER_TRADING) {
                      await fetchPaperTradingPublic(data.strategy_id)
                      // 触发数据重新获取
                      dispatch(setShouldRefreshData(true))
                      setIsStartingPaperTrading(false)
                    } else if (data.action_type === ACTION_TYPE.STOP_PAPER_TRADING) {
                      await fetchPaperTradingPublic(data.strategy_id)
                      setIsPausingPaperTrading(false)
                    }
                  })
                  processQueue()
                }
              } else if (data.type === STREAM_DATA_TYPE.ERROR) {
                messageQueue.push(async () => {
                  setIsRenderingData(true)
                  await steamRenderText({
                    id: data.msg_id,
                    type: data.type,
                    streamText: data.content || '',
                  })
                })
                processQueue()
                setTimeout(() => {
                  dispatch(combineResponseData())
                }, 1000)
              }
            } catch (parseError) {
              console.error('Error parsing SSE message:', parseError)
              // 对于解析错误，我们继续处理下一行，而不是中断整个流
            }
          }
        }

        // 确保所有消息都被处理
        await processQueue()
      } catch (error) {
        cleanup()
      } finally {
        // 确保 reader 被正确释放
        if (reader) {
          try {
            reader.releaseLock()
          } catch (err) {
            console.error('Error releasing reader lock:', err)
          }
        }
      }
    },
    [
      aiChatKey,
      userInfoId,
      activeLocale,
      dispatch,
      fetchStrategyDetail,
      fetchStrategyCode,
      fetchPaperTradingPublic,
      triggerGetStrategyChatContents,
      steamRenderText,
      setIsRenderingData,
      cleanup,
      addUrlParam,
      setCurrentStrategyTabIndex,
      setIsGeneratingCode,
      setIsCreateStrategy,
      setIsStartingPaperTrading,
      setIsPausingPaperTrading,
      setCodeLoadingPercent,
    ],
  )
}

export function useSendChatUserContent() {
  const [{ userInfoId }] = useUserInfo()
  const [, setValue] = useChatValue()
  const { strategyId } = useParsedQueryString()
  const [chatResponseContentList, setChatResponseContentList] = useChatResponseContentList()
  const [isLoadingChatStream, setIsLoadingChatStream] = useIsLoadingChatStream()
  const [, setIsAnalyzeContent] = useIsAnalyzeContent()
  const getStreamData = useGetChatStreamData()
  return useCallback(
    async ({
      value,
      nextChatResponseContentList,
    }: {
      value: string
      nextChatResponseContentList?: ChatResponseContentDataType[]
    }) => {
      if (!value || isLoadingChatStream || !userInfoId) return
      try {
        setIsLoadingChatStream(true)
        setIsAnalyzeContent(true)
        setChatResponseContentList([
          ...(strategyId ? nextChatResponseContentList || chatResponseContentList : []),
          {
            id: `${nanoid()}`,
            content: value,
            thinkingContent: '',
            role: ROLE_TYPE.USER,
            timestamp: new Date().getTime(),
            nextActions: [],
          },
        ])
        setValue('')
        await getStreamData({
          strategyId: strategyId || '',
          userValue: strategyId ? value : `Create strategy: ${value}`,
        })
        setIsLoadingChatStream(false)
      } catch (error) {
        setIsLoadingChatStream(false)
      }
    },
    [
      userInfoId,
      strategyId,
      isLoadingChatStream,
      chatResponseContentList,
      setIsAnalyzeContent,
      setChatResponseContentList,
      setIsLoadingChatStream,
      setValue,
      getStreamData,
    ],
  )
}

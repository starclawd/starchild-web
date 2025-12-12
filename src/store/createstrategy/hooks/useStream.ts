import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { useAiChatKey } from 'store/chat/hooks/useContentHooks'
import { useActiveLocale } from 'hooks/useActiveLocale'
import { useIsLogin, useUserInfo } from 'store/login/hooks'
import { chatDomain } from 'utils/url'
import { useChatValue, useChatResponseContentList, useGetStrategyChatContents } from './useChatContent'
import { useIsAnalyzeContent, useIsLoadingChatStream, useIsRenderingData } from './useLoadingState'
import { ChatResponseContentDataType } from '../createstrategy'
import { ROLE_TYPE, STREAM_DATA_TYPE } from 'store/chat/chat'
import { nanoid } from '@reduxjs/toolkit'
import { API_LANG_MAP } from 'constants/locales'
import { combineResponseData, setChatSteamData } from '../reducer'
import { useSleep } from 'hooks/useSleep'
import { useAddUrlParam } from 'hooks/useAddUrlParam'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useStrategyDetail } from './useStrategyDetail'

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
        if (type === STREAM_DATA_TYPE.TEMP) {
          const data: {
            tool_name: string
            description: string
            tool_type: string
            content: string
          } = JSON.parse(streamText)
          const { description, content } = data
          const result = description || content || ''
          return result.slice(startIndex * 5, endIndex * 5)
        } else {
          return streamText.slice(startIndex * 5, endIndex * 5)
        }
      }
      if (type === STREAM_DATA_TYPE.FINAL_ANSWER || type === STREAM_DATA_TYPE.ERROR) {
        setIsAnalyzeContent(false)
      }
      while (sliceText(index, index + 1)) {
        let text = ''
        if (!window.strategyEventSourceStatue || type === STREAM_DATA_TYPE.SOURCE_LIST_DETAILS) {
          text = sliceText(index, index + 1000000000)
          index += 1000000000
        } else if (type === STREAM_DATA_TYPE.TEMP) {
          const data: {
            tool_name: string
            description: string
            tool_type: string
          } = JSON.parse(streamText)
          const description = sliceText(index, index + 1)
          index += 1
          text = JSON.stringify({
            id: thoughtId || nanoid(),
            tool_name: data.tool_name,
            tool_type: data.tool_type,
            description,
          })
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
  const { strategyId: currentStrategyId } = useParsedQueryString()
  const { refetch: refetchStrategyDetail } = useStrategyDetail({ strategyId: currentStrategyId || '' })
  const triggerGetStrategyChatContents = useGetStrategyChatContents()
  const [, setIsRenderingData] = useIsRenderingData()
  const [, setIsAnalyzeContent] = useIsAnalyzeContent()
  const [, setIsLoadingChatStream] = useIsLoadingChatStream()
  const addUrlParam = useAddUrlParam()

  // 抽取清理逻辑为独立函数
  const cleanup = useCallback(() => {
    window.strategyAbortController?.abort()
    setIsRenderingData(false)
    setIsAnalyzeContent(false)
    setIsLoadingChatStream(false)
  }, [setIsRenderingData, setIsAnalyzeContent, setIsLoadingChatStream])

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
              } = JSON.parse(line)
              if (data.strategy_id) {
                // 如果 URL 中没有 strategyId 参数，则添加
                const url = new URL(window.location.href)
                if (!url.searchParams.has('strategyId')) {
                  addUrlParam('strategyId', data.strategy_id)
                }
              }
              if (data.type !== STREAM_DATA_TYPE.ERROR) {
                if (data.type === STREAM_DATA_TYPE.END_THINKING) {
                  messageQueue.push(async () => {
                    dispatch(combineResponseData())
                    setIsRenderingData(false)
                    // 使用 SSE 返回的 thread_id，解决初始 strategyId 为空的问题
                    await triggerGetStrategyChatContents(data.strategy_id)
                    if (currentStrategyId) {
                      await refetchStrategyDetail()
                    }
                  })
                  processQueue()
                } else if (data.type === STREAM_DATA_TYPE.TEMP) {
                  const thoughtId = nanoid()
                  messageQueue.push(async () => {
                    setIsRenderingData(true)
                    await steamRenderText({
                      id: data.msg_id,
                      thoughtId,
                      type: data.type,
                      streamText: line,
                    })
                  })
                  processQueue()
                } else if (
                  data.type === STREAM_DATA_TYPE.THINKING_DETAIL ||
                  data.type === STREAM_DATA_TYPE.TOOL_RESULT_DETAIL
                ) {
                  const thoughtId = nanoid()
                  const { content } = data
                  messageQueue.push(async () => {
                    setIsRenderingData(true)
                    await steamRenderText({
                      id: data.msg_id,
                      thoughtId,
                      type: STREAM_DATA_TYPE.TEMP,
                      streamText: JSON.stringify({
                        type: STREAM_DATA_TYPE.TEMP,
                        content,
                      }),
                    })
                  })
                  processQueue()
                } else if (data.type === STREAM_DATA_TYPE.SOURCE_LIST_DETAILS) {
                  messageQueue.push(async () => {
                    setIsRenderingData(true)
                    await steamRenderText({
                      id: data.msg_id,
                      type: data.type,
                      streamText: JSON.stringify(data.content),
                    })
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
      currentStrategyId,
      dispatch,
      refetchStrategyDetail,
      triggerGetStrategyChatContents,
      steamRenderText,
      setIsRenderingData,
      cleanup,
      addUrlParam,
    ],
  )
}

export function useSendChatUserContent() {
  const isLogin = useIsLogin()
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
      if (!value || isLoadingChatStream || !isLogin) return
      try {
        setIsLoadingChatStream(true)
        setIsAnalyzeContent(true)
        setChatResponseContentList([
          ...(strategyId ? nextChatResponseContentList || chatResponseContentList : []),
          {
            id: `${nanoid()}`,
            content: value,
            thoughtContentList: [],
            sourceListDetails: [],
            role: ROLE_TYPE.USER,
            timestamp: new Date().getTime(),
          },
        ])
        setValue('')
        await getStreamData({
          strategyId: strategyId || '',
          userValue: strategyId ? value : `Create Strategy: ${value}`,
        })
        setIsLoadingChatStream(false)
      } catch (error) {
        setIsLoadingChatStream(false)
      }
    },
    [
      isLogin,
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

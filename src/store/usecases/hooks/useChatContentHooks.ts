import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { ParamFun } from 'types/global'
import { useSleep } from 'hooks/useSleep'
import { nanoid } from '@reduxjs/toolkit'
import { useUserInfo, useIsLogin } from 'store/login/hooks'
import { chatDomain } from 'utils/url'
import { useCurrentAiThreadId } from 'store/chatcache/hooks'
import { useLazyGetAiBotChatThreadsQuery, useLazyGenerateKlineChartQuery } from 'api/chat'
import { useGetSubscribedAgents } from 'store/agenthub/hooks/useSubscription'
import { API_LANG_MAP } from 'constants/locales'
import { useActiveLocale } from 'hooks/useActiveLocale'
import { useAiChatKey } from 'store/chat/hooks'
import { ROLE_TYPE, STREAM_DATA_TYPE, TempAiContentDataType } from 'store/chat/chat'
import {
  changeAiResponseContentList,
  changeInputValue,
  changeIsAnalyzeContent,
  changeIsLoadingData,
  changeIsRenderingData,
  combineResponseData,
  getAiSteamData,
} from '../reducer'

export function useIsRenderingData(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isRenderingData = useSelector((state: RootState) => state.usecases.isRenderingData)
  const setIsRenderingData = useCallback(
    (value: boolean) => {
      dispatch(changeIsRenderingData({ isRenderingData: value }))
    },
    [dispatch],
  )
  return [isRenderingData, setIsRenderingData]
}

export function useIsAnalyzeContent(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isAnalyzeContent = useSelector((state: RootState) => state.usecases.isAnalyzeContent)
  const setIsAnalyzeContent = useCallback(
    (value: boolean) => {
      dispatch(changeIsAnalyzeContent({ isAnalyzeContent: value }))
    },
    [dispatch],
  )
  return [isAnalyzeContent, setIsAnalyzeContent]
}

export function useIsLoadingData(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isLoadingData = useSelector((state: RootState) => state.usecases.isLoadingData)
  const setIsLoadingData = useCallback(
    (value: boolean) => {
      dispatch(changeIsLoadingData({ isLoadingData: value }))
    },
    [dispatch],
  )
  return [isLoadingData, setIsLoadingData]
}

export function useAiResponseContentList(): [TempAiContentDataType[], ParamFun<TempAiContentDataType[]>] {
  const dispatch = useDispatch()
  const aiResponseContentList = useSelector((state: RootState) => state.usecases.aiResponseContentList)
  const setAiResponseContentList = useCallback(
    (list: TempAiContentDataType[]) => {
      dispatch(changeAiResponseContentList({ aiResponseContentList: list }))
    },
    [dispatch],
  )
  return [aiResponseContentList, setAiResponseContentList]
}

export function useInputValue(): [string, ParamFun<string>] {
  const dispatch = useDispatch()
  const inputValue = useSelector((state: RootState) => state.usecases.inputValue)
  const setInputValue = useCallback(
    (value: string) => {
      dispatch(changeInputValue({ inputValue: value }))
    },
    [dispatch],
  )
  return [inputValue, setInputValue]
}

export function useSteamRenderText() {
  const sleep = useSleep()
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
      window.eventSourceStatue = true
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
        if (!window.eventSourceStatue || type === STREAM_DATA_TYPE.SOURCE_LIST_DETAILS) {
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
          dispatch(getAiSteamData({ aiSteamData: msg }))
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

export function useGetAiStreamData() {
  const dispatch = useDispatch()
  const aiChatKey = useAiChatKey()
  const activeLocale = useActiveLocale()
  const [{ telegramUserId }] = useUserInfo()
  const steamRenderText = useSteamRenderText()
  const [currentAiThreadId, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [, setIsRenderingData] = useIsRenderingData()
  const [, setIsAnalyzeContent] = useIsAnalyzeContent()
  const [, setIsLoadingData] = useIsLoadingData()
  const [triggerGenerateKlineChart] = useLazyGenerateKlineChartQuery()
  const [triggerGetAiBotChatThreads] = useLazyGetAiBotChatThreadsQuery()
  const triggerGetSubscribedAgents = useGetSubscribedAgents()

  // 抽取清理逻辑为独立函数
  const cleanup = useCallback(() => {
    window.abortController?.abort()
    setIsRenderingData(false)
    setIsAnalyzeContent(false)
    setIsLoadingData(false)
  }, [setIsRenderingData, setIsAnalyzeContent, setIsLoadingData])

  return useCallback(
    async ({ userValue, threadId }: { userValue: string; threadId: string }) => {
      let reader: ReadableStreamDefaultReader<Uint8Array> | null = null

      try {
        const domain = chatDomain['restfulDomain' as keyof typeof chatDomain]
        window.eventSourceStatue = true
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

        window.abortController = new AbortController()
        const formData = new URLSearchParams()
        formData.append('user_id', telegramUserId)
        formData.append('thread_id', threadId)
        formData.append('query', userValue)

        // 使用原生fetch API代替fetchEventSource
        const response = await fetch(`${domain}/chat`, {
          method: 'POST',
          headers: {
            'ACCOUNT-ID': `${telegramUserId || ''}`,
            'ACCOUNT-API-KEY': `${aiChatKey || ''}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'text/event-stream',
            language: API_LANG_MAP[activeLocale],
          },
          body: formData,
          signal: window.abortController.signal,
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
                thread_id: string
                msg_id: string
              } = JSON.parse(line)
              if (data.type !== STREAM_DATA_TYPE.ERROR) {
                if (data.type === STREAM_DATA_TYPE.END_THINKING) {
                  messageQueue.push(async () => {
                    dispatch(combineResponseData())
                    setIsRenderingData(false)
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
      currentAiThreadId,
      aiChatKey,
      telegramUserId,
      activeLocale,
      triggerGenerateKlineChart,
      dispatch,
      steamRenderText,
      setCurrentAiThreadId,
      triggerGetAiBotChatThreads,
      setIsRenderingData,
      cleanup,
      triggerGetSubscribedAgents,
    ],
  )
}

export function useSendAiContent() {
  const isLogin = useIsLogin()
  const getStreamData = useGetAiStreamData()
  const [, setValue] = useInputValue()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const [isLoadingData, setIsLoadingData] = useIsLoadingData()
  const [, setIsAnalyzeContent] = useIsAnalyzeContent()
  const [aiResponseContentList, setAiResponseContentList] = useAiResponseContentList()
  return useCallback(
    async ({
      value,
      nextAiResponseContentList,
    }: {
      value: string
      nextAiResponseContentList?: TempAiContentDataType[]
    }) => {
      if (!value || isLoadingData || !isLogin) return
      try {
        setIsLoadingData(true)
        setIsAnalyzeContent(true)
        setAiResponseContentList([
          ...(nextAiResponseContentList || aiResponseContentList),
          {
            id: `${nanoid()}`,
            content: value,
            feedback: null,
            thoughtContentList: [],
            sourceListDetails: [],
            role: ROLE_TYPE.USER,
            timestamp: new Date().getTime(),
            agentRecommendationList: [],
          },
        ])
        setValue('')
        await getStreamData({
          threadId: currentAiThreadId,
          userValue: value,
        })
        setIsLoadingData(false)
      } catch (error) {
        setIsLoadingData(false)
      }
    },
    [
      isLogin,
      isLoadingData,
      aiResponseContentList,
      currentAiThreadId,
      setIsAnalyzeContent,
      setAiResponseContentList,
      setIsLoadingData,
      setValue,
      getStreamData,
    ],
  )
}

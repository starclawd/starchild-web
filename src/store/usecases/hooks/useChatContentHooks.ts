import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { ParamFun } from 'types/global'
import { useSleep } from 'hooks/useSleep'
import { nanoid } from '@reduxjs/toolkit'
import { useUserInfo } from 'store/login/hooks'
import { chatDomain } from 'utils/url'
import { API_LANG_MAP } from 'constants/locales'
import { useActiveLocale } from 'hooks/useActiveLocale'
import { useAiChatKey } from 'store/chat/hooks'
import { ROLE_TYPE, STREAM_DATA_TYPE, TempAiContentDataType } from 'store/chat/chat'
import {
  changeAiResponseContentList,
  changeCurrentAiContentDeepThinkData,
  changeInputValue,
  changeIsAnalyzeContent,
  changeIsLoadingData,
  changeIsRenderingData,
  changeIsShowAgentDetail,
  changeIsShowDeepThink,
  changeIsShowDeepThinkSources,
  combineResponseData,
  getAiSteamData,
  resetTempAiContentData,
} from '../reducer'
import { useLazyGetAgentDetailQuery } from 'api/chat'
import { QUERY_TYPE } from 'constants/useCases'

export function useCloseStream() {
  return useCallback(() => {
    window.useCasesEventSourceStatue = false
    setTimeout(() => {
      window.useCasesEventSourceStatue = true
    }, 3000)
  }, [])
}

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
      window.useCasesEventSourceStatue = true
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
        } else if (type === STREAM_DATA_TYPE.TRIGGER_HISTORY) {
          const data: {
            id?: string
            message: string
            error?: string
            trigger_time: number
          } = JSON.parse(streamText)
          const { message } = data
          return message.slice(startIndex * 5, endIndex * 5)
        } else {
          return streamText.slice(startIndex * 5, endIndex * 5)
        }
      }
      if (
        type === STREAM_DATA_TYPE.FINAL_ANSWER ||
        type === STREAM_DATA_TYPE.ERROR ||
        type === STREAM_DATA_TYPE.TRIGGER_HISTORY
      ) {
        setIsAnalyzeContent(false)
      }
      while (sliceText(index, index + 1)) {
        let text = ''
        if (!window.useCasesEventSourceStatue || type === STREAM_DATA_TYPE.SOURCE_LIST_DETAILS) {
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
        } else if (type === STREAM_DATA_TYPE.TRIGGER_HISTORY) {
          const data: {
            id?: string
            message: string
            error?: string
            trigger_time: number
          } = JSON.parse(streamText)
          const message = sliceText(index, index + 1)
          index += 1
          text = JSON.stringify({
            id: data.id || thoughtId || nanoid(),
            message,
            error: data.error,
            trigger_time: data.trigger_time,
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
          if (type === STREAM_DATA_TYPE.FINAL_ANSWER || type === STREAM_DATA_TYPE.TRIGGER_HISTORY) {
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
  const [, setIsRenderingData] = useIsRenderingData()
  const [, setIsAnalyzeContent] = useIsAnalyzeContent()
  const [, setIsLoadingData] = useIsLoadingData()
  const [triggerGetAgentDetail] = useLazyGetAgentDetailQuery()

  // 抽取清理逻辑为独立函数
  const cleanup = useCallback(() => {
    window.useCasesAbortController?.abort()
    setIsRenderingData(false)
    setIsAnalyzeContent(false)
    setIsLoadingData(false)
  }, [setIsRenderingData, setIsAnalyzeContent, setIsLoadingData])

  return useCallback(
    async ({ userValue, threadId, queryType }: { userValue: string; threadId: string; queryType: string }) => {
      let reader: ReadableStreamDefaultReader<Uint8Array> | null = null
      try {
        const domain = chatDomain['restfulDomain' as keyof typeof chatDomain]
        window.useCasesEventSourceStatue = true
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
        const megId = nanoid()
        window.useCasesAbortController = new AbortController()

        // 使用原生fetch API代替fetchEventSource
        const response = await fetch(`${domain}/user_case?query=${userValue}&query_type=${queryType}`, {
          method: 'GET',
          headers: {
            'ACCOUNT-ID': `${telegramUserId || ''}`,
            'ACCOUNT-API-KEY': `${aiChatKey || ''}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'text/event-stream',
            language: API_LANG_MAP[activeLocale],
          },
          signal: window.useCasesAbortController.signal,
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
                agent_id: string
                type: STREAM_DATA_TYPE
                message: string
                thread_id: string
                msg_id: string
                kline_charts: any
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
                      id: megId,
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
                      id: megId,
                      type: data.type,
                      streamText: JSON.stringify(data.content),
                    })
                  })
                  processQueue()
                } else if (data.type === STREAM_DATA_TYPE.FINAL_ANSWER) {
                  const agentId = data.agent_id
                  messageQueue.push(async () => {
                    setIsRenderingData(true)
                    if (agentId) {
                      dispatch(
                        getAiSteamData({
                          aiSteamData: {
                            id: megId,
                            type: data.type,
                            content: '',
                            threadId: '',
                            agentId,
                          },
                        }),
                      )
                      try {
                        const agentData = await triggerGetAgentDetail({ taskId: agentId })
                        if (agentData.isSuccess) {
                          const triggerHistory = (agentData.data as any)?.trigger_history
                          if (triggerHistory && Array.isArray(triggerHistory)) {
                            // 对每条 triggerHistory 使用流式输出
                            const sortedHistory = [...triggerHistory]
                              .sort((a: any, b: any) => b.trigger_time - a.trigger_time)
                              .slice(0, 3)

                            for (const historyItem of sortedHistory) {
                              const historyId = nanoid()
                              await steamRenderText({
                                id: megId,
                                thoughtId: historyId,
                                type: STREAM_DATA_TYPE.TRIGGER_HISTORY,
                                streamText: JSON.stringify(historyItem),
                              })
                            }
                          }

                          // 最后添加空的 FINAL_ANSWER 来标记结束
                          await steamRenderText({
                            id: megId,
                            type: data.type,
                            streamText: '',
                          })
                        }
                      } catch (error) {
                        console.error('Error getting agent detail:', error)
                      }
                    } else {
                      await steamRenderText({
                        id: megId,
                        type: data.type,
                        streamText: data.content,
                      })
                    }
                    dispatch(
                      getAiSteamData({
                        aiSteamData: {
                          id: megId,
                          type: data.type,
                          content: '',
                          threadId: '',
                          klineCharts: data?.kline_charts,
                        },
                      }),
                    )
                  })
                  processQueue()
                }
              } else if (data.type === STREAM_DATA_TYPE.ERROR) {
                messageQueue.push(async () => {
                  setIsRenderingData(true)
                  await steamRenderText({
                    id: megId,
                    type: data.type,
                    streamText: data.message || '',
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
        console.error('Error parsing SSE message:', error)
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
      telegramUserId,
      activeLocale,
      triggerGetAgentDetail,
      dispatch,
      steamRenderText,
      setIsRenderingData,
      cleanup,
    ],
  )
}

export function useSendAiContent() {
  const getStreamData = useGetAiStreamData()
  const [, setValue] = useInputValue()
  const [isLoadingData, setIsLoadingData] = useIsLoadingData()
  const [, setIsAnalyzeContent] = useIsAnalyzeContent()
  const [aiResponseContentList, setAiResponseContentList] = useAiResponseContentList()
  return useCallback(
    async ({
      value,
      queryType,
      nextAiResponseContentList,
    }: {
      value: string
      queryType: QUERY_TYPE
      nextAiResponseContentList?: TempAiContentDataType[]
    }) => {
      if (!value || isLoadingData) return
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
          threadId: '',
          userValue: value,
          queryType,
        })
        setIsLoadingData(false)
      } catch (error) {
        setIsLoadingData(false)
      }
    },
    [
      isLoadingData,
      aiResponseContentList,
      setIsAnalyzeContent,
      setAiResponseContentList,
      setIsLoadingData,
      setValue,
      getStreamData,
    ],
  )
}

export function useIsShowDeepThink(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isShowDeepThink = useSelector((state: RootState) => state.usecases.isShowDeepThink)
  const setIsShowDeepThink = useCallback(
    (value: boolean) => {
      dispatch(changeIsShowDeepThink({ isShowDeepThink: value }))
    },
    [dispatch],
  )
  return [isShowDeepThink, setIsShowDeepThink]
}

export function useIsShowAgentDetail(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isShowAgentDetail = useSelector((state: RootState) => state.usecases.isShowAgentDetail)
  const setIsShowAgentDetail = useCallback(
    (value: boolean) => {
      dispatch(changeIsShowAgentDetail({ isShowAgentDetail: value }))
    },
    [dispatch],
  )
  return [isShowAgentDetail, setIsShowAgentDetail]
}

export function useIsShowDeepThinkSources(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isShowDeepThinkSources = useSelector((state: RootState) => state.usecases.isShowDeepThinkSources)
  const setIsShowDeepThinkSources = useCallback(
    (value: boolean) => {
      dispatch(changeIsShowDeepThinkSources({ isShowDeepThinkSources: value }))
    },
    [dispatch],
  )
  return [isShowDeepThinkSources, setIsShowDeepThinkSources]
}

export function useCurrentAiContentDeepThinkData(): [TempAiContentDataType, ParamFun<TempAiContentDataType>] {
  const dispatch = useDispatch()
  const currentAiContentDeepThinkData = useSelector((state: RootState) => state.usecases.currentAiContentDeepThinkData)
  const setCurrentAiContentDeepThinkData = useCallback(
    (value: TempAiContentDataType) => {
      dispatch(changeCurrentAiContentDeepThinkData({ currentAiContentDeepThinkData: value }))
    },
    [dispatch],
  )
  return [currentAiContentDeepThinkData, setCurrentAiContentDeepThinkData]
}

export function useTempAiContentData() {
  const tempAiContentData = useSelector((state: RootState) => state.usecases.tempAiContentData)
  return tempAiContentData
}

export function useResetTempAiContentData() {
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(resetTempAiContentData())
  }, [dispatch])
}

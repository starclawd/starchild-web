import { useCallback, useMemo } from 'react'
import { RootState } from 'store'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { changeAiResponseContentList, changeAnalyzeContentList, changeCurrentAiContentDeepThinkData, changeCurrentRenderingId, changeFileList, changeHasLoadThreadsList, changeInputValue, changeIsAnalyzeContent, changeIsFocus, changeIsLoadingAiContent, changeIsLoadingData, changeIsOpenAuxiliaryArea, changeIsOpenDeleteThread, changeIsRenderingData, changeIsShowDeepThink, changeIsShowInsightTradeAiContent, changeIsChatPageLoaded, changeRecommandContentList, changeSelectThreadIds, changeThreadsList, combineResponseData, getAiSteamData, resetTempAiContentData, changeIsShowTaskDetails } from './reducer'
import { AnalyzeContentDataType, RecommandContentDataType, ROLE_TYPE, STREAM_DATA_TYPE, TempAiContentDataType, ThoughtContentDataType, ThreadData } from './tradeai.d'
import { ParamFun, PromiseReturnFun } from 'types/global'
import { useCurrentAiThreadId } from 'store/tradeaicache/hooks'
import { useLazyAudioTranscriptionsQuery, useLazyChartImgQuery, useLazyDeleteContentQuery, useLazyDeleteThreadQuery, useLazyDislikeContentQuery, useLazyGenerateKlineChartQuery, useLazyGetAiBotChatContentsQuery, useLazyGetAiBotChatThreadsQuery, useLazyLikeContentQuery, useLazyOpenAiChatCompletionsQuery } from 'api/tradeai'
import { useSleep } from 'hooks/useSleep'
import { nanoid } from '@reduxjs/toolkit'
import { useIsLogin, useUserInfo } from 'store/login/hooks'
import { tradeAiDomain } from 'utils/url'

export function useCloseStream() {
  return useCallback(() => {
    window.eventSourceStatue = false
    setTimeout(() => {
      window.eventSourceStatue = true
    }, 3000)
  }, [])
}

export function useAiChatKey(): string {
  const [userInfo] = useUserInfo()
  const { aiChatKey } = userInfo
  return aiChatKey
}

export function useSteamRenderText() {
  const sleep = useSleep()
  const dispatch = useDispatch()
  const [, setIsRenderingData] = useIsRenderingData()
  const [, setIsAnalyzeContent] = useIsAnalyzeContent()
  return useCallback(async ({
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
        } = JSON.parse(streamText)
        const { description } = data
        return description ? description.slice(startIndex * 5, endIndex * 5) : ''
      } else {
        return streamText.slice(startIndex * 5, endIndex * 5)
      }
    }
    if (type === STREAM_DATA_TYPE.FINAL_ANSWER) {
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
    setIsRenderingData(false)
  }, [sleep, dispatch, setIsRenderingData, setIsAnalyzeContent])
}

export function useGetAiStreamData() {
  const dispatch = useDispatch()
  const aiChatKey = useAiChatKey()
  const [{ evmAddress }] = useUserInfo()
  const steamRenderText = useSteamRenderText()
  const [, setThreadsList] = useThreadsList()
  const triggerGetAiBotChatContents = useGetAiBotChatContents()
  const [currentAiThreadId, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [, setCurrentRenderingId] = useCurrentRenderingId()
  const [, setIsRenderingData] = useIsRenderingData()
  const [, setIsAnalyzeContent] = useIsAnalyzeContent()
  const [, setIsLoadingData] = useIsLoadingData()
  const triggerGenerateKlineChart = useGenerateKlineChart()
  const [triggerGetAiBotChatThreads] = useLazyGetAiBotChatThreadsQuery()
  return useCallback(async ({
    userValue,
    threadId,
  }: {
    userValue: string
    threadId: string
  }) => {
    try {
      const domain = tradeAiDomain['restfulDomain' as keyof typeof tradeAiDomain]
      window.eventSourceStatue = true
      const id = nanoid()
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
          console.error('error:', error)
        } finally {
          isProcessing = false
        }
      }
      window.abortController = new AbortController()
      const formData = new URLSearchParams()
      formData.append('user_id', evmAddress)
      formData.append('thread_id', threadId)
      formData.append('query', userValue)

      // 使用原生fetch API代替fetchEventSource
      const response = await fetch(`${domain}/chat`, {
        method: 'POST',
        headers: {
          'ACCOUNT-ID': `${evmAddress || ''}`,
          'ACCOUNT-API-KEY': `${aiChatKey || ''}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/event-stream',
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

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = '' // 创建一个字符串缓冲区用于累积数据

      try {
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
                content: string,
                type: STREAM_DATA_TYPE,
                thread_id: string,
                msg_id: string
              } = JSON.parse(line)
              if (data.type !== STREAM_DATA_TYPE.ERROR) {
                setCurrentRenderingId(id)
                if (data.type === STREAM_DATA_TYPE.END_THINKING) {
                  messageQueue.push(async () => {
                    setIsRenderingData(false)
                    dispatch(combineResponseData())
                    if (!currentAiThreadId) {
                      const result = await triggerGetAiBotChatThreads({ account: evmAddress, aiChatKey })
                      const list = (result.data as any).map((data: any) => ({
                        threadId: data.thread_id,
                        title: data.title,
                        createdAt: data.created_at,
                      }))
                      setThreadsList(list)
                      setCurrentAiThreadId(data.thread_id)
                    }
                    await triggerGetAiBotChatContents({ threadId: currentAiThreadId || data.thread_id, evmAddress })
                  })
                  processQueue()
                  setCurrentRenderingId('')
                } else if (data.type === STREAM_DATA_TYPE.TEMP) {
                  const thoughtId = nanoid()
                  messageQueue.push(async () => {
                    setIsRenderingData(true)
                    await steamRenderText({
                      id,
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
                      id,
                      type: data.type,
                      streamText: JSON.stringify(data.content),
                    })
                  })
                  processQueue()
                } else if (data.type === STREAM_DATA_TYPE.FINAL_ANSWER) {
                  messageQueue.push(async () => {
                    setIsRenderingData(true)
                    triggerGenerateKlineChart(data.msg_id, data.thread_id, data.content)
                      .then((res: any) => {
                        if (res.isSuccess) {
                          if (res.data.charts.length > 0) {
                            triggerGetAiBotChatContents({ threadId: data.thread_id, evmAddress })
                          }
                        }
                      })
                    await steamRenderText({
                      id,
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
                    id,
                    type: data.type,
                    streamText: data.content || '',
                  })
                })
                processQueue()
                setTimeout(() => {
                  dispatch(combineResponseData())
                }, 1000)
              }
            } catch (error) {
              console.error('Error parsing SSE message:', error)
            }
          }
        }
      } catch (err) {
        window.abortController?.abort()
        setIsRenderingData(false)
        setIsAnalyzeContent(false)
        setIsLoadingData(false)
        throw err
      } finally {
        reader.releaseLock()
      }

      // 确保所有消息都被处理
      await processQueue()
      
    } catch (error) {
      console.error('StreamError:', error)
    }
  }, [currentAiThreadId, aiChatKey, evmAddress, triggerGenerateKlineChart, dispatch, triggerGetAiBotChatContents, steamRenderText, setThreadsList, setCurrentRenderingId, setCurrentAiThreadId, triggerGetAiBotChatThreads, setIsRenderingData, setIsAnalyzeContent, setIsLoadingData])
}


export function useGetOpenAiData() {
  const [, setIsRenderingData] = useIsRenderingData()
  const [triggerChatCompletions] = useLazyOpenAiChatCompletionsQuery()
  return useCallback(async ({
    userValue,
    systemValue,
  }: {
    userValue: string
    systemValue: string
  }) => {
    try {
      const data = await triggerChatCompletions({
        userContent: userValue,
        systemContent: systemValue,
      })
      return data
    } catch (error) {
      setIsRenderingData(false)
      return error
    }
  }, [setIsRenderingData, triggerChatCompletions])
}

export function useGetChartImg() {
  const [triggerChartImg] = useLazyChartImgQuery()
  return useCallback(async (param: any) => {
    try {
      const data = await triggerChartImg(param)
      return data
    } catch (error) {
      return error
    }
  }, [triggerChartImg])
}

export function useSendAiContent() {
  // const getStreamData = useGetOpenAiData()
  const isLogin = useIsLogin()
  const getStreamData = useGetAiStreamData()
  const [, setValue] = useInputValue()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const [isLoading, setIsLoading] = useIsLoadingData()
  const [, setIsAnalyzeContent] = useIsAnalyzeContent()
  const [aiResponseContentList, setAiResponseContentList] = useAiResponseContentList()
  return useCallback(async ({
    value,
    nextAiResponseContentList,
  }: {
    value: string
    nextAiResponseContentList?: TempAiContentDataType[]
  }) => {
    if (!value || isLoading || !isLogin) return
    try {
      setIsLoading(true)
      setIsAnalyzeContent(true)
      setAiResponseContentList(
        [
          ...(nextAiResponseContentList || aiResponseContentList),
          {
            id: `${nanoid()}`,
            content: value,
            feedback: null,
            thoughtContentList: [],
            sourceListDetails: [],
            role: ROLE_TYPE.USER,
            timestamp: new Date().getTime(),
          }
        ]
      )
      setValue('')
      await getStreamData({
        threadId: currentAiThreadId,
        userValue: value,
      })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }, [isLogin, isLoading, aiResponseContentList, currentAiThreadId, setIsAnalyzeContent, setAiResponseContentList, setIsLoading, setValue, getStreamData])
}

export function useGetThreadsList() {
  const [, setThreadsList] = useThreadsList()
  const { getState } = useStore()
  const [, setHasLoadThreadsList] = useHasLoadThreadsList()
  const [, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [triggerGetAiBotChatThreads] = useLazyGetAiBotChatThreadsQuery()
  return useCallback(async ({
    evmAddress,
  }: {
    evmAddress: string
  }) => {
    try {
      const currentAiThreadId = (getState() as RootState).tradeaicache.currentAiThreadId
      const data = await triggerGetAiBotChatThreads({ account: evmAddress })
      const list = (data.data as any).map((data: any) => ({
        threadId: data.thread_id,
        title: data.title,
        createdAt: data.created_at,
      }))
      if (currentAiThreadId && !list.some((data: any) => data.threadId === currentAiThreadId)) {
        setCurrentAiThreadId('')
      }
      setThreadsList(list)
      setHasLoadThreadsList(true)
      return data
    } catch (error) {
      return error
    }
  }, [getState, setHasLoadThreadsList, setCurrentAiThreadId, setThreadsList, triggerGetAiBotChatThreads])
}

export function useGetAiBotChatContents() {
  const dispatch = useDispatch()
  const [, setAiResponseContentList] = useAiResponseContentList()
  const [, setIsLoadingAiContent] = useIsLoadingAiContent()
  const [triggerGetAiBotChatContents] = useLazyGetAiBotChatContentsQuery()
  return useCallback(async ({
    threadId,
    evmAddress,
  }: {
    threadId: string
    evmAddress: string
  }) => {
    try {
      setIsLoadingAiContent(true)
      const data = await triggerGetAiBotChatContents({
        threadId,
        account: evmAddress,
      })
      const chatContents = [...(data as any).data].sort((a: any, b: any) => a.createdAt - b.createdAt)
      const list: TempAiContentDataType[] = []
      chatContents.forEach((data: any) => {
        const { content, created_at, msg_id, thread_id } = data
        const { agent_response, user_query, thinking_steps, source_list_details, kline_charts, backtest_result, task_id } = content
        list.push({
          id: msg_id,
          feedback: null,
          content: user_query,
          thoughtContentList: [],
          sourceListDetails: [],
          role: ROLE_TYPE.USER,
          timestamp: created_at,
        }, {
          id: msg_id,
          feedback: null,
          content: agent_response,
          thoughtContentList: thinking_steps,
          sourceListDetails: source_list_details,
          role: ROLE_TYPE.ASSISTANT,
          timestamp: created_at,
          klineCharts: kline_charts,
          backtestData: backtest_result?.result,
          taskId: task_id,
          threadId: thread_id,
        })
      })
      dispatch(resetTempAiContentData())
      setAiResponseContentList(list)
      setIsLoadingAiContent(false)
      return data
    } catch (error) {
      setIsLoadingAiContent(false)
      return error
    }
  }, [dispatch, setIsLoadingAiContent, setAiResponseContentList, triggerGetAiBotChatContents])
}

export function useResetTempAiContentData() {
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(resetTempAiContentData())
  }, [dispatch])
}

export function useDeleteThread() {
  const [{ evmAddress }] = useUserInfo()
  const [currentAiThreadId, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [triggerDeleteThread] = useLazyDeleteThreadQuery()
  return useCallback(async (threadIds: string[]) => {
    try {
      const data = await triggerDeleteThread({
        threadIds,
        account: evmAddress,
      })
      if (currentAiThreadId && threadIds.includes(currentAiThreadId)) {
        setCurrentAiThreadId('')
      }
      return data
    } catch (error) {
      return error
    }
  }, [currentAiThreadId, evmAddress, setCurrentAiThreadId, triggerDeleteThread])
}

export function useGenerateKlineChart() {
  const [{ evmAddress }] = useUserInfo()
  const [triggerGenerateKlineChart] = useLazyGenerateKlineChartQuery()
  return useCallback(async (id: string, threadId: string, finalAnswer: string) => {
    try {
      const data = await triggerGenerateKlineChart({ id, threadId, account: evmAddress, finalAnswer })
      return data
    } catch (error) {
      return error
    }
  }, [evmAddress, triggerGenerateKlineChart])
}

export function useAudioTransferText(): PromiseReturnFun<Blob> {
  const [triggerAudioTranscriptions] = useLazyAudioTranscriptionsQuery()
  return useCallback(async (audioBlob: Blob) => {
    const data = await triggerAudioTranscriptions({ audioBlob })
    return data
  }, [triggerAudioTranscriptions])
}

export function useAiResponseContentList(): [TempAiContentDataType[], ParamFun<TempAiContentDataType[]>] {
  const dispatch = useDispatch()
  const aiResponseContentList = useSelector((state: RootState) => state.tradeai.aiResponseContentList)
  const setAiResponseContentList = useCallback((list: TempAiContentDataType[]) => {
    dispatch(changeAiResponseContentList({ aiResponseContentList: list }))
  }, [dispatch])
  return [aiResponseContentList, setAiResponseContentList]
}

export function useTempAiContentData() {
  const tempAiContentData = useSelector((state: RootState) => state.tradeai.tempAiContentData)
  return tempAiContentData
}

export function useFileList(): [File[], ParamFun<File[]>] {
  const dispatch = useDispatch()
  const fileList = useSelector((state: RootState) => state.tradeai.fileList)
  const setFileList = useCallback((list: File[]) => {
    dispatch(changeFileList({ fileList: list }))
  }, [dispatch])
  return [fileList, setFileList]
}

export function useIsFocus(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isFocus = useSelector((state: RootState) => state.tradeai.isFocus)
  const setIsFocus = useCallback((bool: boolean) => {
    dispatch(changeIsFocus({ isFocus: bool }))
  }, [dispatch])
  return [isFocus, setIsFocus]
}

export function useInputValue(): [string, ParamFun<string>] {
  const dispatch = useDispatch()
  const inputValue = useSelector((state: RootState) => state.tradeai.inputValue)
  const setInputValue = useCallback((value: string) => {
    dispatch(changeInputValue({ inputValue: value }))
  }, [dispatch])
  return [inputValue, setInputValue]
}

// 是否正在加载数据, 从请求到结果完全返回
export function useIsLoadingData(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isLoadingData = useSelector((state: RootState) => state.tradeai.isLoadingData)
  const setInputValue = useCallback((value: boolean) => {
    dispatch(changeIsLoadingData({ isLoadingData: value }))
  }, [dispatch])
  return [isLoadingData, setInputValue]
}

// 当前渲染的id，用于判断是否正在打字机效果渲染内容
export function useIsRenderingData(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isRenderingData = useSelector((state: RootState) => state.tradeai.isRenderingData)
  const setIsRenderingData = useCallback((value: boolean) => {
    dispatch(changeIsRenderingData({ isRenderingData: value }))
  }, [dispatch])
  return [isRenderingData, setIsRenderingData]
}

export function useCurrentRenderingId(): [string, ParamFun<string>] {
  const dispatch = useDispatch()
  const currentRenderingId = useSelector((state: RootState) => state.tradeai.currentRenderingId)
  const setCurrentRenderingId = useCallback((value: string) => {
    dispatch(changeCurrentRenderingId({ currentRenderingId: value }))
  }, [dispatch])
  return [currentRenderingId, setCurrentRenderingId]
}

export function useThreadsList(): [ThreadData[], ParamFun<ThreadData[]>] {
  const dispatch = useDispatch()
  const threadsList = useSelector((state: RootState) => state.tradeai.threadsList)
  const setThreadsList = useCallback((list: ThreadData[]) => {
    dispatch(changeThreadsList({ threadsList: list }))
  }, [dispatch])
  return [threadsList, setThreadsList]
}


export function useIsOpenAuxiliaryArea(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isOpenAuxiliaryArea = useSelector((state: RootState) => state.tradeai.isOpenAuxiliaryArea)
  const setIsOpenAuxiliaryArea = useCallback((isOpenAuxiliaryArea: boolean) => {
    dispatch(changeIsOpenAuxiliaryArea({ isOpenAuxiliaryArea }))
  }, [dispatch])
  return [isOpenAuxiliaryArea, setIsOpenAuxiliaryArea]
}


export function useDeleteContent() {
  const [{ evmAddress }] = useUserInfo()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const [triggerDeleteContent] = useLazyDeleteContentQuery()
  return useCallback(async (id: string) => {
    try {
      const data = await triggerDeleteContent({ id, threadId: currentAiThreadId, account: evmAddress })
      return data
    } catch (error) {
      return error
    }
  }, [currentAiThreadId, evmAddress, triggerDeleteContent])
}

export function useLikeContent() {
  const [currentAiThreadId] = useCurrentAiThreadId()
  const [triggerLikeContent] = useLazyLikeContentQuery()
  return useCallback(async (id: string) => {
    try {
      const data = await triggerLikeContent({ id, accountApiKey: '', threadId: currentAiThreadId, account: '' })
      return data
    } catch (error) {
      return error
    }
  }, [currentAiThreadId, triggerLikeContent])
}

export function useDislikeContent() {
  const [currentAiThreadId] = useCurrentAiThreadId()
  const [triggerDislikeContent] = useLazyDislikeContentQuery()
  return useCallback(async (id: string, content: string) => {
    try {
      const data = await triggerDislikeContent({ id, reason: content, accountApiKey: '', threadId: currentAiThreadId, account: '' })
      return data
    } catch (error) {
      return error
    }
  }, [currentAiThreadId, triggerDislikeContent])
}


export function useIsLoadingAiContent(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isLoadingAiContent = useSelector((state: RootState) => state.tradeai.isLoadingAiContent)
  const setIsLoadingAiContent = useCallback((value: boolean) => {
    dispatch(changeIsLoadingAiContent({ isLoadingAiContent: value }))
  }, [dispatch])
  return [isLoadingAiContent, setIsLoadingAiContent]
}

export function useIsShowInsightTradeAiContent(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isShowInsightTradeAiContent = useSelector((state: RootState) => state.tradeai.isShowInsightTradeAiContent)
  const setIsShowInsightTradeAiContent = useCallback((value: boolean) => {
    dispatch(changeIsShowInsightTradeAiContent({ isShowInsightTradeAiContent: value }))
  }, [dispatch])
  return [isShowInsightTradeAiContent, setIsShowInsightTradeAiContent]
}

export function useIsAnalyzeContent(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isAnalyzeContent = useSelector((state: RootState) => state.tradeai.isAnalyzeContent)
  const setIsAnalyzeContent = useCallback((value: boolean) => {
    dispatch(changeIsAnalyzeContent({ isAnalyzeContent: value }))
  }, [dispatch])
  return [isAnalyzeContent, setIsAnalyzeContent]
}

// [
//   {
//     content: 'BTC is going to the moon',
//     loadingStatus: LOADING_STATUS.SUCCESS,
//   },
//   {
//     content: 'ETH is going to the moon',
//     loadingStatus: LOADING_STATUS.LOADING,
//   },
  
// ]
export function useAnalyzeContentList(): [AnalyzeContentDataType[], ParamFun<AnalyzeContentDataType[]>] {
  const dispatch = useDispatch()
  const analyzeContentList = useSelector((state: RootState) => state.tradeai.analyzeContentList)
  const setAnalyzeContentList = useCallback((list: AnalyzeContentDataType[]) => {
    dispatch(changeAnalyzeContentList({ analyzeContentList: list }))
  }, [dispatch])
  return [analyzeContentList, setAnalyzeContentList]
}

export function useRecommandContentList(): [RecommandContentDataType[], ParamFun<RecommandContentDataType[]>] {
  const dispatch = useDispatch()
  const recommandContentList = useSelector((state: RootState) => state.tradeai.recommandContentList)
  const setRecommandContentList = useCallback((list: RecommandContentDataType[]) => {
    dispatch(changeRecommandContentList({ recommandContentList: list }))
  }, [dispatch])
  return [recommandContentList, setRecommandContentList]
}

export function useAddNewThread() {
  const [isAiLoading] = useIsLoadingData()
  const closeStream = useCloseStream()
  const resetTempAiContentData = useResetTempAiContentData()
  const [isRenderingData, setIsRenderingData] = useIsRenderingData()
  const [, setAiResponseContentList] = useAiResponseContentList()
  const [, setCurrentAiThreadId] = useCurrentAiThreadId()
  return useCallback(() => {
    if (isAiLoading || isRenderingData) return
    closeStream()
    setIsRenderingData(false)
    setCurrentAiThreadId('')
    setAiResponseContentList([])
    resetTempAiContentData()
  }, [isAiLoading, isRenderingData, resetTempAiContentData, setCurrentAiThreadId, setAiResponseContentList, closeStream, setIsRenderingData])
}

export function useOpenDeleteThread(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isOpenDeleteThread = useSelector((state: RootState) => state.tradeai.isOpenDeleteThread)
  const setIsOpenDeleteThread = useCallback((value: boolean) => {
    dispatch(changeIsOpenDeleteThread({ isOpenDeleteThread: value }))
  }, [dispatch])
  return [isOpenDeleteThread, setIsOpenDeleteThread]
}

export function useSelectThreadIds(): [string[], ParamFun<string[]>] {
  const dispatch = useDispatch()
  const selectThreadIds = useSelector((state: RootState) => state.tradeai.selectThreadIds)
  const setSelectThreadIds = useCallback((value: string[]) => {
    dispatch(changeSelectThreadIds({ selectThreadIds: value }))
  }, [dispatch])
  return [selectThreadIds, setSelectThreadIds]
}

export function useIsShowDefaultUi(): boolean {
  const [threadList] = useThreadsList()
  const [aiResponseContentList] = useAiResponseContentList()
  const tempAiContentData = useTempAiContentData()
  const [isRenderingData] = useIsRenderingData()
  const [isLoading] = useIsLoadingData()
  return useMemo(() => {
    return aiResponseContentList.length === 0 && !tempAiContentData.id && threadList.length === 0 && !(isLoading && !isRenderingData)
  }, [aiResponseContentList.length, tempAiContentData.id, threadList.length, isLoading, isRenderingData])
}

export function useIsShowDeepThink(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isShowDeepThink = useSelector((state: RootState) => state.tradeai.isShowDeepThink)
  const setIsShowDeepThink = useCallback((value: boolean) => {
    dispatch(changeIsShowDeepThink({ isShowDeepThink: value }))
  }, [dispatch])
  return [isShowDeepThink, setIsShowDeepThink]
}

export function useIsShowTaskDetails(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isShowTaskDetails = useSelector((state: RootState) => state.tradeai.isShowTaskDetails)
  const setIsShowTaskDetails = useCallback((value: boolean) => {
    dispatch(changeIsShowTaskDetails({ isShowTaskDetails: value }))
  }, [dispatch])
  return [isShowTaskDetails, setIsShowTaskDetails]
}

export function useCurrentAiContentDeepThinkData(): [TempAiContentDataType, ParamFun<TempAiContentDataType>] {
  const dispatch = useDispatch()
  const currentAiContentDeepThinkData = useSelector((state: RootState) => state.tradeai.currentAiContentDeepThinkData)
  const setCurrentAiContentDeepThinkData = useCallback((value: TempAiContentDataType) => {
    dispatch(changeCurrentAiContentDeepThinkData({ currentAiContentDeepThinkData: value }))
  }, [dispatch])
  return [currentAiContentDeepThinkData, setCurrentAiContentDeepThinkData]
}

export function useHasLoadThreadsList(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const hasLoadThreadsList = useSelector((state: RootState) => state.tradeai.hasLoadThreadsList)
  const setHasLoadThreadsList = useCallback((value: boolean) => {
    dispatch(changeHasLoadThreadsList({ hasLoadThreadsList: value }))
  }, [dispatch])
  return [hasLoadThreadsList, setHasLoadThreadsList]
}

export function useIsChatPageLoaded(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isChatPageLoaded = useSelector((state: RootState) => state.tradeai.isChatPageLoaded)
  const setIsChatPageLoaded = useCallback((value: boolean) => {
    dispatch(changeIsChatPageLoaded({ isChatPageLoaded: value }))
  }, [dispatch])
  return [isChatPageLoaded, setIsChatPageLoaded]
}
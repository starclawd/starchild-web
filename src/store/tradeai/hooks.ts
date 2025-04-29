import { useCallback, useMemo } from 'react'
import { RootState } from 'store'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { changeAiResponseContentList, changeAnalyzeContentList, changeCurrentRenderingId, changeFileList, changeInputValue, changeIsAnalyzeContent, changeIsFocus, changeIsLoadingAiContent, changeIsLoadingData, changeIsOpenAuxiliaryArea, changeIsOpenDeleteThread, changeIsRenderFinalAnswerContent, changeIsRenderingData, changeIsRenderObservationContent, changeIsRenderThoughtContent, changeIsShowInsightTradeAiContent, changeRecommandContentList, changeSelectThreadIds, changeThreadsList, combineResponseData, getAiSteamData, resetTempAiContentData } from './reducer'
import { AnalyzeContentDataType, CURRENT_MODEL, RecommandContentDataType, ROLE_TYPE, STREAM_DATA_TYPE, TempAiContentDataType, ThreadData } from './tradeai.d'
import { ParamFun, PromiseReturnFun } from 'types/global'
import { useCurrentAiThreadId } from 'store/tradeaicache/hooks'
import { tradeAiDomain } from 'utils/url'
import { useLazyAudioTranscriptionsQuery, useLazyDeleteContentQuery, useLazyDeleteThreadQuery, useLazyDislikeContentQuery, useLazyGetAiBotChatContentsQuery, useLazyGetAiBotChatThreadsQuery, useLazyLikeContentQuery, useLazyOpenAiChatCompletionsQuery } from 'api/tradeai'
import { useSleep } from 'hooks/useSleep'
import { nanoid } from '@reduxjs/toolkit'
import { useUserInfo } from 'store/login/hooks'

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
  const [, setIsRenderFinalAnswerContent] = useIsRenderFinalAnswerContent()
  const [, setIsRenderThoughtContent] = useIsRenderThoughtContent()
  const [, setIsRenderObservationContent] = useIsRenderObservationContent()
  return useCallback(async ({
    streamText,
    id = nanoid(),
    type = STREAM_DATA_TYPE.FINAL_ANSWER,
  }: {
    streamText: string
    id?: string
    type?: STREAM_DATA_TYPE
  }) => {
    window.eventSourceStatue = true
    let index = 0
    const sliceText = (startIndex: number, endIndex: number) => {
      return streamText.slice(startIndex * 5, endIndex * 5)
    }
    if (type === STREAM_DATA_TYPE.AGENT_THOUGHT) {
      setIsRenderThoughtContent(true)
    } else if (type === STREAM_DATA_TYPE.AGENT_OBSERVATION) {
      setIsRenderObservationContent(true)
    } else if (type === STREAM_DATA_TYPE.FINAL_ANSWER_CHUNK) {
      setIsRenderFinalAnswerContent(true)
    }
    if (type === STREAM_DATA_TYPE.FINAL_ANSWER) {
      setIsRenderFinalAnswerContent(false)
      setIsRenderThoughtContent(false)
      setIsRenderObservationContent(false)
    }
    while (sliceText(index, index + 1)) {
      let text = ''
      if (!window.eventSourceStatue) {
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
        dispatch(getAiSteamData({ aiSteamData: msg }))
        if (type === STREAM_DATA_TYPE.AGENT_OBSERVATION) {
          await sleep(5)
        } else {
          await sleep(34)
        }
      }
    }
    setIsRenderingData(false)
  }, [sleep, dispatch, setIsRenderingData, setIsRenderFinalAnswerContent, setIsRenderThoughtContent, setIsRenderObservationContent])
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
  const [triggerGetAiBotChatThreads] = useLazyGetAiBotChatThreadsQuery()
  return useCallback(async ({
    userValue,
    threadId,
  }: {
    userValue: string
    threadId: string
  }) => {
    try {
      // const domain = tradeAiDomain['restfulDomain' as keyof typeof tradeAiDomain]
      const domain = 'http://54.169.231.27:8008'
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

      await fetchEventSource(`${domain}/chat`, {
        method: 'POST',
        openWhenHidden: true,
        headers: {
          'ACCOUNT-ID': `${evmAddress || ''}`,
          'ACCOUNT-API-KEY': `${aiChatKey || ''}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
        signal: window.abortController.signal,
        onmessage(msg) {
          const data = JSON.parse(msg.data)
          if (data.type !== STREAM_DATA_TYPE.ERROR) {
            setCurrentRenderingId(id)
            if (data.type === STREAM_DATA_TYPE.DONE) {
              messageQueue.push(async () => {
                setIsRenderingData(false)
                dispatch(combineResponseData())
                if (!currentAiThreadId) {
                  const result = await triggerGetAiBotChatThreads({ account: '', aiChatKey: '' })
                  setCurrentAiThreadId(data.threadId)
                  const list = (result.data as any).chatThreads || []
                  setThreadsList(list)
                }
                await triggerGetAiBotChatContents(currentAiThreadId ||data.threadId)
              })
              processQueue()
              setCurrentRenderingId('')
            } else if (data.type === STREAM_DATA_TYPE.AGENT_THOUGHT || data.type === STREAM_DATA_TYPE.AGENT_OBSERVATION || data.type === STREAM_DATA_TYPE.FINAL_ANSWER || data.type === STREAM_DATA_TYPE.TRADE_COMMAND || data.type === STREAM_DATA_TYPE.FINAL_ANSWER_CHUNK) {
              messageQueue.push(async () => {
                setIsRenderingData(true)
                await steamRenderText({
                  id,
                  type: data.type,
                  streamText: `${data.type === STREAM_DATA_TYPE.TRADE_COMMAND ? '--' : ''}${data.content}${(data.type === STREAM_DATA_TYPE.AGENT_THOUGHT || data.type === STREAM_DATA_TYPE.AGENT_OBSERVATION) ? '\nPREFIX\n' : ''}`,
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
        },
        onerror(err) {
          window.abortController?.abort()
          throw err
        }
      })

      // 确保所有消息都被处理
      await processQueue()
      
    } catch (error) {
      console.error('StreamError:', error)
    }
  }, [currentAiThreadId, aiChatKey, evmAddress, dispatch, triggerGetAiBotChatContents, steamRenderText, setThreadsList, setCurrentRenderingId, setCurrentAiThreadId, triggerGetAiBotChatThreads, setIsRenderingData])
}


export function useGetOpenAiData() {
  const dispatch = useDispatch()
  const [, setIsRenderingData] = useIsRenderingData()
  const [aiResponseContentList] = useAiResponseContentList()
  const [triggerChatCompletions] = useLazyOpenAiChatCompletionsQuery()
  const steamRenderText = useSteamRenderText()
  return useCallback(async ({
    userValue,
    threadId,
  }: {
    userValue: string
    threadId: string
  }) => {
    try {
      window.eventSourceStatue = true
      const roleTypeMap = {
        [ROLE_TYPE.USER]: 'user',
        [ROLE_TYPE.ASSISTANT]: 'assistant',
      }
      const lastContextList = aiResponseContentList.map((data) => {
        return {
          role: roleTypeMap[data.role],
          content: data.content
        }
      })
      const systemValue = ''
      const data = await triggerChatCompletions({
        // model: 'gpt-4o',
        model: 'gpt-4o-mini-2024-07-18',
        // test model
        // model: 'ft:gpt-4o-mini-2024-07-18:jojo:test-2025-01-02:AlAEvrnQ',
        // model: 'ft:gpt-4o-mini-2024-07-18:jojo:test-2025-01-07:An5HXiVI',
        // model: 'ft:gpt-4o-mini-2024-07-18:jojo:test-2025-01-08:AnQl39hH',
        // model: 'ft:gpt-4o-mini-2024-07-18:jojo:test-2025-01-08-22-55:AnSEni5n',
        // product model
        // model: 'ft:gpt-4o-mini-2024-07-18:jojo:production-2025-01-02:AlCncIIq',
        // model: 'ft:gpt-4o-mini-2024-07-18:jojo:production-2025-01-09:Angh4a0h',
        messages: [
          {
            role: 'system', 
            content: systemValue
          },
          ...lastContextList,
          {
            role: 'user',
            content: userValue
          }
        ]
      })
      await steamRenderText({
        streamText: data.data.choices[0].message.content,
      })
      setTimeout(() => {
        setIsRenderingData(false)
        dispatch(combineResponseData())
      }, 17)
      return data
    } catch (error) {
      setIsRenderingData(false)
      return error
    }
  }, [aiResponseContentList, steamRenderText, dispatch, setIsRenderingData, triggerChatCompletions])
}

export function useSendAiContent() {
  // const getStreamData = useGetOpenAiData()
  const getStreamData = useGetAiStreamData()
  const [, setValue] = useInputValue()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const [isLoading, setIsLoading] = useIsLoadingData()
  const [, setIsRenderFinalAnswerContent] = useIsRenderFinalAnswerContent()
  const [aiResponseContentList, setAiResponseContentList] = useAiResponseContentList()
  return useCallback(async ({
    value,
    inputRef,
    nextAiResponseContentList,
  }: {
    value: string
    nextAiResponseContentList?: TempAiContentDataType[]
    inputRef?: any
  }) => {
    if (!value || isLoading) return
    try {
      setIsLoading(true)
      setAiResponseContentList(
        [
          ...(nextAiResponseContentList || aiResponseContentList),
          {
            id: `${nanoid()}`,
            content: value,
            observationContent: '',
            feedback: null,
            thoughtContent: '',
            role: ROLE_TYPE.USER
          }
        ]
      )
      setValue('')
      if (inputRef?.current) {
        inputRef.current.style.height = '24px'
      }
      await getStreamData({
        threadId: currentAiThreadId,
        userValue: value,
      })
      setIsLoading(false)
      setIsRenderFinalAnswerContent(false)
    } catch (error) {
      setIsLoading(false)
      setIsRenderFinalAnswerContent(false)
    }
  }, [isLoading, aiResponseContentList, currentAiThreadId, setIsRenderFinalAnswerContent, setAiResponseContentList, setIsLoading, setValue, getStreamData])
}

export function useGetThreadsList() {
  const [{ evmAddress }] = useUserInfo()
  const [, setThreadsList] = useThreadsList()
  const { getState } = useStore()
  const [, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [triggerGetAiBotChatThreads] = useLazyGetAiBotChatThreadsQuery()
  return useCallback(async () => {
    try {
      if (!evmAddress) return
      const currentAiThreadId = (getState() as RootState).tradeaicache.currentAiThreadId
      const data = await triggerGetAiBotChatThreads({ account: evmAddress })
      const list = (JSON.parse(data.data as any) || []).map((data: any) => ({
        threadId: data.thread_id,
        title: data.title,
        createdAt: data.created_at,
      }))
      if (currentAiThreadId && !list.some((data: any) => data.threadId === currentAiThreadId)) {
        setCurrentAiThreadId('')
      }
      setThreadsList(list)
      return data
    } catch (error) {
      return error
    }
  }, [evmAddress, getState, setCurrentAiThreadId, setThreadsList, triggerGetAiBotChatThreads])
}

export function useGetAiBotChatContents() {
  const dispatch = useDispatch()
  const [, setAiResponseContentList] = useAiResponseContentList()
  const [, setIsLoadingAiContent] = useIsLoadingAiContent()
  const [triggerGetAiBotChatContents] = useLazyGetAiBotChatContentsQuery()
  return useCallback(async (threadId: string) => {
    try {
      setIsLoadingAiContent(true)
      const data = await triggerGetAiBotChatContents({
        threadId,
        account: '',
        aiChatKey: '',
      })
      const chatContents = [...(data.data as any).chatContents].sort((a, b) => a.createdAt - b.createdAt)
      const list: TempAiContentDataType[] = []
      chatContents.forEach((data) => {
        const { content, id, feedback } = data
        const { agentProcess, userQuestion, finalAnswer, tradeCommand, observations, tradeDetail } = content
        const thoughtContent = agentProcess
          .filter((data: any) => data.type === STREAM_DATA_TYPE.AGENT_THOUGHT)
          .map((data: any) => data.content).join('\nPREFIX\n')
        const observationContent = observations?.join('\nPREFIX\n') || ''
        list.push({
          id,
          feedback,
          content: userQuestion,
          observationContent: '',
          thoughtContent: '',
          role: ROLE_TYPE.USER,
        }, {
          id,
          feedback,
          tradeDetail,
          content: `${finalAnswer}${tradeCommand ? `--${tradeCommand}` : ''}`,
          thoughtContent,
          observationContent,
          role: ROLE_TYPE.ASSISTANT,
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
  return useCallback(async (threadId: string) => {
    try {
      const data = await triggerDeleteThread({
        threadId,
        account: evmAddress,
      })
      if (currentAiThreadId === threadId) {
        setCurrentAiThreadId('')
      }
      return data
    } catch (error) {
      return error
    }
  }, [currentAiThreadId, evmAddress, setCurrentAiThreadId, triggerDeleteThread])
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

// [
//   {
//       "threadId": "f5606d70-bff5-40f7-8091-0182430c74a1",
//       "createdAt": 1744964114674,
//       "title": "Can you give me a quick technical analysis of BTC and ETH for today?",
//   },
//   {
//       "threadId": "a09cd2c6-48b9-44e5-bbdd-de2f6faf0b24",
//       "createdAt": 1744350968595,
//       "title": "place a btc market order",
//   },
//   {
//       "threadId": "a09cd2c6-48b9-44e5-bbdd-de2f6faf0b25",
//       "createdAt": 1744350968596,
//       "title": "place a btc market order",
//   },
//   {
//       "threadId": "a09cd2c6-48b9-44e5-bbdd-de2f6faf0b26",
//       "createdAt": 1744350968597,
//       "title": "place a btc market order",
//   },
//   {
//       "threadId": "a09cd2c6-48b9-44e5-bbdd-de2f6faf0b27",
//       "createdAt": 1744350968598,
//       "title": "place a btc market order",
//   },
//   {
//       "threadId": "a09cd2c6-48b9-44e5-bbdd-de2f6faf0b28",
//       "createdAt": 1744350968599,
//       "title": "place a btc market order",
//   },
//   {
//       "threadId": "a09cd2c6-48b9-44e5-bbdd-de2f6faf0b29",
//       "createdAt": 1744350968600,
//       "title": "place a btc market order",
//   },
//   {
//       "threadId": "a09cd2c6-48b9-44e5-bbdd-de2f6faf0b30",
//       "createdAt": 1744350968601,
//       "title": "place a btc market order",
//   },
//   {
//       "threadId": "a09cd2c6-48b9-44e5-bbdd-de2f6faf0b31",
//       "createdAt": 1744350968602,
//       "title": "place a btc market order",
//   },
  
// ]
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
  const [currentAiThreadId] = useCurrentAiThreadId()
  const [triggerDeleteContent] = useLazyDeleteContentQuery()
  return useCallback(async (id: string) => {
    try {
      const data = await triggerDeleteContent({ id, accountApiKey: '', threadId: currentAiThreadId, account: '' })
      return data
    } catch (error) {
      return error
    }
  }, [currentAiThreadId, triggerDeleteContent])
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


export function useIsRenderFinalAnswerContent(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isRenderFinalAnswerContent = useSelector((state: RootState) => state.tradeai.isRenderFinalAnswerContent)
  const setIsRenderFinalAnswerContent = useCallback((value: boolean) => {
    dispatch(changeIsRenderFinalAnswerContent({ isRenderFinalAnswerContent: value }))
  }, [dispatch])
  return [isRenderFinalAnswerContent, setIsRenderFinalAnswerContent]
}

export function useIsRenderThoughtContent(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isRenderThoughtContent = useSelector((state: RootState) => state.tradeai.isRenderThoughtContent)
  const setIsRenderThoughtContent = useCallback((value: boolean) => {
    dispatch(changeIsRenderThoughtContent({ isRenderThoughtContent: value }))
  }, [dispatch])
  return [isRenderThoughtContent, setIsRenderThoughtContent]
}

export function useIsRenderObservationContent(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isRenderObservationContent = useSelector((state: RootState) => state.tradeai.isRenderObservationContent)
  const setIsRenderObservationContent = useCallback((value: boolean) => {
    dispatch(changeIsRenderObservationContent({ isRenderObservationContent: value }))
  }, [dispatch])
  return [isRenderObservationContent, setIsRenderObservationContent]
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
import { useCallback } from 'react'
import { RootState } from 'store'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { changeAiResponseContentList, changeAllNewsData, changeAnalyzeContentList, changeCurrentRenderingId, changeFileList, changeInputValue, changeIsAnalyzeContent, changeIsFocus, changeIsGrabbingTradeAi, changeIsLoadingAiContent, changeIsLoadingData, changeIsOpenAuxiliaryArea, changeIsRenderFinalAnswerContent, changeIsRenderingData, changeIsRenderObservationContent, changeIsRenderThoughtContent, changeIsShowInsightTradeAiContent, changeRecommandContentList, changeThreadsList, combineResponseData, getAiSteamData, resetTempAiContentData } from './reducer'
import { AnalyzeContentDataType, CURRENT_MODEL, LOADING_STATUS, NewsDataType, RecommandContentDataType, ROLE_TYPE, STREAM_DATA_TYPE, TempAiContentDataType, ThreadData } from './tradeai.d'
import { ParamFun, PromiseReturnFun } from 'types/global'
import { useCurrentAiThreadId } from 'store/tradeaicache/hooks'
import { isLocalEnv, tradeAiDomain } from 'utils/url'
import { useLazyAudioTranscriptionsQuery, useLazyChatCompletionsQuery, useLazyDeleteContentQuery, useLazyDeleteThreadQuery, useLazyDislikeContentQuery, useLazyGetAiBotChatContentsQuery, useLazyGetAiBotChatThreadsQuery, useLazyGetAllNewsQuery, useLazyLikeContentQuery, useLazyOpenAiChatCompletionsQuery, useLazySaveCommandResultQuery } from 'api/tradeai'
import { useSleep } from 'hooks/useSleep'
import { nanoid } from '@reduxjs/toolkit'
import { useWindowSize } from 'hooks/useWindowSize'
import { PAGE_SIZE } from 'constants/index'
// import tiktoken
// encoding = tiktoken.encoding_for_model("gpt-4")
// tokens = encoding.encode("yes")

export function useCloseStream() {
  return useCallback(() => {
    window.eventSourceStatue = false
    setTimeout(() => {
      window.eventSourceStatue = true
    }, 3000)
  }, [])
}

export function isTradeConfigResponse(response : string) {
  try {
    const data = JSON.parse(response)
    return !!(data.layouts || data.styles || data.hasOwnProperty('isShowExpand') || data.expandLayouts || data.shouldRender)
  } catch (error) {
    return false
  }
}

export function isTradeCommandResponse(response : string) {
  try {
    const list = response.split('--')
    const data = JSON.parse(list[list.length - 1])
    return data.action === 'trade' ||
      data.action === 'borrow' ||
      data.action === 'bridge' ||
      data.action === 'deposit' ||
      data.action === 'download' ||
      data.action === 'repay' ||
      data.action === 'stake' ||
      data.action === 'swap' ||
      data.action === 'withdraw' ||
      data.action === 'transfer' ||
      data.action === '1000x' ||
      data.action === 'grid'
  } catch (error) {
    return false
  }
}

export function isNanCommandResponse(response : string) {
  try {
    const list = response.split('--')
    const data = JSON.parse(list[list.length - 1])
    return data.action === 'nan'
  } catch (error) {
    return false
  }
}

export function parseTradeDetailContent(text: string): {
  [props: string]: string
} {
  try {
    const data = JSON.parse(text)
    return data
  } catch (error) {
    return {}
  }
}

export function parseTradeCommandContent(text: string): [
  {
    [props: string]: string
  },
  string
] {
  // const result = {}
  // // 匹配字符串中的键值对，并将其转为对象
  // const regex = /(\w+)\(([^)]+)\)/g
  // let match: RegExpExecArray | null
  // while ((match = regex.exec(text)) !== null) {
  //   const key = match[1]
  //   const value = match[2] || ''
  //   // 将提取到的键和值放入对象中
  //   result[key] = value
  // }
  try {
    const list = text.split('--')
    const data = JSON.parse(list[list.length - 1])
    return [data, list[0]]
  } catch (error) {
    return [{}, '']
  }
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
    if (isTradeConfigResponse(streamText) || isTradeCommandResponse(streamText) || type === STREAM_DATA_TYPE.FINAL_ANSWER || type === STREAM_DATA_TYPE.ERROR || type === STREAM_DATA_TYPE.AGENT_THOUGHT || type === STREAM_DATA_TYPE.AGENT_OBSERVATION) {
      window.eventSourceStatue = false
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

export function useGetInnerStreamData() {
  const [, setIsRenderingData] = useIsRenderingData()
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const [currentAiThreadId, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [triggerChatCompletions] = useLazyChatCompletionsQuery()
  return useCallback(async ({
    userValue,
    threadId,
  }: {
    userValue: string
    threadId: string
  }) => {
    try {
      window.eventSourceStatue = true
      const data = await triggerChatCompletions({
        threadId,
        account: '',
        content: encodeURIComponent(userValue),
      })
      // await steamRenderText(data.data.content)
      if (!currentAiThreadId) {
        triggerGetAiBotChatThreads()
        setCurrentAiThreadId((data.data as any).threadId)
      }
      return data
    } catch (error) {
      setIsRenderingData(false)
      return error
    }
  }, [currentAiThreadId, setCurrentAiThreadId, triggerGetAiBotChatThreads, setIsRenderingData, triggerChatCompletions])
}

export function useGetAiStreamData() {
  const dispatch = useDispatch()
  const authToken = ''
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
      const formData = new FormData()
      formData.append('account', '')
      formData.append('threadId', threadId)
      formData.append('content', userValue)
      formData.append('accountApiKey', '')
      formData.append('chatModel', CURRENT_MODEL.FLEX_CRAFT)

      await fetchEventSource(`${isLocalEnv ? 'https://ai-bot-api.base-sepolia.jojo.exchange' : domain}/chat`, {
        method: 'POST',
        openWhenHidden: true,
        headers: {
          // FormData不需要设置Content-Type,浏览器会自动设置正确的Content-Type和boundary
          'authorization': `Bearer ${authToken || ''}`
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
  }, [currentAiThreadId, setCurrentAiThreadId, triggerGetAiBotChatThreads, setIsRenderingData])
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
  // const getStreamData = useGetMokeAiContent()
  // const getStreamData = useGetInnerStreamData()
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
  const [, setThreadsList] = useThreadsList()
  const { getState } = useStore()
  const [, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [triggerGetAiBotChatThreads] = useLazyGetAiBotChatThreadsQuery()
  return useCallback(async () => {
    try {
      const currentAiThreadId = (getState() as RootState).tradeaicache.currentAiThreadId
      const data = await triggerGetAiBotChatThreads({ account: '', aiChatKey: '' })
      const list = (data.data as any).chatThreads || []
      if (currentAiThreadId && !list.some((data: any) => data.threadId === currentAiThreadId)) {
        setCurrentAiThreadId('')
      }
      setThreadsList(list)
      return data
    } catch (error) {
      return error
    }
  }, [getState, setCurrentAiThreadId, setThreadsList, triggerGetAiBotChatThreads])
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
  const [currentAiThreadId, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [triggerDeleteThread] = useLazyDeleteThreadQuery()
  return useCallback(async (threadId: string) => {
    try {
      const data = await triggerDeleteThread({
        threadId,
        account: '',
        aiChatKey: '',
      })
      if (currentAiThreadId === threadId) {
        setCurrentAiThreadId('')
      }
      return data
    } catch (error) {
      return error
    }
  }, [currentAiThreadId, setCurrentAiThreadId, triggerDeleteThread])
}


export function useAudioTransferText(): PromiseReturnFun<Blob> {
  const [triggerAudioTranscriptions] = useLazyAudioTranscriptionsQuery()
  return useCallback(async (audioBlob: Blob) => {
    const data = await triggerAudioTranscriptions({ audioBlob })
    return data
  }, [triggerAudioTranscriptions])
}

// [
//   {
//       "id": '3188',
//       "feedback": null,
//       "content": "Can you give me a quick technical analysis of BTC and ETH for today?",
//       "observationContent": "",
//       "thoughtContent": "",
//       "role": ROLE_TYPE.USER
//   },
//   {
//       "id": '3188',
//       "feedback": null,
//       "content": "BTC is holding around $84,731, staying in a tight $83k-$86k range. Support sits at $80k, with resistance at $90k. RSI is near 60, hinting at a possible overbought condition soon. If BTC breaks above $86k, a quick ride to $90k could be on the cards. Watch out for geopolitical factors impacting moves.\n\nETH is near $1,586, recovering slightly. Support is at $1,480, resistance at $1,615. RSI is about 48, indicating neutrality. A potential bounce could happen, targeting $1,800 if it gains momentum. Keep an eye on network updates that might spur action.",
//       "thoughtContent": "Classification Result: {\n  \"needs_agents\": true,\n  \"agents\": [\"Technical_agent\"]\n}\nPREFIX\nI need to search for relevant information to answer this question. I will use the following experts to help: Technical_agent",
//       "observationContent": "{\"Technical Analysis for ETH\":\"Ethereum (ETH) is currently trading around $1,586, reflecting a modest recovery after recent volatility. The market is cautious amid a broader crypto downturn in 2025, with ETH having lost significant ground since late 2024. Institutional interest has waned, highlighted by Blackrock’s Ethereum ETF reporting zero inflows recently, which has dampened buying pressure and contributed to a slight price pullback. Trading volumes have declined alongside active addresses, signaling reduced market participation and a neutral to bearish sentiment overall[1][5].\\n\\nTechnically, Ethereum’s RSI near 48 indicates a neutral stance, while the MACD remains negative, suggesting bearish momentum in the short term. Key support lies near $1,480, the recent 52-week low, while resistance is seen around $1,615, the intraday high from recent sessions. The ETH/BTC ratio is at a five-year low, underscoring Ethereum’s underperformance relative to Bitcoin. However, technical analyst Michael van de Poppe forecasts a potential 20% rally in the coming weeks, driven by oversold conditions and upcoming network upgrades like Pectra and Fusaka, which aim to improve transaction speed and cost efficiency[1][5].\\n\\nGiven the current environment, a cautious trading approach is advisable. Consider entering long positions near strong support at $1,480-$1,500, with a stop-loss slightly below $1,470 to limit downside risk. Target the $1,800 level initially, which aligns with prior resistance and potential upside from anticipated technical improvements and possible renewed institutional interest if Ethereum ETF staking proposals gain regulatory approval in June. This strategy balances the current bearish momentum with the prospect of a technical rebound and fundamental catalysts[1][5].\",\"Technical Analysis for BTC\":\"Bitcoin is currently trading at $84,731.54, reflecting a stabilization within the $83,000 to $86,000 range. This stability is partly due to traders balancing bullish bets with downside protection strategies. The broader market context is influenced by geopolitical tensions, particularly between U.S. President Trump and Federal Reserve Chair Jerome Powell, which has introduced uncertainty into financial markets. Despite these challenges, Bitcoin has shown resilience, maintaining its dominance in the crypto market with a 59.1% share of the total market capitalization[2][3].\\n\\nFrom a technical standpoint, Bitcoin's price is being closely watched for potential breakouts above $90,000, driven by factors such as monetary stimulus in China and Europe, and Bitcoin's decoupling from traditional markets[4]. Key technical levels include support at $80,000 and resistance at $90,000. The Relative Strength Index (RSI) is around 60, indicating a neutral position but leaning towards being overbought if it crosses 70. Traders are actively purchasing call options with strike prices between $90,000 and $100,000, suggesting optimism about future price increases[2]. The Fear & Greed Index is at 30, indicating fear, which could lead to volatility[1].\\n\\nGiven the current market dynamics, a trading recommendation would be to enter a long position if Bitcoin breaks above $86,000, targeting $90,000 as a short-term price target. A stop-loss should be set at $82,000 to mitigate potential losses if the price reverses. This strategy leverages the bullish sentiment and technical indicators pointing towards a potential rally. However, traders should remain cautious due to the geopolitical uncertainties and potential regulatory changes that could impact Bitcoin's price[2][4].\"}",
//       "role": ROLE_TYPE.ASSISTANT
//   },
//   {
//       "id": '3189',
//       "feedback": null,
//       "content": "give some advise about common sence",
//       "observationContent": "",
//       "thoughtContent": "",
//       "role": ROLE_TYPE.USER
//   },
//   {
//       "id": '3189',
//       "feedback": null,
//       "content": "In the crypto world, common sense is your best friend. Trust your instincts, but don't ignore the basics. Always do your own research before jumping into trades. Avoid FOMO; if something sounds too good to be true, it probably is. Stay informed about market trends and be wary of hype. Keep emotions in check and make decisions based on data. Stay secure: protect your assets and use reputable platforms. Remember, the market's volatile—plan for the long haul and don't chase quick gains.",
//       "thoughtContent": "Classification Result: {\n  \"needs_agents\": false,\n  \"response\": \"Common sense is all about practical and sound judgment in everyday situations. Here are some tips: \\n1. Think before you act or speak, considering the potential consequences. \\n2. Trust your instincts but verify facts when necessary. \\n3. Learn from past experiences, both your own and others. \\n4. Keep things simple and avoid overcomplicating issues. \\n5. Stay informed and use critical thinking. \\nRemember, common sense varies among individuals and cultures, so stay adaptable and open-minded.\"\n}\nPREFIX\nI know the answer to this question",
//       "observationContent": "",
//       "role": ROLE_TYPE.ASSISTANT
//   }
// ]
export function useAiResponseContentList(): [TempAiContentDataType[], ParamFun<TempAiContentDataType[]>] {
  const dispatch = useDispatch()
  const aiResponseContentList = useSelector((state: RootState) => state.tradeai.aiResponseContentList)
  const setAiResponseContentList = useCallback((list: TempAiContentDataType[]) => {
    dispatch(changeAiResponseContentList({ aiResponseContentList: list }))
  }, [dispatch])
  return [[
    {
        "id": '3188',
        "feedback": null,
        "content": "Can you give me a quick technical analysis of BTC and ETH for today?",
        "observationContent": "",
        "thoughtContent": "",
        "role": ROLE_TYPE.USER
    },
    {
        "id": '3188',
        "feedback": null,
        "content": "BTC is holding around $84,731, staying in a tight $83k-$86k range. Support sits at $80k, with resistance at $90k. RSI is near 60, hinting at a possible overbought condition soon. If BTC breaks above $86k, a quick ride to $90k could be on the cards. Watch out for geopolitical factors impacting moves.\n\nETH is near $1,586, recovering slightly. Support is at $1,480, resistance at $1,615. RSI is about 48, indicating neutrality. A potential bounce could happen, targeting $1,800 if it gains momentum. Keep an eye on network updates that might spur action.",
        "thoughtContent": "Classification Result: {\n  \"needs_agents\": true,\n  \"agents\": [\"Technical_agent\"]\n}\nPREFIX\nI need to search for relevant information to answer this question. I will use the following experts to help: Technical_agent",
        "observationContent": "{\"Technical Analysis for ETH\":\"Ethereum (ETH) is currently trading around $1,586, reflecting a modest recovery after recent volatility. The market is cautious amid a broader crypto downturn in 2025, with ETH having lost significant ground since late 2024. Institutional interest has waned, highlighted by Blackrock’s Ethereum ETF reporting zero inflows recently, which has dampened buying pressure and contributed to a slight price pullback. Trading volumes have declined alongside active addresses, signaling reduced market participation and a neutral to bearish sentiment overall[1][5].\\n\\nTechnically, Ethereum’s RSI near 48 indicates a neutral stance, while the MACD remains negative, suggesting bearish momentum in the short term. Key support lies near $1,480, the recent 52-week low, while resistance is seen around $1,615, the intraday high from recent sessions. The ETH/BTC ratio is at a five-year low, underscoring Ethereum’s underperformance relative to Bitcoin. However, technical analyst Michael van de Poppe forecasts a potential 20% rally in the coming weeks, driven by oversold conditions and upcoming network upgrades like Pectra and Fusaka, which aim to improve transaction speed and cost efficiency[1][5].\\n\\nGiven the current environment, a cautious trading approach is advisable. Consider entering long positions near strong support at $1,480-$1,500, with a stop-loss slightly below $1,470 to limit downside risk. Target the $1,800 level initially, which aligns with prior resistance and potential upside from anticipated technical improvements and possible renewed institutional interest if Ethereum ETF staking proposals gain regulatory approval in June. This strategy balances the current bearish momentum with the prospect of a technical rebound and fundamental catalysts[1][5].\",\"Technical Analysis for BTC\":\"Bitcoin is currently trading at $84,731.54, reflecting a stabilization within the $83,000 to $86,000 range. This stability is partly due to traders balancing bullish bets with downside protection strategies. The broader market context is influenced by geopolitical tensions, particularly between U.S. President Trump and Federal Reserve Chair Jerome Powell, which has introduced uncertainty into financial markets. Despite these challenges, Bitcoin has shown resilience, maintaining its dominance in the crypto market with a 59.1% share of the total market capitalization[2][3].\\n\\nFrom a technical standpoint, Bitcoin's price is being closely watched for potential breakouts above $90,000, driven by factors such as monetary stimulus in China and Europe, and Bitcoin's decoupling from traditional markets[4]. Key technical levels include support at $80,000 and resistance at $90,000. The Relative Strength Index (RSI) is around 60, indicating a neutral position but leaning towards being overbought if it crosses 70. Traders are actively purchasing call options with strike prices between $90,000 and $100,000, suggesting optimism about future price increases[2]. The Fear & Greed Index is at 30, indicating fear, which could lead to volatility[1].\\n\\nGiven the current market dynamics, a trading recommendation would be to enter a long position if Bitcoin breaks above $86,000, targeting $90,000 as a short-term price target. A stop-loss should be set at $82,000 to mitigate potential losses if the price reverses. This strategy leverages the bullish sentiment and technical indicators pointing towards a potential rally. However, traders should remain cautious due to the geopolitical uncertainties and potential regulatory changes that could impact Bitcoin's price[2][4].\"}",
        "role": ROLE_TYPE.ASSISTANT
    },
    {
        "id": '3189',
        "feedback": null,
        "content": "give some advise about common sence",
        "observationContent": "",
        "thoughtContent": "",
        "role": ROLE_TYPE.USER
    },
    {
        "id": '3189',
        "feedback": null,
        "content": "In the crypto world, common sense is your best friend. Trust your instincts, but don't ignore the basics. Always do your own research before jumping into trades. Avoid FOMO; if something sounds too good to be true, it probably is. Stay informed about market trends and be wary of hype. Keep emotions in check and make decisions based on data. Stay secure: protect your assets and use reputable platforms. Remember, the market's volatile—plan for the long haul and don't chase quick gains.",
        "thoughtContent": "Classification Result: {\n  \"needs_agents\": false,\n  \"response\": \"Common sense is all about practical and sound judgment in everyday situations. Here are some tips: \\n1. Think before you act or speak, considering the potential consequences. \\n2. Trust your instincts but verify facts when necessary. \\n3. Learn from past experiences, both your own and others. \\n4. Keep things simple and avoid overcomplicating issues. \\n5. Stay informed and use critical thinking. \\nRemember, common sense varies among individuals and cultures, so stay adaptable and open-minded.\"\n}\nPREFIX\nI know the answer to this question",
        "observationContent": "",
        "role": ROLE_TYPE.ASSISTANT
    }
  ], setAiResponseContentList]
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

export function useIsGrabbingTradeAi(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isGrabbingTradeAi = useSelector((state: RootState) => state.tradeai.isGrabbingTradeAi)
  const setIsGrabbingTradeAi = useCallback((bool: boolean) => {
    dispatch(changeIsGrabbingTradeAi({ isGrabbingTradeAi: bool }))
  }, [dispatch])
  return [isGrabbingTradeAi, setIsGrabbingTradeAi]
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
//       "chatModel": "general"
//   },
//   {
//       "threadId": "a09cd2c6-48b9-44e5-bbdd-de2f6faf0b24",
//       "createdAt": 1744350968596,
//       "title": "place a btc market order",
//       "chatModel": "general"
//   }
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

export function useCurrentBreakpoint(): string {
  const { width } = useWindowSize()
  if (!width) return 'lg'
  let breakpoint = 'xs'
  if (width > 1600) {
    breakpoint = 'lg'
  } else if (width > 1440) {
    breakpoint = 'md'  
  } else if (width > 1200) {
    breakpoint = 'sm'
  }
  return breakpoint
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

export function useSaveCommandResult() {
  const [currentAiThreadId] = useCurrentAiThreadId()
  const triggerGetAiBotChatContents = useGetAiBotChatContents()
  const [triggerSaveCommandResult] = useLazySaveCommandResultQuery()
  return useCallback(async ({
    id,
    content,
  }: {
    id: string
    content: string
  }) => {
    try {
      const data = await triggerSaveCommandResult({ id, accountApiKey: '', threadId: currentAiThreadId, account: '', content })
      await triggerGetAiBotChatContents(currentAiThreadId)
      return data
    } catch (error) {
      return error
    }
  }, [currentAiThreadId, triggerGetAiBotChatContents, triggerSaveCommandResult])
}


export function useIsShowInsightTradeAiContent(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isShowInsightTradeAiContent = useSelector((state: RootState) => state.tradeai.isShowInsightTradeAiContent)
  const setIsShowInsightTradeAiContent = useCallback((value: boolean) => {
    dispatch(changeIsShowInsightTradeAiContent({ isShowInsightTradeAiContent: value }))
  }, [dispatch])
  return [isShowInsightTradeAiContent, setIsShowInsightTradeAiContent]
}


export function useGetAllNews() {
  const [triggerGetAllNews] = useLazyGetAllNewsQuery()
  const dispatch = useDispatch()
  return useCallback(async ({
    pageIndex,
  }: {
    pageIndex: number
  }) => {
    try {
      const data = await triggerGetAllNews({ pageIndex, pageSize: PAGE_SIZE })
      const list = (data.data as any).list || []
      const totalSize = (data.data as any).totalSize || 0
      dispatch(changeAllNewsData({ allNewsData: { list, totalSize } }))
      return data
    } catch (error) {
      return error
    }
  }, [triggerGetAllNews, dispatch])
}

export function useAllNewsData(): [NewsDataType[], number] {
  const allNewsData = useSelector((state: RootState) => state.tradeai.allNewsData)
  return [allNewsData.list, allNewsData.totalSize]
}

export function useIsAnalyzeContent(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isAnalyzeContent = useSelector((state: RootState) => state.tradeai.isAnalyzeContent)
  const setIsAnalyzeContent = useCallback((value: boolean) => {
    dispatch(changeIsAnalyzeContent({ isAnalyzeContent: value }))
  }, [dispatch])
  return [isAnalyzeContent, setIsAnalyzeContent]
}

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

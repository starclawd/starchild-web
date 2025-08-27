import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { resetTempAiContentData } from '../reducer'
import { ROLE_TYPE, TempAiContentDataType } from '../chat'
import {
  useLazyChartImgQuery,
  useLazyDeleteContentQuery,
  useLazyDislikeContentQuery,
  useLazyGenerateKlineChartQuery,
  useLazyGetAiBotChatContentsQuery,
  useLazyLikeContentQuery,
  useLazyOpenAiChatCompletionsQuery,
  useLazyChatRecommendationsQuery,
} from 'api/chat'
import { useUserInfo } from 'store/login/hooks'
import { useCurrentAiThreadId } from 'store/chatcache/hooks'
import { changeIsLoadingAiContent, changeAiResponseContentList } from '../reducer'

export function useGetOpenAiData() {
  const [triggerChatCompletions] = useLazyOpenAiChatCompletionsQuery()
  return useCallback(
    async ({ userValue, systemValue }: { userValue: string; systemValue: string }) => {
      try {
        const data = await triggerChatCompletions({
          userContent: userValue,
          systemContent: systemValue,
        })
        return data
      } catch (error) {
        return error
      }
    },
    [triggerChatCompletions],
  )
}

export function useGetChartImg() {
  const [triggerChartImg] = useLazyChartImgQuery()
  return useCallback(
    async (param: any) => {
      try {
        const data = await triggerChartImg(param)
        return data
      } catch (error) {
        return error
      }
    },
    [triggerChartImg],
  )
}

export function useGetAiBotChatContents() {
  const dispatch = useDispatch()
  const setAiResponseContentList = useCallback(
    (list: TempAiContentDataType[]) => {
      dispatch(changeAiResponseContentList({ aiResponseContentList: list }))
    },
    [dispatch],
  )
  const setIsLoadingAiContent = useCallback(
    (value: boolean) => {
      dispatch(changeIsLoadingAiContent({ isLoadingAiContent: value }))
    },
    [dispatch],
  )
  const [triggerGetAiBotChatContents] = useLazyGetAiBotChatContentsQuery()
  return useCallback(
    async ({ threadId, telegramUserId }: { threadId: string; telegramUserId: string }) => {
      try {
        setIsLoadingAiContent(true)
        const data = await triggerGetAiBotChatContents({
          threadId,
          account: telegramUserId,
        })
        const chatContents = [...(data as any).data].sort((a: any, b: any) => a.createdAt - b.createdAt)
        const list: TempAiContentDataType[] = []
        chatContents.forEach((data: any) => {
          const { content, created_at, msg_id, thread_id } = data
          const {
            agent_response,
            user_query,
            thinking_steps,
            source_list_details,
            kline_charts,
            backtest_result,
            task_id,
          } = content
          list.push(
            {
              id: msg_id,
              feedback: null,
              content: user_query,
              thoughtContentList: [],
              sourceListDetails: [],
              role: ROLE_TYPE.USER,
              timestamp: created_at,
            },
            {
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
            },
          )
        })
        dispatch(resetTempAiContentData())
        setAiResponseContentList(list)
        setIsLoadingAiContent(false)
        return data
      } catch (error) {
        setIsLoadingAiContent(false)
        return error
      }
    },
    [dispatch, setIsLoadingAiContent, setAiResponseContentList, triggerGetAiBotChatContents],
  )
}

export function useGenerateKlineChart() {
  const [{ telegramUserId }] = useUserInfo()
  const [triggerGenerateKlineChart] = useLazyGenerateKlineChartQuery()
  return useCallback(
    async (id: string, threadId: string, finalAnswer: string) => {
      try {
        const data = await triggerGenerateKlineChart({ id, threadId, account: telegramUserId, finalAnswer })
        return data
      } catch (error) {
        return error
      }
    },
    [telegramUserId, triggerGenerateKlineChart],
  )
}

export function useDeleteContent() {
  const [{ telegramUserId }] = useUserInfo()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const [triggerDeleteContent] = useLazyDeleteContentQuery()
  return useCallback(
    async (id: string) => {
      try {
        const data = await triggerDeleteContent({ id, threadId: currentAiThreadId, account: telegramUserId })
        return data
      } catch (error) {
        return error
      }
    },
    [currentAiThreadId, telegramUserId, triggerDeleteContent],
  )
}

export function useLikeContent() {
  const [currentAiThreadId] = useCurrentAiThreadId()
  const [triggerLikeContent] = useLazyLikeContentQuery()
  return useCallback(
    async (id: string) => {
      try {
        const data = await triggerLikeContent({ id, accountApiKey: '', threadId: currentAiThreadId, account: '' })
        return data
      } catch (error) {
        return error
      }
    },
    [currentAiThreadId, triggerLikeContent],
  )
}

export function useDislikeContent() {
  const [currentAiThreadId] = useCurrentAiThreadId()
  const [triggerDislikeContent] = useLazyDislikeContentQuery()
  return useCallback(
    async (id: string, content: string) => {
      try {
        const data = await triggerDislikeContent({
          id,
          reason: content,
          accountApiKey: '',
          threadId: currentAiThreadId,
          account: '',
        })
        return data
      } catch (error) {
        return error
      }
    },
    [currentAiThreadId, triggerDislikeContent],
  )
}

export function useGetChatRecommendations() {
  const [triggerGetChatRecommendations] = useLazyChatRecommendationsQuery()
  return useCallback(async () => {
    try {
      const data = await triggerGetChatRecommendations(1)
      console.log('data', data)
      return data
    } catch (error) {
      return error
    }
  }, [triggerGetChatRecommendations])
}

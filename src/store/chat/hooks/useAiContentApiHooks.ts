import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { resetTempAiContentData } from '../reducer'
import { ROLE_TYPE, TempAiContentDataType } from '../chat'
import {
  useLazyChartImgQuery,
  useLazyDeleteContentQuery,
  useLazyGenerateKlineChartQuery,
  useLazyGetAiBotChatContentsQuery,
  useLazyChatFeedbackQuery,
  useLazyOpenAiChatCompletionsQuery,
  useLazyChatRecommendationsQuery,
} from 'api/chat'
import { useUserInfo } from 'store/login/hooks'
import { useCurrentAiThreadId } from 'store/chatcache/hooks'
import { changeCurrentLoadingThreadId, changeAiResponseContentList } from '../reducer'
import { useChatRecommendationList } from './useUiStateHooks'

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
  const setCurrentLoadingThreadId = useCallback(
    (value: string) => {
      dispatch(changeCurrentLoadingThreadId({ currentLoadingThreadId: value }))
    },
    [dispatch],
  )
  const [triggerGetAiBotChatContents] = useLazyGetAiBotChatContentsQuery()
  return useCallback(
    async ({ threadId, telegramUserId }: { threadId: string; telegramUserId: string }) => {
      try {
        setCurrentLoadingThreadId(threadId)
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
            task_id,
            agent_recommendation,
            user_feedback,
          } = content
          list.push(
            {
              id: msg_id,
              feedback: user_feedback,
              content: user_query,
              thoughtContentList: [],
              sourceListDetails: [],
              role: ROLE_TYPE.USER,
              timestamp: created_at,
              agentRecommendationList: [],
            },
            {
              id: msg_id,
              feedback: user_feedback,
              content: agent_response,
              thoughtContentList: thinking_steps,
              sourceListDetails: source_list_details,
              role: ROLE_TYPE.ASSISTANT,
              timestamp: created_at,
              klineCharts: kline_charts,
              agentId: task_id,
              threadId: thread_id,
              agentRecommendationList: agent_recommendation,
            },
          )
        })
        dispatch(resetTempAiContentData())
        setAiResponseContentList(list)
        setCurrentLoadingThreadId('')
        return data
      } catch (error) {
        setCurrentLoadingThreadId('')
        return error
      }
    },
    [dispatch, setCurrentLoadingThreadId, setAiResponseContentList, triggerGetAiBotChatContents],
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

export function useChatFeedback() {
  const [{ telegramUserId }] = useUserInfo()
  const [triggerChatFeedback] = useLazyChatFeedbackQuery()
  return useCallback(
    async ({
      chatId,
      messageId,
      feedbackType,
      dislikeReason,
      originalMessage,
    }: {
      chatId: string
      messageId: string
      feedbackType: 'like' | 'dislike'
      dislikeReason: string
      originalMessage: string
    }) => {
      try {
        const data = await triggerChatFeedback({
          userId: telegramUserId,
          chatId,
          messageId,
          feedbackType,
          dislikeReason,
          originalMessage,
        })
        return data
      } catch (error) {
        return error
      }
    },
    [telegramUserId, triggerChatFeedback],
  )
}

export function useGetChatRecommendations() {
  const [{ telegramUserId }] = useUserInfo()
  const [, setChatRecommendationList] = useChatRecommendationList()
  const [triggerGetChatRecommendations] = useLazyChatRecommendationsQuery()
  return useCallback(async () => {
    if (!telegramUserId) return
    try {
      const data = await triggerGetChatRecommendations({ telegramUserId })
      setChatRecommendationList((data as any).data.data)
      return data
    } catch (error) {
      return error
    }
  }, [telegramUserId, setChatRecommendationList, triggerGetChatRecommendations])
}

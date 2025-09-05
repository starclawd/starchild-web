import {
  useLazyGenerateRecommandationsQuery,
  useLazyGetAiBotChatContentsQuery,
  useLazyRecommendationDecisionQuery,
  useLazyTrackRecommendationsQuery,
} from 'api/chat'
import { useCallback } from 'react'
import { useUserInfo } from 'store/login/hooks'
import { ACTION_TYPE } from '../chat'

export function useGetRecommendationDecision() {
  const [{ telegramUserId }] = useUserInfo()
  const [triggerRecommendationDecision] = useLazyRecommendationDecisionQuery()
  return useCallback(async () => {
    try {
      const data = await triggerRecommendationDecision({ telegramUserId })
      return data
    } catch (error) {
      return error
    }
  }, [telegramUserId, triggerRecommendationDecision])
}

export function useGetChatRecommendations() {
  const [{ telegramUserId, telegramUserName }] = useUserInfo()
  const [triggerGenerateRecommandations] = useLazyGenerateRecommandationsQuery()
  return useCallback(
    async ({ threadId, msgId }: { threadId: string; msgId: string }) => {
      try {
        const data = await triggerGenerateRecommandations({
          telegramUserId,
          threadId,
          msgId,
          firstName: telegramUserName,
        })
        return data
      } catch (error) {
        return error
      }
    },
    [telegramUserId, telegramUserName, triggerGenerateRecommandations],
  )
}

export function useTrackRecommendations() {
  const [{ telegramUserId }] = useUserInfo()
  const [triggerTrackRecommendations] = useLazyTrackRecommendationsQuery()
  return useCallback(
    async ({ recommendationId, actionType }: { recommendationId: number; actionType: ACTION_TYPE }) => {
      try {
        const data = await triggerTrackRecommendations({ recommendationId, actionType, telegramUserId })
        return data
      } catch (error) {
        return error
      }
    },
    [telegramUserId, triggerTrackRecommendations],
  )
}

export function useRecommendationProcess() {
  const [{ telegramUserId }] = useUserInfo()
  const [triggerGetAiBotChatContents] = useLazyGetAiBotChatContentsQuery()
  const triggerGetRecommendationDecision = useGetRecommendationDecision()
  const triggerGetChatRecommendations = useGetChatRecommendations()
  return useCallback(
    async ({ threadId, msgId }: { threadId: string; msgId: string }) => {
      const recommendationDecisiondata: any = await triggerGetRecommendationDecision()
      console.log('recommendationDecisiondata', recommendationDecisiondata)
      if (recommendationDecisiondata.isSuccess && recommendationDecisiondata.data.status === 'success') {
        // 判断是否需要自动推荐
        const data = recommendationDecisiondata.data.data
        const shouldAutoRecommend = data.decisions.should_auto_recommend
        if (shouldAutoRecommend) {
          const chatRecommendationsdata: any = await triggerGetChatRecommendations({ threadId, msgId })
          console.log('chatRecommendationsdata', chatRecommendationsdata)
          if (chatRecommendationsdata.isSuccess && chatRecommendationsdata.data.status === 'success') {
            const data = chatRecommendationsdata.data.data
            const recommendations = data.recommendations
            // 如果有推荐的 agent，则更新 chat_content 接口
            if (recommendations.length > 0) {
              await triggerGetAiBotChatContents({
                threadId,
                account: telegramUserId,
              })
            }
          }
        }
      }
    },
    [telegramUserId, triggerGetRecommendationDecision, triggerGetChatRecommendations, triggerGetAiBotChatContents],
  )
}

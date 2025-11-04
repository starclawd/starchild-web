import {
  useLazyGenerateRecommandationsQuery,
  useLazyRecommendationDecisionQuery,
  useLazyTrackRecommendationsQuery,
} from 'api/chat'
import { useCallback } from 'react'
import { useUserInfo } from 'store/login/hooks'
import { ACTION_TYPE } from '../chat'
import { useGetAiBotChatContents } from './useAiContentApiHooks'

export function useGetRecommendationDecision() {
  const [triggerRecommendationDecision] = useLazyRecommendationDecisionQuery()
  return useCallback(async () => {
    try {
      const data = await triggerRecommendationDecision({})
      return data
    } catch (error) {
      return error
    }
  }, [triggerRecommendationDecision])
}

export function useGetChatRecommendations() {
  const [{ telegramUserName }] = useUserInfo()
  const [triggerGenerateRecommandations] = useLazyGenerateRecommandationsQuery()
  return useCallback(
    async ({ threadId, msgId }: { threadId: string; msgId: string }) => {
      try {
        const data = await triggerGenerateRecommandations({
          threadId,
          msgId,
          firstName: telegramUserName,
        })
        return data
      } catch (error) {
        return error
      }
    },
    [telegramUserName, triggerGenerateRecommandations],
  )
}

export function useTrackRecommendations() {
  const [triggerTrackRecommendations] = useLazyTrackRecommendationsQuery()
  return useCallback(
    async ({ recommendationId, actionType }: { recommendationId: number; actionType: ACTION_TYPE }) => {
      try {
        const data = await triggerTrackRecommendations({ recommendationId, actionType })
        return data
      } catch (error) {
        return error
      }
    },
    [triggerTrackRecommendations],
  )
}

export function useRecommendationProcess() {
  const triggerGetAiBotChatContents = useGetAiBotChatContents()
  const triggerGetRecommendationDecision = useGetRecommendationDecision()
  const triggerGetChatRecommendations = useGetChatRecommendations()
  return useCallback(
    async ({ threadId, msgId }: { threadId: string; msgId: string }) => {
      const recommendationDecisiondata: any = await triggerGetRecommendationDecision()
      if (recommendationDecisiondata.isSuccess && recommendationDecisiondata.data.status === 'success') {
        // 判断是否需要自动推荐
        const data = recommendationDecisiondata.data.data
        const shouldAutoRecommend = data.decisions.should_auto_recommend
        if (shouldAutoRecommend) {
          await triggerGetChatRecommendations({ threadId, msgId })
          await triggerGetAiBotChatContents({
            threadId,
          })
        }
      }
    },
    [triggerGetRecommendationDecision, triggerGetChatRecommendations, triggerGetAiBotChatContents],
  )
}

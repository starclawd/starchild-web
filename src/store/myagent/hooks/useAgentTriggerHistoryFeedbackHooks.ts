import { useCallback, useState } from 'react'
import { useLazyAgentTriggerHistoryFeedbackQuery } from 'api/myAgent'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'styled-components'

interface FeedbackLoadingStates {
  like: boolean
  dislike: boolean
}

interface UseAgentTriggerHistoryFeedbackParams {
  agentId: string
  triggerHistoryId: string
}

export const useAgentTriggerHistoryFeedback = ({ agentId, triggerHistoryId }: UseAgentTriggerHistoryFeedbackParams) => {
  const theme = useTheme()
  const toast = useToast()
  const [loadingStates, setLoadingStates] = useState<FeedbackLoadingStates>({
    like: false,
    dislike: false,
  })

  const [triggerAgentFeedback] = useLazyAgentTriggerHistoryFeedbackQuery()

  const updateLoadingState = useCallback((type: keyof FeedbackLoadingStates, isLoading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [type]: isLoading,
    }))
  }, [])

  const onLike = useCallback(async () => {
    try {
      updateLoadingState('like', true)
      await triggerAgentFeedback({
        agentId,
        triggerHistoryId,
        feedbackType: 'like',
        dislikeReason: '',
      })

      toast({
        title: 'Feedback Received',
        description:
          'Thank you for your feedback. We have received your submission and will use it to improve our services.',
        status: TOAST_STATUS.SUCCESS,
        typeIcon: 'icon-feedback',
        iconTheme: theme.textL2,
      })
    } catch (error) {
      console.error('Like agent trigger history failed:', error)
      toast({
        title: 'Operation Failed',
        description: 'Like operation failed, please try again later',
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-feedback',
        iconTheme: theme.textL2,
      })
    } finally {
      updateLoadingState('like', false)
    }
  }, [agentId, triggerHistoryId, triggerAgentFeedback, updateLoadingState, theme.textL2, toast])

  const onDislike = useCallback(
    async (reason: string) => {
      try {
        updateLoadingState('dislike', true)
        await triggerAgentFeedback({
          agentId,
          triggerHistoryId,
          feedbackType: 'dislike',
          dislikeReason: reason,
        })

        toast({
          title: 'Feedback Received',
          description:
            'Thank you for your feedback. We have received your submission and will use it to improve our services.',
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-feedback',
          iconTheme: theme.textL2,
        })
      } catch (error) {
        console.error('Dislike agent trigger history failed:', error)
        toast({
          title: 'Operation Failed',
          description: 'Feedback submission failed, please try again later',
          status: TOAST_STATUS.ERROR,
          typeIcon: 'icon-feedback',
          iconTheme: theme.textL2,
        })
      } finally {
        updateLoadingState('dislike', false)
      }
    },
    [agentId, triggerHistoryId, triggerAgentFeedback, updateLoadingState, theme.textL2, toast],
  )

  return {
    loadingStates,
    onLike,
    onDislike,
  }
}

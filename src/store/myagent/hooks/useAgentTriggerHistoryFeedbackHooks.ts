import { useCallback, useState } from 'react'
import { useLazyAgentTriggerHistoryFeedbackQuery } from 'api/myAgent'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'styled-components'

interface FeedbackLoadingStates {
  like: boolean
  dislike: boolean
}

interface FeedbackState {
  isLiked: boolean
  isDisliked: boolean
  likeCount: number
  dislikeCount: number
  dislikeReason?: string
}

interface UseAgentTriggerHistoryFeedbackParams {
  triggerHistoryId: string
  initialFeedbackState: FeedbackState
}

export const useAgentTriggerHistoryFeedback = ({
  triggerHistoryId,
  initialFeedbackState,
}: UseAgentTriggerHistoryFeedbackParams) => {
  const theme = useTheme()
  const toast = useToast()
  const [loadingStates, setLoadingStates] = useState<FeedbackLoadingStates>({
    like: false,
    dislike: false,
  })

  // 临时的反馈状态，用于在不刷新数据的情况下反映用户的操作
  const [tempFeedbackState, setTempFeedbackState] = useState<FeedbackState>(initialFeedbackState)

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
        triggerHistoryId,
        feedbackType: 'like',
        dislikeReason: '',
      })

      // API调用成功后更新临时状态
      setTempFeedbackState((prev) => {
        const newState = { ...prev }

        if (prev.isLiked) {
          // 如果已经点赞，取消点赞
          newState.isLiked = false
          newState.likeCount = Math.max(0, prev.likeCount - 1)
        } else {
          // 如果没有点赞，添加点赞
          newState.isLiked = true
          newState.likeCount = prev.likeCount + 1

          // 如果之前是踩，取消踩
          if (prev.isDisliked) {
            newState.isDisliked = false
            newState.dislikeCount = Math.max(0, prev.dislikeCount - 1)
            newState.dislikeReason = undefined
          }
        }

        return newState
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
  }, [triggerHistoryId, triggerAgentFeedback, updateLoadingState, theme.textL2, toast])

  const onDislike = useCallback(
    async (reason: string) => {
      try {
        updateLoadingState('dislike', true)

        await triggerAgentFeedback({
          triggerHistoryId,
          feedbackType: 'dislike',
          dislikeReason: reason,
        })

        // API调用成功后更新临时状态
        setTempFeedbackState((prev) => {
          const newState = { ...prev }

          if (prev.isDisliked) {
            // 如果已经踩，取消踩
            newState.isDisliked = false
            newState.dislikeCount = Math.max(0, prev.dislikeCount - 1)
            newState.dislikeReason = undefined
          } else {
            // 如果没有踩，添加踩
            newState.isDisliked = true
            newState.dislikeCount = prev.dislikeCount + 1
            newState.dislikeReason = reason

            // 如果之前是点赞，取消点赞
            if (prev.isLiked) {
              newState.isLiked = false
              newState.likeCount = Math.max(0, prev.likeCount - 1)
            }
          }

          return newState
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
    [triggerHistoryId, triggerAgentFeedback, updateLoadingState, theme.textL2, toast],
  )

  return {
    loadingStates,
    onLike,
    onDislike,
    // 返回临时状态供组件使用
    feedbackState: tempFeedbackState,
  }
}

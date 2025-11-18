import { useCallback } from 'react'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'styled-components'
import { t } from '@lingui/core/macro'

/**
 * 通用的反馈失败toast hook
 */
export const useFeedbackFailedToast = () => {
  const theme = useTheme()
  const toast = useToast()

  const showFeedbackFailedToast = useCallback(
    (customError?: string) => {
      toast({
        title: t`Operation Failed`,
        description: customError || t`Feedback submission failed, please try again later`,
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-feedback',
        iconTheme: theme.textL2,
      })
    },
    [theme.textL2, toast],
  )

  return showFeedbackFailedToast
}

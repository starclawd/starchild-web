/**
 * Google 登录错误处理 Hook
 * 统一处理 Google 登录/绑定过程中的各种错误，并显示相应的 Toast 提示
 */
import { useCallback } from 'react'
import { useTheme } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { GoogleLoginError, GoogleLoginErrorType } from 'utils/googleAuth.ts'

export function useGoogleLoginErrorHandler() {
  const toast = useToast()
  const theme = useTheme()

  const handleError = useCallback(
    (error: unknown, context: 'login' | 'bind' = 'login') => {
      // 处理 GoogleLoginError
      if (error instanceof GoogleLoginError) {
        switch (error.type) {
          case GoogleLoginErrorType.BLOCKED:
            toast({
              title: <Trans>Third-party Login Blocked</Trans>,
              description: (
                <Trans>
                  Your browser has blocked third-party login. Please enable third-party cookies in your browser settings
                  {context === 'login' ? ', or use another login method' : ''}.
                </Trans>
              ),
              status: TOAST_STATUS.ERROR,
              typeIcon: 'icon-chat-warning',
              iconTheme: theme.ruby50,
              autoClose: 6000,
            })
            break

          case GoogleLoginErrorType.NETWORK_ERROR:
            toast({
              title: <Trans>Network Error</Trans>,
              description: <Trans>Network connection failed. Please check your network and try again.</Trans>,
              status: TOAST_STATUS.ERROR,
              typeIcon: 'icon-chat-close',
              iconTheme: theme.ruby50,
            })
            break

          case GoogleLoginErrorType.USER_CANCELLED:
            // 用户取消时，提示可能需要允许第三方登录
            toast({
              title: <Trans>Login Cancelled</Trans>,
              description: (
                <Trans>
                  If the Google login window didn't open, please check if your browser has blocked third-party cookies.
                </Trans>
              ),
              status: TOAST_STATUS.ERROR,
              typeIcon: 'icon-chat-warning',
              iconTheme: theme.ruby50,
              autoClose: 5000,
            })
            break

          case GoogleLoginErrorType.SDK_NOT_LOADED:
            toast({
              title: <Trans>SDK Loading Error</Trans>,
              description: <Trans>Google SDK failed to load. Please refresh the page and try again.</Trans>,
              status: TOAST_STATUS.ERROR,
              typeIcon: 'icon-chat-close',
              iconTheme: theme.ruby50,
            })
            break

          default:
            toast({
              title: context === 'login' ? <Trans>Login Error</Trans> : <Trans>Bind Error</Trans>,
              description:
                context === 'login' ? (
                  <Trans>An error occurred during Google login. Please try again later.</Trans>
                ) : (
                  <Trans>An error occurred while linking Google account. Please try again later.</Trans>
                ),
              status: TOAST_STATUS.ERROR,
              typeIcon: 'icon-chat-close',
              iconTheme: theme.ruby50,
            })
        }
      } else {
        // 未知错误
        toast({
          title: context === 'login' ? <Trans>Login Error</Trans> : <Trans>Bind Error</Trans>,
          description:
            context === 'login' ? (
              <Trans>An error occurred during Google login. Please try again later.</Trans>
            ) : (
              <Trans>An error occurred while linking Google account. Please try again later.</Trans>
            ),
          status: TOAST_STATUS.ERROR,
          typeIcon: 'icon-chat-close',
          iconTheme: theme.ruby50,
        })
      }
    },
    [toast, theme],
  )

  return handleError
}

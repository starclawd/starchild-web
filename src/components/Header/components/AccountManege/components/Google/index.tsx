import styled, { css } from 'styled-components'
import Icon from '../Icon'
import { useBindGoogle, useGetUserInfo, useUserInfo } from 'store/login/hooks'
import { useCallback, useState } from 'react'
import { googleOneTapLogin } from 'utils/googleAuth'
import Pending from 'components/Pending'
import { useGoogleLoginErrorHandler } from 'hooks/useGoogleLoginErrorHandler'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { Trans } from '@lingui/react/macro'
import { useTheme } from 'store/themecache/hooks'

const GoogleWrapper = styled.div`
  display: flex;
`

const Email = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

export default function Google() {
  const toast = useToast()
  const theme = useTheme()
  const [{ email }] = useUserInfo()
  const [isLoading, setIsLoading] = useState(false)
  const handleGoogleError = useGoogleLoginErrorHandler()
  const triggerBindGoogle = useBindGoogle()
  const triggerGetUserInfo = useGetUserInfo()

  const handleGoogleBind = useCallback(async () => {
    try {
      if (isLoading) return
      setIsLoading(true)
      await googleOneTapLogin(async (credential: string) => {
        const data = await triggerBindGoogle(credential)
        if (!data.isSuccess) {
          toast({
            title: <Trans>Failed to bind Google</Trans>,
            description: data.error.data.message,
            status: TOAST_STATUS.ERROR,
            typeIcon: 'icon-customize-avatar',
            iconTheme: theme.ruby50,
          })
        } else {
          await triggerGetUserInfo()
          toast({
            title: <Trans>Bind succesfully</Trans>,
            description: data.data.email || '',
            status: TOAST_STATUS.SUCCESS,
            typeIcon: 'icon-customize-avatar',
            iconTheme: theme.textL1,
          })
        }
      })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      // 使用统一的错误处理
      handleGoogleError(error, 'bind')
    }
  }, [isLoading, theme, toast, triggerGetUserInfo, triggerBindGoogle, handleGoogleError])

  return (
    <GoogleWrapper>
      {!email ? (
        isLoading ? (
          <Pending />
        ) : (
          <Icon iconName='icon-chat-upload' onClick={handleGoogleBind} />
        )
      ) : (
        <Email>{email}</Email>
      )}
    </GoogleWrapper>
  )
}

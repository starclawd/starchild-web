import styled, { css } from 'styled-components'
import Icon from '../Icon'
import { useUserInfo } from 'store/login/hooks'
import { useCallback, useState } from 'react'
import { googleOneTapLogin } from 'utils/googleAuth'
import Pending from 'components/Pending'
import { useGoogleLoginErrorHandler } from 'hooks/useGoogleLoginErrorHandler'

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
  const [{ email }] = useUserInfo()
  const [isLoading, setIsLoading] = useState(false)
  const handleGoogleError = useGoogleLoginErrorHandler()

  const handleGoogleBind = useCallback(async () => {
    try {
      if (isLoading) return
      setIsLoading(true)
      await googleOneTapLogin(async (credential: string) => {
        console.log('credential', credential)
      })
    } catch (error) {
      setIsLoading(false)
      // 使用统一的错误处理
      handleGoogleError(error, 'bind')
    }
  }, [isLoading, handleGoogleError])

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

import styled, { css } from 'styled-components'
import Icon from '../Icon'
import { useBindGoogle, useUserInfo } from 'store/login/hooks'
import { useCallback, useState } from 'react'
import { googleOneTapLogin } from 'utils/googleAuth'
import Pending from 'components/Pending'

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
  const bindGoogle = useBindGoogle()
  const [isLoading, setIsLoading] = useState(false)
  const handleGoogleBind = useCallback(async () => {
    try {
      if (isLoading) return
      setIsLoading(true)
      await googleOneTapLogin(async (credential: string) => {
        console.log('credential', credential)
        setIsLoading(false)
      })
    } catch (error) {
      setIsLoading(false)
      console.error('Google 绑定错误:', error)
    }
  }, [isLoading])
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

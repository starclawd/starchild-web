import { Trans } from '@lingui/react/macro'
import { useCallback } from 'react'
import { useIsLogin } from 'store/login/hooks'
import { getTgLoginUrl } from 'store/login/utils'
import styled, { css } from 'styled-components'

const AccessButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 40px;
  color: #000;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  border-radius: 80px;
  border: 1px solid #fff;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%);
  ${({ theme }) =>
    theme.isMobile
      ? css``
      : css`
          cursor: pointer;
        `}
`

export default function AccessButton({ setIsShowAccessButton }: { setIsShowAccessButton: (isShow: boolean) => void }) {
  const isLogin = useIsLogin()
  const changeIsShowAccessButton = useCallback(() => {
    if (!isLogin) {
      window.location.href = getTgLoginUrl()
    } else {
      setIsShowAccessButton(false)
    }
  }, [isLogin, setIsShowAccessButton])

  return (
    <AccessButtonWrapper onClick={changeIsShowAccessButton}>
      <Trans>Get access</Trans>
    </AccessButtonWrapper>
  )
}

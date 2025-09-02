import { Trans } from '@lingui/react/macro'
import { HomeButton } from 'components/Button'
import Pending from 'components/Pending'
import { useCallback } from 'react'
import { useCurrentRouter } from 'store/application/hooks'
import { useIsGetAuthToken, useIsLogin } from 'store/login/hooks'
import { getTgLoginUrl } from 'store/login/utils'
import styled from 'styled-components'

const AccessButtonWrapper = styled(HomeButton)``

export default function AccessButton({ setIsShowAccessButton }: { setIsShowAccessButton: (isShow: boolean) => void }) {
  const isLogin = useIsLogin()
  const [currentRouter] = useCurrentRouter()
  const [isGetAuthToken] = useIsGetAuthToken()
  const changeIsShowAccessButton = useCallback(() => {
    if (isGetAuthToken) return
    if (!isLogin) {
      window.location.href = getTgLoginUrl(currentRouter)
    } else {
      setIsShowAccessButton(false)
    }
  }, [isLogin, currentRouter, setIsShowAccessButton, isGetAuthToken])

  return (
    <AccessButtonWrapper onClick={changeIsShowAccessButton}>
      {isGetAuthToken ? <Pending /> : <Trans>Get access</Trans>}
    </AccessButtonWrapper>
  )
}

import { Trans } from '@lingui/react/macro'
import { HomeButton } from 'components/Button'
import { useCallback } from 'react'
import { useIsLogin } from 'store/login/hooks'
import { getTgLoginUrl } from 'store/login/utils'
import styled from 'styled-components'

const AccessButtonWrapper = styled(HomeButton)``

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

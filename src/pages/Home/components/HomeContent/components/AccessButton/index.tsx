import { Trans } from '@lingui/react/macro'
import { HomeButton } from 'components/Button'
import Pending from 'components/Pending'
import { useCallback } from 'react'
import { useCurrentRouter } from 'store/application/hooks'
import { useIsGetAuthToken, useIsLogin } from 'store/login/hooks'
import { openTelegramLoginWindow } from 'store/login/utils'
import styled from 'styled-components'
import { trackEvent } from 'utils/common'

const AccessButtonWrapper = styled(HomeButton)``

export default function AccessButton() {
  const isLogin = useIsLogin()
  const [currentRouter] = useCurrentRouter()
  const [isGetAuthToken] = useIsGetAuthToken()
  const changeIsShowAccessButton = useCallback(() => {
    if (isGetAuthToken) return
    if (!isLogin) {
      // Google Analytics 埋点：点击登录 Telegram
      // 使用回调确保事件发送完成后再跳转
      trackEvent(
        'login_with_telegram',
        {
          event_category: 'authentication',
          event_label: 'Login_with_telegram',
        },
        () => {
          // 在新窗口中打开登录页面
          openTelegramLoginWindow(currentRouter, 'telegram-login')
        },
      )
    }
  }, [isLogin, currentRouter, isGetAuthToken])

  return (
    <AccessButtonWrapper onClick={changeIsShowAccessButton}>
      {isGetAuthToken ? <Pending /> : <Trans>Login with telegram</Trans>}
    </AccessButtonWrapper>
  )
}

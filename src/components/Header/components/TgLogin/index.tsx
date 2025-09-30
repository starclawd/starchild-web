// TelegramLoginButton.tsx
import { useEffect } from 'react'
import { TelegramLoginButtonProps, TelegramUser, tgLoginConfig } from 'store/login/login.d'
import styled from 'styled-components'

const TgLoginWrapper = styled.div`
  opacity: 0;
  pointer-events: none;
`

export const TgLogin = ({ onAuth, size = 'small' }: TelegramLoginButtonProps) => {
  useEffect(() => {
    const container = document.getElementById('telegram-login')
    if (container && !container.hasChildNodes()) {
      // 挂载回调函数
      ;(window as any).onTelegramAuth = (user: TelegramUser) => {
        window.tgUserInfo = user
        onAuth(user)
      }
      const script = document.createElement('script')
      script.src = 'https://telegram.org/js/telegram-widget.js?7'
      script.setAttribute('data-telegram-login', tgLoginConfig.username)
      script.setAttribute('data-size', size)
      script.setAttribute('data-userpic', 'false')
      script.setAttribute('data-request-access', 'write')
      script.setAttribute('data-onauth', 'onTelegramAuth(user)')
      script.setAttribute('data-lang', 'en')
      script.async = true
      container.appendChild(script)
    }
  }, [onAuth, size])

  return <TgLoginWrapper id='telegram-login'></TgLoginWrapper>
}

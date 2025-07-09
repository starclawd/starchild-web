// TelegramLoginButton.tsx
import { useEffect } from 'react'
import { TelegramLoginButtonProps, tgLoginConfig } from 'store/login/login.d'
import styled from 'styled-components'

const TgLoginWrapper = styled.div`
  display: none;
  width: 40px;
  height: 40px;
`

export const LoginButton = ({ onAuth, size = 'small' }: TelegramLoginButtonProps) => {
  useEffect(() => {
    // 挂载回调函数
    ;(window as any).TelegramLoginWidget = {
      onAuth,
    }

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?7'
    script.setAttribute('data-telegram-login', tgLoginConfig.username)
    script.setAttribute('data-size', size)
    script.setAttribute('data-userpic', 'false')
    script.setAttribute('data-request-access', 'write')
    script.setAttribute('data-onauth', 'TelegramLoginWidget.onAuth(user)')
    script.setAttribute('data-lang', 'en')
    script.async = true
    document.getElementById('telegram-login')?.appendChild(script)

    return () => {
      document.getElementById('telegram-login')?.replaceChildren()
    }
  }, [onAuth, size])

  return <TgLoginWrapper id='telegram-login'></TgLoginWrapper>
}

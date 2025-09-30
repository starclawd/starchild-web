// TelegramLoginButton.tsx
import { useEffect, useRef } from 'react'
import { TelegramLoginButtonProps, tgLoginConfig } from 'store/login/login.d'
import styled from 'styled-components'

const TgLoginWrapper = styled.div`
  display: none;
  width: 40px;
  height: 40px;
`

export const TgLogin = ({ onAuth, size = 'small' }: TelegramLoginButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)
  const callbackIdRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 如果脚本已经加载过，直接返回
    if (scriptLoadedRef.current) return

    // 生成唯一的回调函数名
    const callbackId = `TelegramLoginCallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    callbackIdRef.current = callbackId

    // 在 window 上设置全局回调函数
    ;(window as any)[callbackId] = (user: any) => {
      console.log('Telegram login callback triggered:', user)
      onAuth(user)
    }

    // 创建脚本元素
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?7'
    script.setAttribute('data-telegram-login', tgLoginConfig.username)
    script.setAttribute('data-size', size)
    script.setAttribute('data-userpic', 'false')
    script.setAttribute('data-request-access', 'write')
    script.setAttribute('data-onauth', `${callbackId}(user)`)
    script.setAttribute('data-lang', 'en')
    script.async = true

    // 监听脚本加载
    script.onload = () => {
      console.log('Telegram login widget script loaded successfully')
      scriptLoadedRef.current = true
    }

    script.onerror = (error) => {
      console.error('Failed to load Telegram login widget script:', error)
      scriptLoadedRef.current = false
    }

    // 清空容器并添加脚本
    container.innerHTML = ''
    container.appendChild(script)

    return () => {
      // 清理全局回调函数
      if (callbackIdRef.current && (window as any)[callbackIdRef.current]) {
        delete (window as any)[callbackIdRef.current]
      }

      // 清空容器
      if (container) {
        container.innerHTML = ''
      }

      scriptLoadedRef.current = false
    }
  }, [onAuth, size])

  return <TgLoginWrapper ref={containerRef} id='telegram-login'></TgLoginWrapper>
}

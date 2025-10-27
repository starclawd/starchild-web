// TelegramLoginButton.tsx
import { useCallback, useEffect } from 'react'
import { useGetAuthToken, useIsLogin } from 'store/login/hooks'
import { TelegramUser } from 'store/login/login'
import styled from 'styled-components'
import { trackEvent } from 'utils/common'

const TgLoginWrapper = styled.div`
  opacity: 0;
  pointer-events: none;
`

/**
 * 解析 URL hash 中的 tgAuthResult 参数
 * @returns TelegramUser | null
 */
export function getTgAuthResult(): TelegramUser | null {
  const re = /[#?&]tgAuthResult=([A-Za-z0-9\-_=]*)$/
  try {
    const locationHash = window.location.hash.toString()
    const match = locationHash.match(re)

    if (match) {
      // 清理掉 hash，避免重复解析
      window.location.hash = locationHash.replace(re, '')

      let data = match[1] || ''
      // Base64 URL-safe 转换
      data = data.replace(/-/g, '+').replace(/_/g, '/')

      // 补齐 padding
      const pad = data.length % 4
      if (pad > 0) {
        data += '='.repeat(4 - pad)
      }

      const decoded = window.atob(data)
      return JSON.parse(decoded) as TelegramUser
    }
  } catch (e) {
    console.error('Failed to parse tgAuthResult:', e)
  }
  return null
}

export const TgLogin = () => {
  const isLogin = useIsLogin()
  const triggerGetAuthToken = useGetAuthToken()
  const handleLogin = useCallback(
    async (user: TelegramUser) => {
      try {
        const result = await triggerGetAuthToken(user)
        // 登录成功后添加 Google Analytics 埋点
        if (result?.isSuccess) {
          trackEvent('login_success', {
            event_category: 'authentication',
            event_label: 'web_login',
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    [triggerGetAuthToken],
  )
  useEffect(() => {
    const tgAuthResult = getTgAuthResult()
    if (tgAuthResult && !isLogin) {
      handleLogin(tgAuthResult)
    }
  }, [isLogin, handleLogin])
  return <TgLoginWrapper id='telegram-login'></TgLoginWrapper>
}

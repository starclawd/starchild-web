// TelegramLoginButton.tsx
import { Trans } from '@lingui/react/macro'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useCallback, useEffect } from 'react'
import { ApplicationModal } from 'store/application/application'
import { useAccountManegeModalToggle, useModalOpen } from 'store/application/hooks'
import { useBindTelegram, useGetAuthToken, useGetUserInfo } from 'store/login/hooks'
import { TelegramUser } from 'store/login/login'
import { useAuthToken } from 'store/logincache/hooks'
import { useTheme } from 'store/themecache/hooks'
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
  const toast = useToast()
  const theme = useTheme()
  const [authToken] = useAuthToken()
  const triggerGetUserInfo = useGetUserInfo()
  const triggerGetAuthToken = useGetAuthToken()
  const triggerBindTelegram = useBindTelegram()
  const accountManegeModalOpen = useModalOpen(ApplicationModal.ACCOUNT_MANEGE_MODAL)
  const toggleAccountManegeModal = useAccountManegeModalToggle()
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
  const handleBindTelegram = useCallback(
    async (user: TelegramUser) => {
      try {
        const data = await triggerBindTelegram(user)
        if (!accountManegeModalOpen) {
          toggleAccountManegeModal()
        }
        if (!data.isSuccess) {
          toast({
            title: <Trans>Failed to bind Telegram</Trans>,
            description: data.error.data.message,
            status: TOAST_STATUS.ERROR,
            typeIcon: 'icon-customize-avatar',
            iconTheme: theme.ruby50,
          })
        } else {
          const data = await triggerGetUserInfo()
          if (data.isSuccess) {
            const result = data.data
            toast({
              title: <Trans>Bind succesfully</Trans>,
              description: result.telegramUserName || '',
              status: TOAST_STATUS.SUCCESS,
              typeIcon: 'icon-customize-avatar',
              iconTheme: theme.textL1,
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    [toast, theme, accountManegeModalOpen, triggerGetUserInfo, toggleAccountManegeModal, triggerBindTelegram],
  )

  // 处理从当前窗口 URL 解析的登录结果（兼容旧方式）
  // useEffect(() => {
  //   const tgAuthResult = getTgAuthResult()
  //   if (tgAuthResult && !authToken) {
  //     handleLogin(tgAuthResult)
  //   } else if (tgAuthResult && authToken) {
  //     handleBindTelegram(tgAuthResult)
  //   }
  // }, [authToken, handleLogin, handleBindTelegram])

  // 监听来自 Telegram OAuth 页面的 postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 验证消息来源：必须是 Telegram OAuth 域名或同源
      const allowedOrigins = ['https://oauth.telegram.org', window.location.origin]
      if (!allowedOrigins.includes(event.origin)) {
        return
      }
      // 处理 Telegram OAuth 发送的认证结果
      if (!event.data) {
        return
      }

      try {
        // 解析数据：event.data 可能是字符串或对象
        let data: any
        if (typeof event.data === 'string') {
          data = JSON.parse(event.data)
        } else {
          data = event.data
        }
        let tgAuthResult: TelegramUser | null = null

        // 格式 1: Telegram OAuth 标准格式 { event: "auth_result", result: {...} }
        if (data.event === 'auth_result' && data.result) {
          tgAuthResult = data.result as TelegramUser
        }

        // 如果成功解析到用户信息，执行登录或绑定
        if (tgAuthResult && tgAuthResult.id && tgAuthResult.hash) {
          if (!authToken) {
            handleLogin(tgAuthResult)
          } else {
            handleBindTelegram(tgAuthResult)
          }
        }
      } catch (error) {
        console.error('❌ 解析 Telegram 消息失败:', error)
      }
    }
    window.addEventListener('message', handleMessage)

    return () => {
      console.log('🔇 TgLogin: 停止监听 message 事件')
      window.removeEventListener('message', handleMessage)
    }
  }, [authToken, handleLogin, handleBindTelegram])

  return <TgLoginWrapper id='telegram-login'></TgLoginWrapper>
}

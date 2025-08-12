import { useCallback, useEffect, useRef, useState } from 'react'
import { useGetAuthTokenApp, useIsLogin } from 'store/login/hooks'
import { isTelegramWebApp, getTelegramInitData, initTelegramWebApp } from 'utils/telegramWebApp'

interface UseTelegramWebAppLoginOptions {
  /**
   * 是否启用自动登录
   * @default true
   */
  autoLogin?: boolean

  /**
   * 是否只在来自 Inline Keyboard 时才自动登录
   * @default true
   */
  onlyFromInlineKeyboard?: boolean

  /**
   * 登录成功回调
   */
  onLoginSuccess?: () => void

  /**
   * 登录失败回调
   */
  onLoginError?: (error: Error) => void
}

interface TelegramWebAppLoginState {
  /**
   * 是否在 Telegram WebApp 环境中
   */
  isTelegramWebApp: boolean

  /**
   * 是否正在自动登录
   */
  isAutoLogging: boolean

  /**
   * 自动登录是否已尝试
   */
  hasAttempted: boolean
  /**
   * 自动登录的错误信息
   */
  error: Error | null
}

/**
 * Telegram WebApp 自动登录 Hook
 */
export function useTelegramWebAppLogin(options: UseTelegramWebAppLoginOptions = {}) {
  const { autoLogin = true, onlyFromInlineKeyboard = true, onLoginSuccess, onLoginError } = options

  const isLogin = useIsLogin()
  const triggerGetAuthTokenApp = useGetAuthTokenApp()
  const hasAttemptedRef = useRef(false)

  const [state, setState] = useState<TelegramWebAppLoginState>({
    isTelegramWebApp: false,
    isAutoLogging: false,
    hasAttempted: false,
    error: null,
  })

  // 手动触发登录
  const manualLogin = useCallback(async () => {
    try {
      if (isLogin) {
        console.log('用户已登录，跳过 Telegram WebApp 登录')
        return
      }

      if (!isTelegramWebApp()) {
        const error = new Error('不在 Telegram WebApp 环境中')
        setState((prev) => ({ ...prev, error }))
        onLoginError?.(error)
        return
      }

      const initData = getTelegramInitData()
      if (!initData) {
        const error = new Error('无法获取 Telegram 用户信息')
        setState((prev) => ({ ...prev, error }))
        onLoginError?.(error)
        return
      }

      setState((prev) => ({ ...prev, isAutoLogging: true, error: null }))
      await triggerGetAuthTokenApp(initData)

      setState((prev) => ({
        ...prev,
        isAutoLogging: false,
        hasAttempted: true,
      }))

      onLoginSuccess?.()
      console.log('Telegram WebApp 自动登录成功')
    } catch (error) {
      const loginError = error instanceof Error ? error : new Error('登录失败')
      console.error('Telegram WebApp 自动登录失败:', loginError)

      setState((prev) => ({
        ...prev,
        isAutoLogging: false,
        hasAttempted: true,
        error: loginError,
      }))

      onLoginError?.(loginError)
    }
  }, [isLogin, triggerGetAuthTokenApp, onLoginSuccess, onLoginError])

  // 初始化和检查环境
  useEffect(() => {
    const isTgWebApp = isTelegramWebApp()

    setState((prev) => ({
      ...prev,
      isTelegramWebApp: isTgWebApp,
    }))

    // 初始化 Telegram WebApp
    if (isTgWebApp) {
      initTelegramWebApp()
    }
  }, [])

  // 自动登录逻辑
  useEffect(() => {
    // 避免重复尝试
    if (hasAttemptedRef.current) {
      return
    }

    // 检查是否应该自动登录
    if (!autoLogin || isLogin) {
      return
    }

    // 检查环境条件
    if (!state.isTelegramWebApp) {
      return
    }
    // 标记已尝试，避免重复
    hasAttemptedRef.current = true

    console.log('🚀 开始 Telegram WebApp 自动登录流程')

    // 延迟一小段时间，确保页面完全加载
    manualLogin()
  }, [autoLogin, isLogin, state.isTelegramWebApp, onlyFromInlineKeyboard, manualLogin])

  // 重置尝试状态（当用户手动登出后可以重新尝试）
  useEffect(() => {
    if (!isLogin) {
      hasAttemptedRef.current = false
    }
  }, [isLogin])

  return {
    ...state,
    manualLogin,
  }
}

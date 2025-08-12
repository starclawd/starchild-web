import { TelegramUser } from 'store/login/login.d'
import { isAndroid } from './userAgent'

// 声明 Telegram WebApp 相关的全局类型
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            photo_url?: string
          }
          auth_date?: number
          hash?: string
        }
        ready: () => void
        expand: () => void
        close: () => void
        platform: string
        colorScheme: 'light' | 'dark'
      }
    }
  }
}

/**
 * 检查是否在 Telegram WebApp 环境中
 */
export function isTelegramWebApp(): boolean {
  return !!(window.Telegram?.WebApp && window.Telegram.WebApp.initData)
}

/**
 * 检查是否在安卓系统下的 Telegram WebApp 环境中
 */
export function isAndroidTelegramWebApp(): boolean {
  return isTelegramWebApp() && isAndroid
}

/**
 * 解析 Telegram WebApp 的 initData
 */
export function parseTelegramInitData(initData: string): Record<string, any> {
  if (!initData) {
    return {}
  }

  try {
    const params = new URLSearchParams(initData)
    const result: Record<string, any> = {}

    for (const [key, value] of params.entries()) {
      try {
        // 尝试解析 JSON 字段（如 user）
        result[key] = JSON.parse(decodeURIComponent(value))
      } catch {
        // 如果不是 JSON，直接使用原值
        result[key] = decodeURIComponent(value)
      }
    }

    return result
  } catch (error) {
    console.error('解析 Telegram initData 失败:', error)
    return {}
  }
}

/**
 * 初始化 Telegram WebApp
 */
export function initTelegramWebApp(): void {
  if (isTelegramWebApp()) {
    const webApp = window.Telegram?.WebApp
    if (webApp) {
      webApp.ready()
      webApp.expand()
      console.log('Telegram WebApp 已初始化')
    }
  }
}

/**
 * 获取 Telegram WebApp 的原始 initData
 */
export function getTelegramInitData(): string {
  if (!isTelegramWebApp()) {
    return ''
  }

  return window.Telegram?.WebApp?.initData || ''
}

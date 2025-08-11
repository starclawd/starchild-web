import { TelegramUser } from 'store/login/login.d'

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
  console.log('isTelegramWebApp', window.Telegram, window.Telegram?.WebApp && window.Telegram.WebApp.initData)
  return !!(window.Telegram?.WebApp && window.Telegram.WebApp.initData)
}

/**
 * 获取 Telegram WebApp 的用户信息
 */
export function getTelegramWebAppUser(): TelegramUser | null {
  if (!isTelegramWebApp()) {
    return null
  }

  const webApp = window.Telegram?.WebApp
  if (!webApp?.initDataUnsafe?.user) {
    return null
  }

  const { user, auth_date, hash } = webApp.initDataUnsafe

  // 检查必要的字段
  if (!user.id || !user.first_name || !auth_date || !hash) {
    console.warn('Telegram WebApp: 缺少必要的用户信息字段')
    return null
  }

  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username || `user_${user.id}`,
    photo_url: user.photo_url,
    auth_date,
    hash,
  }
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
 * 验证 Telegram WebApp 数据的完整性
 */
export function validateTelegramWebAppData(): boolean {
  if (!isTelegramWebApp()) {
    return false
  }

  const user = getTelegramWebAppUser()
  if (!user) {
    return false
  }

  // 基本验证：检查用户 ID 是否为正整数
  if (!Number.isInteger(user.id) || user.id <= 0) {
    console.warn('Telegram WebApp: 无效的用户 ID')
    return false
  }

  // 检查认证时间是否合理（不超过 24 小时前）
  const authDate = user.auth_date * 1000 // 转换为毫秒
  const now = Date.now()
  const maxAge = 24 * 60 * 60 * 1000 // 24小时

  if (now - authDate > maxAge) {
    console.warn('Telegram WebApp: 认证数据已过期')
    return false
  }

  return true
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

/**
 * 检查是否来自 Telegram Inline Keyboard
 */
export function isFromTelegramInlineKeyboard(): boolean {
  // 检查 URL 参数
  const urlParams = new URLSearchParams(window.location.search)
  const tgWebAppStartParam = urlParams.get('tgWebAppStartParam')
  const startApp = urlParams.get('startapp')

  // 检查是否有 Telegram WebApp 环境并且有相关的启动参数
  return isTelegramWebApp() && (!!tgWebAppStartParam || !!startApp)
}

/**
 * 获取 Telegram WebApp 的启动参数
 */
export function getTelegramStartParams(): Record<string, string> {
  const urlParams = new URLSearchParams(window.location.search)
  const params: Record<string, string> = {}

  // 常见的 Telegram WebApp 参数
  const telegramParams = [
    'tgWebAppStartParam',
    'startapp',
    'tgWebAppData',
    'tgWebAppVersion',
    'tgWebAppPlatform',
    'tgWebAppThemeParams',
  ]

  telegramParams.forEach((param) => {
    const value = urlParams.get(param)
    if (value) {
      params[param] = value
    }
  })

  return params
}

/**
 * 调试 Telegram WebApp 环境
 */
export function debugTelegramWebApp(): void {
  console.group('🔍 Telegram WebApp 调试信息')

  console.log('当前 URL:', window.location.href)
  console.log('User Agent:', navigator.userAgent)
  console.log('是否在 Telegram WebApp 中:', isTelegramWebApp())
  console.log('是否来自 Inline Keyboard:', isFromTelegramInlineKeyboard())
  console.log('启动参数:', getTelegramStartParams())

  if (window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp
    console.log('WebApp 平台:', webApp.platform)
    console.log('WebApp 颜色方案:', webApp.colorScheme)
    console.log('原始 initData:', webApp.initData)
    console.log('解析后的 initDataUnsafe:', webApp.initDataUnsafe)
    console.log('用户信息:', getTelegramWebAppUser())
  } else {
    console.log('❌ 未检测到 Telegram WebApp')
  }

  console.groupEnd()
}

/**
 * 获取 Telegram WebApp 的环境信息
 */
export function getTelegramWebAppInfo() {
  return {
    isTelegramWebApp: isTelegramWebApp(),
    isFromInlineKeyboard: isFromTelegramInlineKeyboard(),
    user: getTelegramWebAppUser(),
    startParams: getTelegramStartParams(),
    platform: window.Telegram?.WebApp?.platform || 'unknown',
    colorScheme: window.Telegram?.WebApp?.colorScheme || 'unknown',
    initData: getTelegramInitData(),
    isDataValid: validateTelegramWebAppData(),
  }
}

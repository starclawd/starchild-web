import { isMatchCurrentRouter } from 'utils'
import { tgLoginConfig } from './login.d'
import { ROUTER } from 'pages/router'

export function getTgLoginUrl(currentRouter: string) {
  // 使用专门的回调页面来处理 Telegram OAuth 回调
  const redirectUri = encodeURIComponent(window.location.href)
  return `https://oauth.telegram.org/auth?bot_id=${tgLoginConfig.botId}&origin=${redirectUri}&request_access=write&return_to=${redirectUri}`
}

// 检查是否是通过 Telegram 登录发起的
export function isFromTGRedirection(): boolean {
  return (window.location.hash || '').includes('tgAuthResult') || window.location.href.includes('/#')
}

/**
 * 在新窗口中打开 Telegram 登录/绑定页面
 * @param currentRouter 当前路由
 * @param windowName 窗口名称，用于区分登录和绑定
 * @returns 弹窗窗口对象，如果弹窗被拦截则返回 null
 *
 * 工作原理：
 * 1. 在新窗口打开 Telegram OAuth 页面
 * 2. 用户授权后，跳转到 /telegram-callback.html
 * 3. 回调页面通过 postMessage 将认证结果发送给主窗口
 * 4. 主窗口的 TgLogin 组件监听 message 事件并处理登录
 */
export function openTelegramLoginWindow(currentRouter: string, windowName: string = 'telegram-login') {
  const loginUrl = getTgLoginUrl(currentRouter)
  const width = 600
  const height = 700
  const left = (window.screen.width - width) / 2
  const top = (window.screen.height - height) / 2

  const popup = window.open(
    loginUrl,
    windowName,
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`,
  )

  // 如果弹窗被拦截，返回 null
  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    console.warn('弹窗被浏览器拦截，请允许弹窗后重试')
    return null
  }

  console.log('Telegram 登录窗口已打开，等待用户授权...')
  return popup
}

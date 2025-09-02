import { isMatchCurrentRouter } from 'utils'
import { tgLoginConfig } from './login.d'
import { ROUTER } from 'pages/router'

export function getTgLoginUrl(currentRouter: string) {
  const redirectUri = encodeURIComponent(window.location.href)
  return `https://oauth.telegram.org/auth?bot_id=${tgLoginConfig.botId}&origin=${redirectUri}&request_access=write&return_to=${redirectUri}`
}

// 检查是否是通过 Telegram 登录发起的
export function isFromTGRedirection(): boolean {
  return (window.location.hash || '').includes('tgAuthResult') || window.location.href.includes('/#')
}

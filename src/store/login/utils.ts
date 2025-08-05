import { isMatchCurrentRouter } from 'utils'
import { tgLoginConfig } from './login.d'
import { ROUTER } from 'pages/router'

export function getTgLoginUrl(currentRouter: string) {
  const isHomePage = isMatchCurrentRouter(currentRouter, ROUTER.HOME)
  const redirectUri = encodeURIComponent(`${window.location.href}${isHomePage ? '?login=1' : ''}`)
  return `https://oauth.telegram.org/auth?bot_id=${tgLoginConfig.botId}&origin=${redirectUri}&request_access=write&return_to=${redirectUri}`
}

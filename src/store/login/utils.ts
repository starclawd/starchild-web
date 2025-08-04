import { tgLoginConfig } from './login.d'

export function getTgLoginUrl() {
  const redirectUri = encodeURIComponent(`${window.location.origin}?login=1`)
  return `https://oauth.telegram.org/auth?bot_id=${tgLoginConfig.botId}&origin=${redirectUri}&request_access=write&return_to=${redirectUri}`
}

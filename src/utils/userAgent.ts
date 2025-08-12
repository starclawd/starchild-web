import { UAParser } from 'ua-parser-js'

const parser = new UAParser(window.navigator.userAgent)
const { type } = parser.getDevice()

export const userAgent = parser.getResult()

export const isMobile = type === 'mobile' || type === 'tablet'

export const isIos = userAgent.os.name === 'iOS'

export const isAndroid = userAgent.os.name === 'Android'

export const isOKApp = /OKApp/i.test(window.navigator.userAgent)
// ios 添加到屏幕方式打开
export const isIosDesk = (window.navigator as any).standalone

export const isPwaDesk = window.matchMedia('(display-mode: standalone)').matches

export const isSafari =
  /safari/i.test(window.navigator.userAgent) && !/(chrome|crios|crmo|edg|edge)/i.test(window.navigator.userAgent)

export const isMac = /macintosh|mac os x/i.test(navigator.userAgent)

export const isTelegramWebApp = /Telegram/i.test(window.navigator.userAgent)

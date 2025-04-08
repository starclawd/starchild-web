import { parsedQueryString } from "hooks/useParsedQueryString"
import { isMobile } from "./userAgent"
import { OPEN_ALL_PERMISSIONS } from "types/global.d"

/**
 * 外链统一配置
 */
export const FAQs = 'FAQs'

export const URL = {
  [FAQs]: 'https://bx.vc/24z03n',
}

export const isLocalEnv = process.env.BUILD_ENV === 'development'
export const isPro = process.env.BUILD_ENV === 'production'
export const customizedApiWhitelist = ['shadow']

export const tradeAiDomainOrigin = {
  // 本地测试
  development: {
    restfulDomain: '/baseTradeAiTestnet',
  },
  // 本地主网
  localPro: {
    restfulDomain: '/baseTradeAiMainnet'
  },
  // 测试环境
  test: {
    restfulDomain: 'https://ai-bot-api.base-sepolia.jojo.exchange',
  },
  // 主网
  pro: {
    restfulDomain: 'https://ai-bot-api.base-mainnet.jojo.exchange',
  },
}

export const tradeAiDomain = new Proxy(tradeAiDomainOrigin, {
  get: (target, domainType: keyof typeof tradeAiDomainOrigin) => {
    const search = window.location.search
    let resultDomainData = ''
    const { openAllPermissions } = parsedQueryString(search)
    if (isLocalEnv) {
      resultDomainData = tradeAiDomainOrigin['development'][domainType as keyof typeof tradeAiDomainOrigin['development']]
      if (openAllPermissions === OPEN_ALL_PERMISSIONS.MAIN_NET) {
        resultDomainData = tradeAiDomainOrigin['localPro'][domainType as keyof typeof tradeAiDomainOrigin['localPro']]
      }
    } else if (isPro) {
      resultDomainData = tradeAiDomainOrigin['pro'][domainType as keyof typeof tradeAiDomainOrigin['pro']]
    }
    if (resultDomainData && !isLocalEnv && !isJojoHostDomain(resultDomainData)) {
      return ''
    }
    return resultDomainData
  }
})

export function isJojoHostDomain(url: string): boolean {
  const parseData = new window.URL(url)
  const { hostname } = parseData
  return /\.jojo\.exchange$/.test(hostname)
}

export function goOutPageCommon(url: string) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation()
    if (isMobile) {
      window.location.href = url
      return
    }
    const _open = window.open()
    if (_open) {
      _open.opener = null
      _open.location = url
    }
  }
}

export function goOutPageDirect(url: string) {
  if (isMobile) {
    window.location.href = url
    return
  }
  const _open = window.open()
  if (_open) {
    _open.opener = null
    _open.location = url
  }
}

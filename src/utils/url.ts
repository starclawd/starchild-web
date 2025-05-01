import { parsedQueryString } from "hooks/useParsedQueryString"
import { isMobile } from "./userAgent"
import { OPEN_ALL_PERMISSIONS } from "types/global.d"

/**
 * 外链统一配置
 */
export const FAQs = 'FAQs'
export const TELEGRAM = 'TELEGRAM'
export const URL = {
  [FAQs]: '',
  [TELEGRAM]: 'https://t.me/HolomindsBot',
}

export const isLocalEnv = process.env.BUILD_ENV === 'development'
export const isTestEnv = process.env.BUILD_ENV === 'test'
export const isPro = process.env.BUILD_ENV === 'production'
export const customizedApiWhitelist = ['shadow']

export const holomindsDomainOrigin = {
  // 本地测试
  development: {
    restfulDomain: '/holomindsTestnet',
  },
  // 本地主网
  localPro: {
    restfulDomain: '/holomindsMainnet'
  },
  // 测试环境
  test: {
    restfulDomain: 'http://54.169.231.27:30000/v1',
  },
  // 主网
  pro: {
    restfulDomain: '',
  },
}

export const holomindsDomain = new Proxy({} as Record<string, string>, {
  get: (_, prop: string) => {
    const search = window.location.search
    let environmentType: keyof typeof holomindsDomainOrigin = 'development'
    const { openAllPermissions } = parsedQueryString(search)
    
    if (isLocalEnv) {
      environmentType = openAllPermissions === OPEN_ALL_PERMISSIONS.MAIN_NET ? 'localPro' : 'development'
    } else if (isTestEnv) {
      environmentType = 'test'
    } else if (isPro) {
      environmentType = 'pro'
    }
    return holomindsDomainOrigin[environmentType][prop as keyof typeof holomindsDomainOrigin[typeof environmentType]]
  }
})

export const tradeAiDomainOrigin = {
  // 本地测试
  development: {
    restfulDomain: '/tradeaiTestnet',
  },
  // 本地主网
  localPro: {
    restfulDomain: '/tradeaiMainnet'
  },
  // 测试环境
  test: {
    restfulDomain: 'http://54.169.231.27:8008',
  },
  // 主网
  pro: {
    restfulDomain: '',
  },
}

export const tradeAiDomain = new Proxy({} as Record<string, string>, {
  get: (_, prop: string) => {
    const search = window.location.search
    let environmentType: keyof typeof tradeAiDomainOrigin = 'development'
    const { openAllPermissions } = parsedQueryString(search)
    
    if (isLocalEnv) {
      environmentType = openAllPermissions === OPEN_ALL_PERMISSIONS.MAIN_NET ? 'localPro' : 'development'
    } else if (isTestEnv) {
      environmentType = 'test'
    } else if (isPro) {
      environmentType = 'pro'
    }
    
    return tradeAiDomainOrigin[environmentType][prop as keyof typeof tradeAiDomainOrigin[typeof environmentType]]
  }
})

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

export function isEvmAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isSolanaAddress(address: string) {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

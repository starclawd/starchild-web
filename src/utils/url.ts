import { parsedQueryString } from 'hooks/useParsedQueryString'
import { isMobile } from './userAgent'
import { OPEN_ALL_PERMISSIONS } from 'types/global.d'
import { WS_TYPE } from 'store/websocket/websocket'

/**
 * 外链统一配置
 */
export const FAQs = 'FAQs'
export const TELEGRAM = 'TELEGRAM'
export const TELEGRAM_EARLY_ACCESS = 'TELEGRAM_EARLY_ACCESS'
export const WAIT_TELEGRAM = 'WAIT_TELEGRAM'
export const URL = {
  [FAQs]: '',
  [TELEGRAM]: 'https://t.me/onchain_aiagent_bot',
  [TELEGRAM_EARLY_ACCESS]: 'https://t.me/starchild_beta',
  [WAIT_TELEGRAM]: 'https://t.me/starchildAI',
}

export const isLocalEnv = process.env.BUILD_ENV === 'development'
export const isTestEnv = process.env.BUILD_ENV === 'test'
export const isPro = process.env.BUILD_ENV === 'production'
export const customizedApiWhitelist = ['shadow']

export const starchildDomainOrigin = {
  // 本地测试
  development: {
    restfulDomain: '/starchildTestnet',
  },
  // 本地主网
  localPro: {
    restfulDomain: '/starchildMainnet',
  },
  // 测试环境
  test: {
    restfulDomain: 'https://api.testnet.holominds.ai/v1',
  },
  // 主网
  pro: {
    restfulDomain: '',
  },
}

export const starchildDomain = new Proxy({} as Record<string, string>, {
  get: (_, prop: string) => {
    const search = window.location.search
    let environmentType: keyof typeof starchildDomainOrigin = 'development'
    const { openAllPermissions } = parsedQueryString(search)

    if (isLocalEnv) {
      environmentType = openAllPermissions === OPEN_ALL_PERMISSIONS.MAIN_NET ? 'localPro' : 'development'
    } else if (isTestEnv) {
      environmentType = 'test'
    } else if (isPro) {
      environmentType = 'pro'
    }
    return starchildDomainOrigin[environmentType][prop as keyof (typeof starchildDomainOrigin)[typeof environmentType]]
  },
})

export const chatDomainOrigin = {
  // 本地测试
  development: {
    restfulDomain: '/chatTestnet',
  },
  // 本地主网
  localPro: {
    restfulDomain: '/chatMainnet',
  },
  // 测试环境
  test: {
    restfulDomain: 'https://ai-api.testnet.holominds.ai',
  },
  // 主网
  pro: {
    restfulDomain: '',
  },
}

export const chatDomain = new Proxy({} as Record<string, string>, {
  get: (_, prop: string) => {
    const search = window.location.search
    let environmentType: keyof typeof chatDomainOrigin = 'development'
    const { openAllPermissions } = parsedQueryString(search)

    if (isLocalEnv) {
      environmentType = openAllPermissions === OPEN_ALL_PERMISSIONS.MAIN_NET ? 'localPro' : 'development'
    } else if (isTestEnv) {
      environmentType = 'test'
    } else if (isPro) {
      environmentType = 'pro'
    }

    return chatDomainOrigin[environmentType][prop as keyof (typeof chatDomainOrigin)[typeof environmentType]]
  },
})

export const webSocketDomainOrigin = {
  // 本地测试
  development: {
    [WS_TYPE.BINNANCE_WS]: 'wss://stream.binance.com/stream',
    [WS_TYPE.INSIGHTS_WS]: 'wss://ws.testnet.holominds.ai/v1/multiple?streams=ai-trigger-notification',
  },
  // 本地主网
  localPro: {
    [WS_TYPE.BINNANCE_WS]: 'wss://stream.binance.com/stream',
    [WS_TYPE.INSIGHTS_WS]: '',
  },
  // 测试环境
  test: {
    [WS_TYPE.BINNANCE_WS]: 'wss://stream.binance.com/stream',
    [WS_TYPE.INSIGHTS_WS]: 'wss://ws.testnet.holominds.ai/v1/multiple?streams=ai-trigger-notification',
  },
  // 主网
  pro: {
    [WS_TYPE.BINNANCE_WS]: 'wss://stream.binance.com/stream',
    [WS_TYPE.INSIGHTS_WS]: '',
  },
}

export const webSocketDomain = new Proxy({} as Record<string, string>, {
  get: (_, prop: string) => {
    const search = window.location.search
    let environmentType: keyof typeof webSocketDomainOrigin = 'development'
    const { openAllPermissions } = parsedQueryString(search)

    if (isLocalEnv) {
      environmentType = openAllPermissions === OPEN_ALL_PERMISSIONS.MAIN_NET ? 'localPro' : 'development'
    } else if (isTestEnv) {
      environmentType = 'test'
    } else if (isPro) {
      environmentType = 'pro'
    }

    return webSocketDomainOrigin[environmentType][prop as keyof (typeof webSocketDomainOrigin)[typeof environmentType]]
  },
})

export function goOutPageCommon(url: string) {
  return (e: React.MouseEvent<any>) => {
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
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function isSolanaAddress(address: string) {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
  return base58Regex.test(address)
}

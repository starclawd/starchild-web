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
export const STARCHILD_BOT = 'STARCHILD_BOT'
export const X = 'X'
export const URL = {
  [FAQs]: '',
  [TELEGRAM]: 'https://t.me/onchain_aiagent_bot',
  [TELEGRAM_EARLY_ACCESS]: 'https://t.me/+n2aylVatkuwxYWU1',
  [WAIT_TELEGRAM]: 'https://t.me/starchildAI',
  [STARCHILD_BOT]: 'https://t.me/iamstarchild_bot',
  [X]: 'https://x.com/StarchildOnX',
}

export const isLocalEnv = process.env.BUILD_ENV === 'development'
export const isTestEnv = process.env.BUILD_ENV === 'test'
export const isPro = process.env.BUILD_ENV === 'production'
export const customizedApiWhitelist = ['shadow']

export const starchildDomainOrigin = {
  // 本地测试
  development: {
    restfulDomain: '/starchildTestnet',
    frontendPageDomain: 'https://testnet.iamstarchild.com',
  },
  // 本地主网
  localPro: {
    restfulDomain: '/starchildMainnet',
    frontendPageDomain: 'https://iamstarchild.com',
  },
  // 测试环境
  test: {
    restfulDomain: 'https://api-testnet.iamstarchild.com/v1',
    frontendPageDomain: 'https://testnet.iamstarchild.com',
  },
  // 主网
  pro: {
    restfulDomain: 'https://api-mainnet.iamstarchild.com/v1',
    frontendPageDomain: 'https://iamstarchild.com',
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
    restfulDomain: 'https://ai-api-testnet.iamstarchild.com',
  },
  // 主网
  pro: {
    restfulDomain: 'https://ai-api-mainnet.iamstarchild.com',
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
    [WS_TYPE.INSIGHTS_WS]: 'wss://ws-testnet.iamstarchild.com/v1/multiple',
    [WS_TYPE.PRIVATE_WS]: 'wss://ws-testnet.iamstarchild.com/v1/single',
  },
  // 本地主网
  localPro: {
    [WS_TYPE.BINNANCE_WS]: 'wss://stream.binance.com/stream',
    [WS_TYPE.INSIGHTS_WS]: 'wss://ws-mainnet.iamstarchild.com/v1/multiple',
    [WS_TYPE.PRIVATE_WS]: 'wss://ws-mainnet.iamstarchild.com/v1/single',
  },
  // 测试环境
  test: {
    [WS_TYPE.BINNANCE_WS]: 'wss://stream.binance.com/stream',
    [WS_TYPE.INSIGHTS_WS]: 'wss://ws-testnet.iamstarchild.com/v1/multiple',
    [WS_TYPE.PRIVATE_WS]: 'wss://ws-testnet.iamstarchild.com/v1/single',
  },
  // 主网
  pro: {
    [WS_TYPE.BINNANCE_WS]: 'wss://stream.binance.com/stream',
    [WS_TYPE.INSIGHTS_WS]: 'wss://ws-mainnet.iamstarchild.com/v1/multiple',
    [WS_TYPE.PRIVATE_WS]: 'wss://ws-mainnet.iamstarchild.com/v1/single',
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

export const orderlyDomainOrigin = {
  // 本地测试
  development: {
    restfulDomain: '/orderlyTestnet',
  },
  // 本地主网
  localPro: {
    restfulDomain: '/orderlyMainnet',
  },
  // 测试环境
  test: {
    restfulDomain: 'https://testnet-api-sv.orderly.org',
  },
  // 主网
  pro: {
    restfulDomain: 'https://api-sv.orderly.org',
  },
}

export const orderlyDomain = new Proxy({} as Record<string, string>, {
  get: (_, prop: string) => {
    const search = window.location.search
    let environmentType: keyof typeof orderlyDomainOrigin = 'development'
    const { openAllPermissions } = parsedQueryString(search)

    if (isLocalEnv) {
      environmentType = openAllPermissions === OPEN_ALL_PERMISSIONS.MAIN_NET ? 'localPro' : 'development'
    } else if (isTestEnv) {
      environmentType = 'test'
    } else if (isPro) {
      environmentType = 'pro'
    }

    return orderlyDomainOrigin[environmentType][prop as keyof (typeof orderlyDomainOrigin)[typeof environmentType]]
  },
})

export const liveTradingDomainOrigin = {
  // 本地测试
  development: {
    restfulDomain: '/liveTradingTestnet',
  },
  // 本地主网
  localPro: {
    restfulDomain: '/liveTradingMainnet',
  },
  // 测试环境
  test: {
    restfulDomain: 'https://tg-api-testnet-899f9ba9abd5.herokuapp.com/api/v1',
  },
  // 主网
  pro: {
    restfulDomain: 'https://live-trading-api-d1c577e70373.herokuapp.com/api/v1',
  },
}

export const liveTradingDomain = new Proxy({} as Record<string, string>, {
  get: (_, prop: string) => {
    const search = window.location.search
    let environmentType: keyof typeof liveTradingDomainOrigin = 'development'
    const { openAllPermissions } = parsedQueryString(search)

    if (isLocalEnv) {
      environmentType = openAllPermissions === OPEN_ALL_PERMISSIONS.MAIN_NET ? 'localPro' : 'development'
    } else if (isTestEnv) {
      environmentType = 'test'
    } else if (isPro) {
      environmentType = 'pro'
    }

    return liveTradingDomainOrigin[environmentType][
      prop as keyof (typeof liveTradingDomainOrigin)[typeof environmentType]
    ]
  },
})

export const hyperliquidDomainOrigin = {
  // 本地测试
  development: {
    restfulDomain: 'hyperliquidTestnet',
  },
  // 本地主网
  localPro: {
    restfulDomain: 'hyperliquidMainnet',
  },
  // 测试环境
  test: {
    restfulDomain: 'https://api-ui.hyperliquid-testnet.xyz',
  },
  // 主网
  pro: {
    restfulDomain: 'https://api.hyperliquid.xyz',
  },
}

export const hyperliquidDomain = new Proxy({} as Record<string, string>, {
  get: (_, prop: string) => {
    const search = window.location.search
    let environmentType: keyof typeof hyperliquidDomainOrigin = 'development'
    const { openAllPermissions } = parsedQueryString(search)

    if (isLocalEnv) {
      environmentType = openAllPermissions === OPEN_ALL_PERMISSIONS.MAIN_NET ? 'localPro' : 'development'
    } else if (isTestEnv) {
      environmentType = 'test'
    } else if (isPro) {
      environmentType = 'pro'
    }

    return hyperliquidDomainOrigin[environmentType][
      prop as keyof (typeof hyperliquidDomainOrigin)[typeof environmentType]
    ]
  },
})

export const hyperliquidChainIdOrigin = {
  // 本地测试
  development: {
    chainId: 'Testnet',
  },
  // 本地主网
  localPro: {
    chainId: 'Mainnet',
  },
  // 测试环境
  test: {
    chainId: 'Testnet',
  },
  // 主网
  pro: {
    chainId: 'Mainnet',
  },
}

export const hyperliquidChainId = new Proxy({} as Record<string, string>, {
  get: (_, prop: string) => {
    const search = window.location.search
    let environmentType: keyof typeof hyperliquidChainIdOrigin = 'development'
    const { openAllPermissions } = parsedQueryString(search)
    if (isLocalEnv) {
      environmentType = openAllPermissions === OPEN_ALL_PERMISSIONS.MAIN_NET ? 'localPro' : 'development'
    } else if (isTestEnv) {
      environmentType = 'test'
    } else if (isPro) {
      environmentType = 'pro'
    }
    return hyperliquidChainIdOrigin[environmentType][
      prop as keyof (typeof hyperliquidChainIdOrigin)[typeof environmentType]
    ]
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

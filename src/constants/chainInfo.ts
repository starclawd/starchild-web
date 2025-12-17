import baseIcon from 'assets/chains/base.png'
import arbitrumIcon from 'assets/chains/arbitrum.png'
import optimismIcon from 'assets/chains/optimism.png'
import seiIcon from 'assets/chains/sei.png'
import { AppKitNetwork, arbitrum, base, optimism, sei, arbitrumSepolia, sepolia } from '@reown/appkit/networks'
import { isPro } from 'utils/url'

export enum Chain {
  BASE = 'base',
  ARBITRUM = 'arbitrum',
  OPTIMISM = 'optimism',
  SEI = 'sei',
  ARBITRUM_SEPOLIA = 'arbitrum_sepolia',
}

export enum CHAIN_ID {
  BASE = 8453,
  ARBITRUM = 42161,
  OPTIMISM = 10,
  SEI = 1329,
  ARBITRUM_SEPOLIA = 421614,
  SEPOLIA = 11155111,
}

export const CHAIN_INFO = {
  [Chain.BASE]: {
    name: 'Base',
    chainId: CHAIN_ID.BASE,
    chainName: 'Base',
    explorer: 'https://basescan.org',
    icon: baseIcon,
    usdcContractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    appKitNetwork: base as AppKitNetwork,
  },
  [Chain.ARBITRUM]: {
    name: 'Arbitrum',
    chainId: CHAIN_ID.ARBITRUM,
    chainName: 'Arbitrum',
    explorer: 'https://arbiscan.io',
    icon: arbitrumIcon,
    usdcContractAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    appKitNetwork: arbitrum as AppKitNetwork,
  },
  [Chain.ARBITRUM_SEPOLIA]: {
    name: 'Arbitrum Sepolia',
    chainId: CHAIN_ID.ARBITRUM_SEPOLIA,
    chainName: 'Arbitrum Sepolia',
    explorer: 'https://sepolia.arbiscan.io',
    icon: arbitrumIcon,
    usdcContractAddress: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
    appKitNetwork: arbitrumSepolia as AppKitNetwork,
  },
  [Chain.OPTIMISM]: {
    name: 'Optimism',
    chainId: CHAIN_ID.OPTIMISM,
    chainName: 'Optimism',
    explorer: 'https://optimistic.etherscan.io',
    icon: optimismIcon,
    usdcContractAddress: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    appKitNetwork: optimism as AppKitNetwork,
  },
  [Chain.SEI]: {
    name: 'Sei',
    chainId: CHAIN_ID.SEI,
    chainName: 'Sei',
    explorer: 'https://seitrace.com',
    icon: seiIcon,
    usdcContractAddress: '0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1',
    appKitNetwork: sei as AppKitNetwork,
  },
}

export type ChainInfo = typeof CHAIN_INFO
export type SupportedChain = keyof ChainInfo

// ChainId 到 Chain 的映射（只包含已配置的链）
const baseChainMapping = {
  8453: Chain.BASE,
  10: Chain.OPTIMISM,
  42161: Chain.ARBITRUM,
  1329: Chain.SEI,
} as const

const testnetChainMapping = {
  421614: Chain.ARBITRUM_SEPOLIA,
} as const

export const CHAIN_ID_TO_CHAIN: Record<number, SupportedChain> = isPro ? baseChainMapping : testnetChainMapping

// 根据 chainId 获取链信息
export function getChainInfo(chainId: number | undefined) {
  if (!chainId) return undefined
  const chain = CHAIN_ID_TO_CHAIN[chainId]
  return chain ? CHAIN_INFO[chain] : undefined
}

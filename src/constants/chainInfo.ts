import ethIcon from 'assets/chains/ether.png'
import bscIcon from 'assets/chains/bnb.png'
import baseIcon from 'assets/chains/base.png'
import arbitrumIcon from 'assets/chains/arbitrum.png'
import solanaIcon from 'assets/chains/solana.png'
import optimismIcon from 'assets/chains/optimism.png'
import polygonIcon from 'assets/chains/polygon.png'

export enum Chain {
  ETHEREUM = 'eth',
  BSC = 'bsc',
  BASE = 'base',
  ARBITRUM = 'arbitrum',
  SOLANA = 'solana',
  OPTIMISM = 'optimism',
  POLYGON = 'polygon',
}

export const CHAIN_INFO = {
  [Chain.ETHEREUM]: {
    name: 'Ethereum',
    chainId: 1,
    chainName: 'Ethereum',
    explorer: 'https://etherscan.io',
    icon: ethIcon,
    usdcContractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  [Chain.BASE]: {
    name: 'Base',
    chainId: 8453,
    chainName: 'Base',
    explorer: 'https://basescan.org',
    icon: baseIcon,
    usdcContractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  [Chain.ARBITRUM]: {
    name: 'Arbitrum',
    chainId: 42161,
    chainName: 'Arbitrum',
    explorer: 'https://arbiscan.io',
    icon: arbitrumIcon,
    usdcContractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  [Chain.OPTIMISM]: {
    name: 'Optimism',
    chainId: 10,
    chainName: 'Optimism',
    explorer: 'https://optimistic.etherscan.io',
    icon: optimismIcon,
    usdcContractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  [Chain.POLYGON]: {
    name: 'Polygon',
    chainId: 137,
    chainName: 'Polygon',
    explorer: 'https://polygonscan.com',
    icon: polygonIcon,
    usdcContractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
}

export type ChainInfo = typeof CHAIN_INFO
export type SupportedChain = keyof ChainInfo

// ChainId 到 Chain 的映射（只包含已配置的链）
export const CHAIN_ID_TO_CHAIN: Record<number, SupportedChain> = {
  8453: Chain.BASE,
  1: Chain.ETHEREUM,
  10: Chain.OPTIMISM,
  137: Chain.POLYGON,
  42161: Chain.ARBITRUM,
}

// 根据 chainId 获取链信息
export function getChainInfo(chainId: number | undefined) {
  if (!chainId) return undefined
  const chain = CHAIN_ID_TO_CHAIN[chainId]
  return chain ? CHAIN_INFO[chain] : undefined
}

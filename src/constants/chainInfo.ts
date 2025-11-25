import ethIcon from 'assets/chains/ether.png'
import bscIcon from 'assets/chains/bnb.png'
import baseIcon from 'assets/chains/base.png'
import arbitrumIcon from 'assets/chains/arbitrum.png'
import solanaIcon from 'assets/chains/solana.png'

export enum Chain {
  ETHEREUM = 'eth',
  BSC = 'bsc',
  BASE = 'base',
  ARBITRUM = 'arbitrum',
  SOLANA = 'solana',
}

export const CHAIN_INFO = {
  [Chain.BASE]: {
    name: 'Base',
    chainId: 8453,
    chainName: 'Base',
    explorer: 'https://basescan.org',
    icon: baseIcon,
    usdcContractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    orderlyVaultContractAddress: '0x70Fe7d65Ac7c1a1732f64d2E6fC0E33622D0C991',
  },
}

export type ChainInfo = typeof CHAIN_INFO
export type SupportedChain = keyof ChainInfo

// ChainId 到 Chain 的映射（只包含已配置的链）
export const CHAIN_ID_TO_CHAIN: Record<number, SupportedChain> = {
  8453: Chain.BASE,
}

// 根据 chainId 获取链信息
export function getChainInfo(chainId: number | undefined) {
  if (!chainId) return undefined
  const chain = CHAIN_ID_TO_CHAIN[chainId]
  return chain ? CHAIN_INFO[chain] : undefined
}

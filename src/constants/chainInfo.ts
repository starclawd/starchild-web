export enum Chain {
  ETHEREUM = 'eth',
  BSC = 'bsc',
  BASE = 'base',
  ARBITRUM = 'arbitrum',
  SOLANA = 'solana',
}


export const CHAIN_INFO = {
  [Chain.ETHEREUM]: {
    name: 'Ethereum',
    chainId: '1',
    chainName: 'Ethereum',
    explorer: 'https://etherscan.io',
  },
  [Chain.BSC]: {
    name: 'BSC',
    chainId: '56',
    chainName: 'BSC',
    explorer: 'https://bscscan.com',
  },
  [Chain.BASE]: {
    name: 'Base',
    chainId: '8453',
    chainName: 'Base',
    explorer: 'https://basescan.org',
  },
  [Chain.ARBITRUM]: {
    name: 'Arbitrum',
    chainId: '42161',
    chainName: 'Arbitrum',
    explorer: 'https://arbiscan.io',
  },
  [Chain.SOLANA]: {
    name: 'Solana',
    chainId: '',
    chainName: 'Solana',
    explorer: 'https://solscan.io',
  },
}

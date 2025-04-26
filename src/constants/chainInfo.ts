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
    explorer: 'https://etherscan.io',
  },
  [Chain.BSC]: {
    name: 'BSC',
    chainId: '56',
    explorer: 'https://bscscan.com',
  },
  [Chain.BASE]: {
    name: 'Base',
    chainId: '8453',
    explorer: 'https://basescan.org',
  },
  [Chain.ARBITRUM]: {
    name: 'Arbitrum',
    chainId: '42161',
    explorer: 'https://arbiscan.io',
  },
  [Chain.SOLANA]: {
    name: 'Solana',
    chainId: '',
    explorer: 'https://solscan.io',
  },
}

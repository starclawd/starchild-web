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
  [Chain.ETHEREUM]: {
    name: 'Ethereum',
    chainId: '1',
    chainName: 'Ethereum',
    explorer: 'https://etherscan.io',
    icon: ethIcon,
  },
  [Chain.BSC]: {
    name: 'BNB',
    chainId: '56',
    chainName: 'BNB',
    explorer: 'https://bscscan.com',
    icon: bscIcon,
  },
  [Chain.BASE]: {
    name: 'Base',
    chainId: '8453',
    chainName: 'Base',
    explorer: 'https://basescan.org',
    icon: baseIcon,
  },
  [Chain.ARBITRUM]: {
    name: 'Arbitrum',
    chainId: '42161',
    chainName: 'Arbitrum',
    explorer: 'https://arbiscan.io',
    icon: arbitrumIcon,
  },
  [Chain.SOLANA]: {
    name: 'Solana',
    chainId: '',
    chainName: 'Solana',
    explorer: 'https://solscan.io',
    icon: solanaIcon,
  },
}

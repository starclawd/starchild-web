import { useMemo } from "react"

export function useTokenList() {
  return useMemo(() => {
    return [{
      symbol: 'BTC',
      des: 'Bitcoin'
    }, {
      symbol: 'ETH',
      des: 'Ethereum'
    }, {
      symbol: 'USDT',
      des: 'Tether'
    }, {
      symbol: 'USDC',
      des: 'USD Coin'
    }, {
      symbol: 'BNB',
      des: 'BNB'
    }, {
      symbol: 'SOL',
      des: 'Solana'
    }, {
      symbol: 'ADA',
      des: 'Cardano'
    }, {
      symbol: 'XRP',
      des: 'XRP'
    }, {
      symbol: 'DOT',
      des: 'Polkadot'
    }, {
      symbol: 'LINK',
      des: 'Chainlink'
    }]
  }, [])
}

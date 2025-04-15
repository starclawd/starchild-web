import { useCallback, useEffect } from 'react'
import { useCurrentWalletAddress, useGetEvmDefiPositionsSummary, useGetEvmWalletNetWorth, useGetEvmWalletProfitabilitySummary, useGetEvmWalletTokenBalancesPrice } from 'store/portfolio/hooks'
import { EvmChain } from 'store/portfolio/portfolio.d'
import styled from 'styled-components'

const EvmWalletWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
`

export default function EvmWallet() {
  const [currentWalletAddress] = useCurrentWalletAddress()
  const triggerGetEvmWalletTokenBalancesPrice = useGetEvmWalletTokenBalancesPrice()
  const triggerGetEvmWalletNetWorth = useGetEvmWalletNetWorth()
  const triggerGetEvmWalletProfitabilitySummary = useGetEvmWalletProfitabilitySummary()
  const triggerGetEvmDefiPositionsSummary = useGetEvmDefiPositionsSummary()
  const getDefiPositionsSummary = useCallback(async () => {
    const data: any = await triggerGetEvmDefiPositionsSummary({
      walletAddress: currentWalletAddress,
      chain: EvmChain.ETHEREUM,
    })
    const result = JSON.parse(data.data)
    console.log('result', result)
  }, [triggerGetEvmDefiPositionsSummary])
  const getProfitabilitySummary = useCallback(async () => {
    const data: any = await triggerGetEvmWalletProfitabilitySummary({
      walletAddress: currentWalletAddress,
      chain: EvmChain.ETHEREUM,
    })
    const result = JSON.parse(data.data)
    console.log('result', result)
  }, [triggerGetEvmWalletProfitabilitySummary]) 
  const getNetWorth = useCallback(async () => {
    const data: any = await triggerGetEvmWalletNetWorth({
      walletAddress: currentWalletAddress,
      chains: [EvmChain.ETHEREUM],
    })
    const result = JSON.parse(data.data)
    console.log('result', result)
  }, [triggerGetEvmWalletNetWorth])
  const getTokens = useCallback(async () => {
    const data: any = await triggerGetEvmWalletTokenBalancesPrice({
      walletAddress: currentWalletAddress,
      chain: EvmChain.ETHEREUM,
      cursor: '',
    })
    const result = JSON.parse(data.data)
    console.log('result', result)
  }, [triggerGetEvmWalletTokenBalancesPrice])
  useEffect(() => {
    // getTokens()
    // getNetWorth()
    // getProfitabilitySummary()
    getDefiPositionsSummary()
  }, [getTokens, getNetWorth, getDefiPositionsSummary])
  return <EvmWalletWrapper>
    
  </EvmWalletWrapper>
}

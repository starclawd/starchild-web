import { useCallback, useEffect } from 'react'
import { useCurrentWalletAddress, useGetEvmDefiPositionsSummary, useGetEvmWalletNetWorth, useGetEvmWalletProfitabilitySummary, useGetEvmWalletTokenBalancesPrice } from 'store/portfolio/hooks'
import { Chain } from 'constants/chainInfo'
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
      chain: Chain.ETHEREUM,
    })
    const result = JSON.parse(data.data)
    console.log('result', result)
  }, [currentWalletAddress, triggerGetEvmDefiPositionsSummary])
  const getProfitabilitySummary = useCallback(async () => {
    const data: any = await triggerGetEvmWalletProfitabilitySummary({
      walletAddress: currentWalletAddress,
      chain: Chain.ETHEREUM,
    })
    const result = JSON.parse(data.data)
    console.log('result', result)
  }, [currentWalletAddress, triggerGetEvmWalletProfitabilitySummary]) 
  const getNetWorth = useCallback(async () => {
    const data: any = await triggerGetEvmWalletNetWorth({
      walletAddress: currentWalletAddress,
      chains: [Chain.ETHEREUM],
    })
    const result = JSON.parse(data.data)
    console.log('result', result)
  }, [currentWalletAddress, triggerGetEvmWalletNetWorth])
  const getTokens = useCallback(async () => {
    const data: any = await triggerGetEvmWalletTokenBalancesPrice({
      walletAddress: currentWalletAddress,
      chain: Chain.ETHEREUM,
      cursor: '',
    })
    const result = JSON.parse(data.data)
    console.log('result', result)
  }, [currentWalletAddress, triggerGetEvmWalletTokenBalancesPrice])
  useEffect(() => {
    // getTokens()
    // getNetWorth()
    // getProfitabilitySummary()
    getDefiPositionsSummary()
  }, [getTokens, getNetWorth, getDefiPositionsSummary])
  return <EvmWalletWrapper>
    
  </EvmWalletWrapper>
}

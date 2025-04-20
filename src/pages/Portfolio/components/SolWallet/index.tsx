import { useCallback, useEffect } from 'react'
import { useCurrentWalletAddress, useGetSolWalletPortfolio, useGetSolWalletTokenBalancesPrice } from 'store/portfolio/hooks'
import styled from 'styled-components'
const SolWalletWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
`

export default function SolWallet() {
  const [currentWalletAddress] = useCurrentWalletAddress()
  const triggerGetSolWalletTokenBalancesPrice = useGetSolWalletTokenBalancesPrice()
  const triggerGetSolWalletPortfolio = useGetSolWalletPortfolio()
  const getPortfolio = useCallback(async () => {
    const data: any = await triggerGetSolWalletPortfolio({
      walletAddress: currentWalletAddress,
      network: 'mainnet',
    })
    const result = JSON.parse(data.data)
    console.log('result', result)
  }, [currentWalletAddress, triggerGetSolWalletPortfolio])  
  const getTokenBalancesPrice = useCallback(async () => {
    const data: any = await triggerGetSolWalletTokenBalancesPrice({
      walletAddress: currentWalletAddress,
      network: 'mainnet',
    })
    const result = JSON.parse(data.data)
    console.log('result', result)
  }, [currentWalletAddress, triggerGetSolWalletTokenBalancesPrice])
  useEffect(() => {
    getPortfolio()
    // getTokenBalancesPrice()
  }, [getPortfolio, getTokenBalancesPrice])
  return <SolWalletWrapper>
    
  </SolWalletWrapper>
}

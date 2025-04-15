import { useCurrentWalletAddress } from 'store/portfolio/hooks'
import styled from 'styled-components'
import EvmWallet from './components/EvmWallet'
import SolWallet from './components/SolWallet'
import { isEvmAddress } from 'utils/url'
const PortfolioWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
`

export default function Portfolio() {
  const [currentWalletAddress] = useCurrentWalletAddress()
  return <PortfolioWrapper>
    {isEvmAddress(currentWalletAddress) ? <EvmWallet /> : <SolWallet />}
  </PortfolioWrapper>
}

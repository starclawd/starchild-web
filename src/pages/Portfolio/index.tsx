import { useCurrentWalletAddress } from 'store/portfolio/hooks'
import styled from 'styled-components'
import EvmWallet from './components/EvmWallet'
import SolWallet from './components/SolWallet'
import { isEvmAddress } from 'utils/url'
import { ANI_DURATION } from 'constants/index'
const PortfolioWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  ${({ theme }) => theme.mediaMinWidth.minWidth1024`
    .left-content {
      width: 380px;
    }
    .right-content {
      width: 564px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1280`
    .left-content {
      width: 380px;
    }
    .right-content {
      width: 800px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1440`
    .left-content {
      width: 516px;
    }
    .right-content {
      width: 800px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1920`
    .left-content {
      width: 516px;
    }
    .right-content {
      width: 800px;
    }
  `}
`

const LeftContent = styled.div`
  display: flex;
  transition: width ${ANI_DURATION}s;
  will-change: width;
`

const RightContent = styled.div`
  display: flex;
  transition: width ${ANI_DURATION}s;
  will-change: width;
`


export default function Portfolio() {
  const [currentWalletAddress] = useCurrentWalletAddress()
  return <PortfolioWrapper>
    <LeftContent>
    </LeftContent>
    <RightContent>
    </RightContent>
  </PortfolioWrapper>
}

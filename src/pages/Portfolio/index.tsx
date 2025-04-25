import { useCurrentWalletAddress } from 'store/portfolio/hooks'
import styled from 'styled-components'
import EvmWallet from './components/EvmWallet'
import SolWallet from './components/SolWallet'
import { isEvmAddress } from 'utils/url'
import { ANI_DURATION } from 'constants/index'
import { useShowRecentTransactions } from 'store/portfoliocache/hooks'
import RecentTransactions from './components/RecentTransactions'
const PortfolioWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  ${({ theme }) => theme.mediaMinWidth.minWidth1024`
    .left-content,
    .left-inner-content {
      width: 380px;
    }
    .right-content,
    .right-inner-content {
      width: 564px;
    }
    .right-content {
      margin-left: 32px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1280`
    .left-content,
    .left-inner-content {
      width: 380px;
    }
    .right-content,
    .right-inner-content {
      width: 800px;
    }
    .right-content {
      margin-left: 32px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1440`
    .left-content,
    .left-inner-content {
      width: 516px;
    }
    .right-content,
    .right-inner-content {
      width: 800px;
    }
    .right-content {
      margin-left: 42px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1920`
    .left-content,
    .left-inner-content {
      width: 516px;
    }
    .right-content,
    .right-inner-content {
      width: 800px;
    }
    .right-content {
      margin-left: 266px;
    }
  `}
`

const LeftContent = styled.div<{ $showRecentTransactions: boolean }>`
  display: flex;
  flex-shrink: 0;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  overflow: hidden;
  ${({ $showRecentTransactions }) => !$showRecentTransactions && `
    width: 0;
  `}
`

const RightContent = styled.div`
  display: flex;
  flex-shrink: 0;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  overflow: hidden;
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-shrink: 0;
`


export default function Portfolio() {
  const [showRecentTransactions] = useShowRecentTransactions()
  const [currentWalletAddress] = useCurrentWalletAddress()
  return <PortfolioWrapper>
    <LeftContent $showRecentTransactions={showRecentTransactions} className="left-content">
      <InnerContent className="left-inner-content">
        <RecentTransactions />
      </InnerContent>
    </LeftContent>
    <RightContent className="right-content">
      <InnerContent className="right-inner-content">
        
      </InnerContent>
    </RightContent>
  </PortfolioWrapper>
}

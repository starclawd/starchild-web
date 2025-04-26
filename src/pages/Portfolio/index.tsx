import { useCurrentWalletAddress } from 'store/portfolio/hooks'
import styled from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { useShowRecentTransactions } from 'store/portfoliocache/hooks'
import RecentTransactions from './components/RecentTransactions'
import Wallet from './components/Wallet'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'
const PortfolioWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  ${({ theme }) => theme.mediaMinWidth.minWidth1024`
    .left-content,
    .transaction-list-wrapper {
      width: 380px;
    }
    .right-content {
      width: 564px;
    }
    .right-content {
      margin-left: 32px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1280`
    .left-content,
    .transaction-list-wrapper {
      width: 380px;
    }
    .right-content {
      width: 800px;
    }
    .right-content {
      margin-left: 32px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1440`
    .left-content,
    .transaction-list-wrapper {
      width: 516px;
    }
    .right-content {
      width: 800px;
    }
    .right-content {
      margin-left: 42px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1920`
    .left-content,
    .transaction-list-wrapper {
      width: 516px;
    }
    .right-content {
      width: 800px;
    }
    .right-content {
      margin-left: 266px;
    }
  `}
`

const TransitionButton = styled.div`
  position: absolute;
  top: 32px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  gap: 8px;
  width: fit-content;
  height: 44px;
  padding: 0 18px;
  border-radius: 44px;
  border: 1px solid ${({ theme }) => theme.textL6};
  cursor: pointer;
  z-index: 1;
  .icon-chat-history {
    font-size: 24px;
    color: ${({ theme }) => theme.textL1};
  }
  span {
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
  }
`

const LeftContent = styled.div<{ $showRecentTransactions: boolean }>`
  display: flex;
  flex-shrink: 0;
  /* transition: width ${ANI_DURATION}s;
  will-change: width; */
  /* overflow: hidden; */
  ${({ $showRecentTransactions }) => !$showRecentTransactions && `
    width: auto !important;
  `}
`

const RightContent = styled.div`
  display: flex;
  flex-shrink: 0;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  overflow: hidden;
`

export default function Portfolio() {
  const [showRecentTransactions, setShowRecentTransactions] = useShowRecentTransactions()
  const [currentWalletAddress] = useCurrentWalletAddress()
  return <PortfolioWrapper>
    <TransitionButton onClick={() => setShowRecentTransactions(!showRecentTransactions)}>
      <IconBase className="icon-chat-history" />
      <span><Trans>Recent Transactions</Trans></span>
    </TransitionButton>
    <LeftContent $showRecentTransactions={showRecentTransactions} className="left-content">
      <RecentTransactions />
    </LeftContent>
    <RightContent className="right-content">
      <Wallet />
    </RightContent>
  </PortfolioWrapper>
}

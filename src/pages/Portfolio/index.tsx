import { useCurrentWalletAddress } from 'store/portfolio/hooks'
import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { useShowRecentTransactions } from 'store/portfoliocache/hooks'
import RecentTransactions from './components/RecentTransactions'
import Wallet from './components/Wallet'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'
const PortfolioWrapper = styled.div<{ $showRecentTransactions: boolean }>`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  padding-bottom: 20px;
  ${({ theme, $showRecentTransactions }) => theme.mediaMinWidth.minWidth1024`
    .transaction-list-wrapper {
      width: 360px;
    }
    .left-content {
      margin-right: 20px;
      flex-grow: 1;
      max-width: 438px;
      transition: all ${ANI_DURATION}s;
    }
    .right-content {
      width: 800px;
      max-width: 800px;
      min-width: 586px;
      flex-shrink: 1;
      transition: all 0.2s;
    }
    ${!$showRecentTransactions && css`
      .left-content {
        max-width: 190px;
      }
    `}
  `}
  ${({ theme, $showRecentTransactions }) => theme.mediaMinWidth.minWidth1280`
    justify-content: space-between;
    .transaction-list-wrapper {
      width: 438px;
    }
    .left-content {
      margin-right: 20px;
      flex-grow: 1;
      max-width: 438px;
    }
    .right-content {
      width: 800px;
      max-width: 800px;
      min-width: 586px;
      flex-shrink: 1;
    }
    ${!$showRecentTransactions && css`
      .left-content {
        max-width: 0;
      }
    `}
  `}
  ${({ theme, $showRecentTransactions }) => theme.mediaMinWidth.minWidth1440`
    .transaction-list-wrapper {
      width: 516px;
    }
    .left-content {
      margin-right: 20px;
      max-width: 516px;
    }
    .right-content {
      width: 800px;
    }
     ${!$showRecentTransactions && css`
      .left-content {
        max-width: 0;
      }
    `}
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1920`
  `}
`

const TransitionButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  white-space: nowrap;
  gap: 8px;
  width: fit-content;
  height: 44px;
  padding: 0 18px;
  border-radius: 44px;
  border: 1px solid ${({ theme }) => theme.textL6};
  cursor: pointer;
  z-index: 1;
  .icon-chat-switch {
    font-size: 24px;
    color: ${({ theme }) => theme.textL3};
  }
  span {
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL3};
  }
`

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 12px;
  width: auto;
  padding-top: 20px;
`

const RightContent = styled.div<{ $showRecentTransactions: boolean }>`
  display: flex;
  flex-shrink: 0;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  overflow: hidden;
  ${({ $showRecentTransactions }) => !$showRecentTransactions && css`
    margin-left: 0 !important;
  `}
`

const Placeholder = styled.div`
  width: 0px;
  height: 100%;
`

export default function Portfolio() {
  const [showRecentTransactions, setShowRecentTransactions] = useShowRecentTransactions()
  const [currentWalletAddress] = useCurrentWalletAddress()
  return <PortfolioWrapper $showRecentTransactions={showRecentTransactions}>
    <LeftContent className="left-content">
      <TransitionButton onClick={() => setShowRecentTransactions(!showRecentTransactions)}>
        <IconBase className="icon-chat-switch" />
        <span><Trans>Recent Transactions</Trans></span>
      </TransitionButton>
      <RecentTransactions />
    </LeftContent>
    <RightContent $showRecentTransactions={showRecentTransactions} className="right-content">
      <Wallet />
    </RightContent>
    <Placeholder />
  </PortfolioWrapper>
}

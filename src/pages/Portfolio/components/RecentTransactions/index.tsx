import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import TransactionItem from '../TransactionItem'
import TransactionDetail from '../TransactionDetail'
import Transition from 'components/TransitionWrapper'
import { useGetWalletHistory, useWalletHistory } from 'store/portfolio/hooks'
import { WalletHistoryDataType } from 'store/portfolio/portfolio.d'
import { Chain } from 'constants/chainInfo'

const RecentTransactionsWrapper = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  padding: 32px 0 20px;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 12px;
`

const TopContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: fit-content;
  height: 44px;
  padding: 0 18px;
  border-radius: 44px;
  border: 1px solid ${({ theme }) => theme.textL6};
  cursor: pointer;
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

const TransactionList = styled.div<{ $currentShowTx: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-x: hidden;
  width: 100%;
  flex: 1;
  padding: 20px;
  border-radius: 36px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  ${({ $currentShowTx }) => $currentShowTx && css`
    overflow: hidden;
  `}
`

export default memo(function RecentTransactions() {
  const [walletHistory] = useWalletHistory()
  const triggerGetWalletHistory = useGetWalletHistory()
  const [currentShowTxData, setCurrentShowTxData] = useState<WalletHistoryDataType | null>(null)
  const showTxDetail = useCallback((data: WalletHistoryDataType) => {
    setCurrentShowTxData(data)
  }, [])
  const hideTxDetail = useCallback(() => {
    setCurrentShowTxData(null)
  }, [])
  useEffect(() => {
    triggerGetWalletHistory({
      evmAddress: '0x59bB31474352724583bEB030210c7B96E9D0d8e9',
      limit: 10,
      chain: Chain.BASE,
    })
  }, [triggerGetWalletHistory])
  console.log('walletHistory', walletHistory)
  return <RecentTransactionsWrapper>
    <ContentWrapper>
      <TopContent>
        <IconBase className="icon-chat-history" />
        <span><Trans>Recent Transactions</Trans></span>
      </TopContent>
      <TransactionList $currentShowTx={!!currentShowTxData} className="scroll-style">
        {walletHistory.map((item, index) => (
          <TransactionItem
            key={index}
            data={item}
            onClick={showTxDetail}
          />
        ))}
        {currentShowTxData && <Transition 
          visible={!!currentShowTxData} 
          transitionType="transform" 
          direction="right"
        >
          <TransactionDetail hideTxDetail={hideTxDetail} data={currentShowTxData as WalletHistoryDataType} />
        </Transition>}
      </TransactionList>
    </ContentWrapper>
  </RecentTransactionsWrapper>
})

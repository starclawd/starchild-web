import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { memo, useCallback, useMemo, useState } from 'react'
import TransactionItem from '../TransactionItem'
import TransactionDetail from '../TransactionDetail'
import Transition from 'components/TransitionWrapper'

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

const TransactionList = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  width: 100%;
  flex: 1;
  padding: 20px;
  border-radius: 36px;
  border: 1px solid ${({ theme }) => theme.bgT30};
`

export default memo(function RecentTransactions() {
  const [currentShowTx, setCurrentShowTx] = useState('')
  const transactions = useMemo(() => {
    return [1]
  }, [])
  const showTxDetail = useCallback((tx: string) => {
    setCurrentShowTx(tx)
  }, [])
  const hideTxDetail = useCallback(() => {
    setCurrentShowTx('')
  }, [])
  return <RecentTransactionsWrapper>
    <ContentWrapper>
      <TopContent>
        <IconBase className="icon-chat-history" />
        <span><Trans>Recent Transactions</Trans></span>
      </TopContent>
      <TransactionList className="scroll-style">
        {transactions.map((item, index) => (
          <TransactionItem
            key={index}
            data={item}
            onClick={showTxDetail}
          />
        ))}
        <Transition 
          visible={!!currentShowTx} 
          transitionType="transform" 
          direction="right"
        >
          <TransactionDetail hideTxDetail={hideTxDetail} />
        </Transition>
      </TransactionList>
    </ContentWrapper>
  </RecentTransactionsWrapper>
})

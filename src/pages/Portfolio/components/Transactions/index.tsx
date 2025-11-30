import { Trans } from '@lingui/react/macro'
import NoData from 'components/NoData'
import { useMemo } from 'react'
import styled from 'styled-components'

const TransactionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.bgT30};
`

const Title = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.textL1};
`

const TransactionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const TransactionsItem = styled.div<{ $isDeposit: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: ${({ theme }) => theme.black800};
  border-left: 2px solid ${({ theme, $isDeposit }) => ($isDeposit ? theme.green100 : theme.red100)};
`

const LeftContent = styled.div<{ $isDeposit: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  span:first-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme, $isDeposit }) => ($isDeposit ? theme.green100 : theme.red100)};
  }
  span:last-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL2};
  }
`

const RightContent = styled.div<{ $isDeposit: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  span:first-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    text-align: right;
    color: ${({ theme, $isDeposit }) => ($isDeposit ? theme.green100 : theme.red100)};
  }
  span:last-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    text-align: right;
    color: ${({ theme }) => theme.textL4};
  }
`

export default function Transactions() {
  const transactionsList = useMemo(() => {
    return []
  }, [])
  return (
    <TransactionsWrapper>
      <Title>
        <Trans>History</Trans>
      </Title>
      <TransactionsList>
        {transactionsList.length > 0 ? (
          transactionsList.map((item) => {
            const isDeposit = false
            return (
              <TransactionsItem $isDeposit={isDeposit} key={item}>
                <LeftContent $isDeposit={isDeposit}>
                  <span>Deposit</span>
                  <span>2025-04-11 15:56:59</span>
                </LeftContent>
                <RightContent $isDeposit={isDeposit}>
                  <span>$100.00</span>
                  <span>2025-04-11 15:56:59</span>
                </RightContent>
              </TransactionsItem>
            )
          })
        ) : (
          <NoData />
        )}
      </TransactionsList>
    </TransactionsWrapper>
  )
}

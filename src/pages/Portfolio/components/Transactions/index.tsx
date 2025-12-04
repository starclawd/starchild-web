import { Trans } from '@lingui/react/macro'
import { useAppKitAccount } from '@reown/appkit/react'
import NoData from 'components/NoData'
import Pending from 'components/Pending'
import PullUpRefresh from 'components/PullUpRefresh'
import Tooltip from 'components/Tooltip'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTransactionHistory } from 'store/portfolio/hooks/useTransactionHistory'
import dayjs from 'dayjs'
import { VaultTransactionHistory } from 'api/vaults'
import { getStatusText, getTooltipContent } from 'constants/vaultTransaction'
import { useTheme } from 'store/themecache/hooks'

const TransactionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  height: 100%;
  overflow: hidden;
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
  flex: 1;
  overflow: hidden;
  .pull-up-refresh {
    height: 100%;
  }
  .pull-up-content {
    overflow-y: auto;
  }
  .pull-up-children {
    gap: 4px;
  }
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
  .pop-children {
    align-items: flex-end;
  }
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

function formatTime(timestamp: number) {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

function formatAmount(amount: number, isDeposit: boolean) {
  const sign = isDeposit ? '+' : '-'
  return `${sign}$${Math.abs(amount)}`
}

export default function Transactions() {
  const theme = useTheme()
  const { address } = useAppKitAccount()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { transactionHistoryList, isLoading, isLoadingMore, hasNextPage, loadFirstPage, loadNextPage, reset } =
    useTransactionHistory({ walletAddress: address || '' })

  // 当钱包地址变化时重新加载
  useEffect(() => {
    if (address) {
      reset()
      loadFirstPage()
    }
  }, [address, loadFirstPage, reset])

  // 上拉加载更多
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasNextPage) {
      setIsRefreshing(false)
      return
    }
    await loadNextPage()
    setIsRefreshing(false)
  }, [loadNextPage, isLoadingMore, hasNextPage])

  const renderItem = (item: VaultTransactionHistory, index: number) => {
    const isDeposit = item.type === 'deposit'
    const statusText = getStatusText(item)
    const tooltipContent = getTooltipContent(item)

    return (
      <TransactionsItem $isDeposit={isDeposit} key={`${item.created_time}-${index}`}>
        <LeftContent $isDeposit={isDeposit}>
          <span>{isDeposit ? <Trans>Deposit</Trans> : <Trans>Withdraw</Trans>}</span>
          <span>{formatTime(item.created_time)}</span>
        </LeftContent>
        <RightContent $isDeposit={isDeposit}>
          <span>{formatAmount(item.amount_change, isDeposit)}</span>
          {tooltipContent ? (
            <Tooltip placement='top' content={tooltipContent}>
              <span style={{ color: isDeposit ? theme.green100 : theme.red100 }}>{statusText}</span>
            </Tooltip>
          ) : (
            <span>{statusText}</span>
          )}
        </RightContent>
      </TransactionsItem>
    )
  }

  return (
    <TransactionsWrapper>
      <Title>
        <Trans>History</Trans>
      </Title>
      <TransactionsList>
        {isLoading ? (
          <Pending isFetching />
        ) : transactionHistoryList.length > 0 ? (
          <PullUpRefresh
            isRefreshing={isRefreshing}
            setIsRefreshing={setIsRefreshing}
            onRefresh={handleLoadMore}
            disabledPull={!hasNextPage || isLoadingMore}
            hasLoadMore={hasNextPage}
          >
            {transactionHistoryList.map(renderItem)}
          </PullUpRefresh>
        ) : (
          <NoData />
        )}
      </TransactionsList>
    </TransactionsWrapper>
  )
}

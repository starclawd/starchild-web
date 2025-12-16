import { Trans } from '@lingui/react/macro'
import { useAppKitAccount } from '@reown/appkit/react'
import NoData from 'components/NoData'
import Pending from 'components/Pending'
import PullUpRefresh from 'components/PullUpRefresh'
import Tooltip from 'components/Tooltip'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTransactionHistory } from 'store/myvault/hooks/useTransactionHistory'
import dayjs from 'dayjs'
import { VaultTransactionHistory } from 'api/vaults'
import { getStatusText, getTooltipContent } from 'constants/vaultTransaction'
import { useTheme } from 'store/themecache/hooks'
import { CHAIN_ID_TO_CHAIN } from 'constants/chainInfo'
import { getExplorerLink } from 'utils'
import { ANI_DURATION } from 'constants/index'
import useValidVaultWalletAddress from 'hooks/useValidVaultWalletAddress'
import Divider from 'components/Divider'

const TransactionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  min-height: 222px;
  max-height: 100%;
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
  flex: 1;
  overflow: hidden;
  .pull-up-refresh {
    height: 100%;
  }
  .pull-up-content {
    overflow-y: auto;
  }
  .pull-up-children {
    gap: 8px;
  }
`

const TransactionsItem = styled.div<{ $isDeposit: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 8px;
  background-color: ${({ theme }) => theme.black800};
  border-left: 3px solid ${({ theme, $isDeposit }) => ($isDeposit ? theme.green100 : theme.red100)};
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  border-radius: 4px;
  &:hover {
    opacity: 0.7;
  }
`

const TopContent = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL2};
`

const BottomContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
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
    color: ${({ theme }) => theme.textL4};
  }
`

const RightContent = styled.div<{ $status: string; $isDeposit: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  .pop-children {
    align-items: flex-end;
  }
  .status-text {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    text-align: right;
    color: ${({ theme, $status }) =>
      $status === 'prepending' || $status === 'pending' || $status === 'requested'
        ? theme.brand100
        : $status === 'available' || $status === 'processed' || $status === 'claimable' || $status === 'claimed'
          ? theme.green100
          : $status === 'locked'
            ? theme.textL3
            : $status === 'claimed'
              ? theme.green100
              : theme.textL3};
  }
  .amount-text {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    text-align: right;
    color: ${({ theme, $isDeposit }) => ($isDeposit ? theme.green100 : theme.red100)};
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
  const [isValidWallet] = useValidVaultWalletAddress()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { transactionHistoryList, isLoading, isLoadingMore, hasNextPage, loadFirstPage, loadNextPage, reset } =
    useTransactionHistory({ walletAddress: address && isValidWallet ? address : '' })

  // 当钱包地址变化且有效时重新加载
  useEffect(() => {
    if (address && isValidWallet) {
      reset()
      loadFirstPage()
    }
  }, [address, isValidWallet, loadFirstPage, reset])

  // 上拉加载更多
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasNextPage) {
      setIsRefreshing(false)
      return
    }
    await loadNextPage()
    setIsRefreshing(false)
  }, [loadNextPage, isLoadingMore, hasNextPage])

  const handleItemClick = useCallback((txnHash: string, chainId: string | number) => {
    if (!txnHash || !chainId) return
    const chain = CHAIN_ID_TO_CHAIN[Number(chainId)]
    if (!chain) return
    const explorerLink = getExplorerLink(chain, txnHash)
    window.open(explorerLink, '_blank')
  }, [])

  const renderItem = (item: VaultTransactionHistory, index: number) => {
    const isDeposit = item.type === 'deposit'
    const statusText = getStatusText(item)
    const tooltipContent = getTooltipContent(item)

    return (
      <TransactionsItem
        $isDeposit={isDeposit}
        key={`${item.created_time}-${index}`}
        onClick={() => handleItemClick(item.txn_hash, item.chain_id)}
      >
        <TopContent>
          <span>Upbit New Listing Sniper</span>
        </TopContent>
        <Divider height={1} paddingVertical={8} />
        <BottomContent>
          <LeftContent $isDeposit={isDeposit}>
            <span>{isDeposit ? <Trans>Deposit</Trans> : <Trans>Withdraw</Trans>}</span>
            <span>{formatTime(item.created_time)}</span>
          </LeftContent>
          <RightContent $status={item.status} $isDeposit={isDeposit}>
            {tooltipContent ? (
              <Tooltip placement='top' content={tooltipContent}>
                <span className='status-text'>{statusText}</span>
              </Tooltip>
            ) : (
              <span className='status-text'>{statusText}</span>
            )}
            <span className='amount-text'>{formatAmount(item.amount_change, isDeposit)}</span>
          </RightContent>
        </BottomContent>
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
          <Pending isNotButtonLoading />
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

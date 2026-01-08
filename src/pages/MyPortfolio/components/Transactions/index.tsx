import { Trans } from '@lingui/react/macro'
import { useAppKitAccount } from '@reown/appkit/react'
import NoData from 'components/NoData'
import Pending from 'components/Pending'
import PullUpRefresh from 'components/PullUpRefresh'
import Tooltip from 'components/Tooltip'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { IconBase } from 'components/Icons'
import { useSetCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { useAllStrategiesOverview } from 'store/vaults/hooks'

const TransactionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 20px;
  height: calc(100% - 146px);
  overflow: hidden;
`

const Title = styled.div`
  font-size: 26px;
  font-style: normal;
  font-weight: 400;
  line-height: 34px;
  color: ${({ theme }) => theme.black0};
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
    gap: 0;
  }
`

const TransactionsItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.black900};
  &:hover {
    opacity: 0.7;
  }
`
const TopContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  span:first-child {
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.black0};
  }
  span:last-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.black300};
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
            ? theme.black100
            : $status === 'claimed'
              ? theme.green100
              : theme.black200};
  }
  .amount-text {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    text-align: right;
    color: ${({ theme }) => theme.black0};
  }
`

const BottomContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 28px;
  padding: 0 8px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.black100};
  background-color: ${({ theme }) => theme.black800};
  .icon-arrow {
    transform: rotate(90deg);
    font-size: 18px;
    color: ${({ theme }) => theme.black200};
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
  const setCurrentRouter = useSetCurrentRouter()
  const [isValidWallet] = useValidVaultWalletAddress()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { allStrategies } = useAllStrategiesOverview()

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
    const strategyDetail = allStrategies.find((strategy) => strategy.vault_id === item.vault_id)
    const goVaultDetail = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setCurrentRouter(`${ROUTER.VAULT_DETAIL}?strategyId=${strategyDetail?.strategy_id || ''}`)
    }

    return (
      <TransactionsItem
        key={`${item.created_time}-${index}`}
        onClick={() => handleItemClick(item.txn_hash, item.chain_id)}
      >
        <TopContent>
          <LeftContent>
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
            <span className='amount-text'>
              {!isDeposit && !item.amount_change
                ? `-${item.shares_change} Shares`
                : formatAmount(item.amount_change, isDeposit)}
            </span>
          </RightContent>
        </TopContent>
        <BottomContent onClick={goVaultDetail}>
          <span>Upbit New Listing Sniper</span>
          <IconBase className='icon-arrow' />
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
            contentClassName='transparent-scroll-style'
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

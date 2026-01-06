import { memo, useMemo, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { useMyStrategies } from 'store/mystrategy/hooks/useMyStrategies'
import { useMyStrategyTabKey } from 'store/mystrategycache/hooks'
import { STRATEGY_TAB_KEY } from 'store/mystrategycache/mystrategycache'
import Pending from 'components/Pending'
import NoData from 'components/NoData'
import Table, { ColumnDef } from 'components/Table'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy.d'
import { StrategiesOverviewStrategy } from 'api/strategy'
import { useModalOpen, useCurrentRouter } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import PauseStrategyModal from './components/PauseStrategyModal'
import DelistStrategyModal from './components/DelistStrategyModal'
import DeleteStrategyModal from './components/DeleteStrategyModal'
import { useTheme } from 'store/themecache/hooks'
import { isInvalidValue, toFix } from 'utils/calc'
import { formatNumber, formatPercent, formatKMBNumber } from 'utils/format'
import { ROUTER } from 'pages/router'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import {
  useDeleteStrategyModalToggle,
  useDelistStrategyModalToggle,
  useDeployModalToggle,
  usePauseStrategyModalToggle,
} from 'store/application/hooks'
import { useCurrentStrategyId, useRestartStrategy } from 'store/mystrategy/hooks/useMyStrategies'
import { useAppKitAccount } from '@reown/appkit/react'
import ShinyButton from 'components/ShinyButton'
import { useVaultsData } from 'store/vaults/hooks'

const MyStrategiesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const StrategiesListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 135px;
`

const StrategyName = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const NameText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
`

const CellValue = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
`

const StatusWrapper = styled.div<{ $status: STRATEGY_STATUS }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme, $status }) => ($status === STRATEGY_STATUS.DEPLOYED ? theme.brand100 : theme.black300)};
`

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
`

const ButtonAction = styled(ButtonBorder)`
  width: fit-content;
  padding: 0 12px;
  height: 24px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  border-radius: 0;
  color: ${({ theme }) => theme.black200};
`

const ButtonPrimary = styled(ButtonCommon)`
  width: fit-content;
  padding: 0 12px;
  height: 24px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  border-radius: 0;
  color: ${({ theme }) => theme.black1000};
`

const LaunchButton = styled(ButtonCommon)`
  width: 52px;
  height: 24px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  border-radius: 0;
`

const StyledTable = styled(Table)`
  table {
    table-layout: auto;
    min-width: 100%;
  }
  .table-header {
    background-color: transparent;
    border-bottom: 1px solid ${({ theme }) => theme.black800};
  }
  .table-header .header-container th {
    padding-left: 12px;
    padding-right: 12px;
    &:first-child {
      padding-left: 12px;
    }
    &:last-child {
      padding-right: 12px;
    }
  }
  .table-body tr {
    cursor: pointer;
    position: relative;
  }
  .table-body tr td {
    padding-left: 12px;
    padding-right: 12px;
    border-radius: 0;
    &:first-child {
      padding-left: 12px;
      border-radius: 0;
    }
    &:last-child {
      padding-right: 12px;
      border-radius: 0;
    }
  }
` as typeof Table

function Status({ status }: { status: STRATEGY_STATUS }) {
  const theme = useTheme()
  if (status === STRATEGY_STATUS.DEPLOYED) {
    return (
      <StatusWrapper $status={status}>
        <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14' fill='none'>
          <circle cx='7' cy='7' r='3' fill={theme.brand100} />
          <circle cx='7' cy='7' r='5' stroke='rgba(248, 70, 0, 0.08)' strokeWidth='4' />
        </svg>
        <Trans>Live</Trans>
      </StatusWrapper>
    )
  } else if (status === STRATEGY_STATUS.PAUSED) {
    return (
      <StatusWrapper $status={status}>
        <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14' fill='none'>
          <circle cx='7' cy='7' r='3' fill={theme.black300} />
          <circle cx='7' cy='7' r='5' stroke={theme.black800} strokeWidth='4' />
        </svg>
        <Trans>Suspended</Trans>
      </StatusWrapper>
    )
  } else if (status === STRATEGY_STATUS.DELISTED || status === STRATEGY_STATUS.ARCHIVED) {
    return (
      <StatusWrapper $status={status}>
        <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14' fill='none'>
          <circle cx='7' cy='7' r='3' fill={theme.black300} />
          <circle cx='7' cy='7' r='5' stroke={theme.black800} strokeWidth='4' />
        </svg>
        <Trans>Terminated</Trans>
      </StatusWrapper>
    )
  }
  return null
}

function ActionButtons({ strategy }: { strategy: StrategiesOverviewStrategy }) {
  const { status, strategy_id } = strategy
  const { address } = useAppKitAccount()
  const [isLoading, setIsLoading] = useState(false)
  const { refetch: refetchMyStrategies } = useMyStrategies()
  const [, setCurrentStrategyId] = useCurrentStrategyId()
  const triggerRestartStrategy = useRestartStrategy()
  const toggleDelistStrategyModal = useDelistStrategyModalToggle()
  const toggleDeleteStrategyModal = useDeleteStrategyModalToggle()
  const togglePauseStrategyModal = usePauseStrategyModalToggle()
  const toggleDeployModal = useDeployModalToggle()
  const [, setCurrentRouter] = useCurrentRouter()

  const isReleased = useMemo(() => {
    return status === STRATEGY_STATUS.DEPLOYED || status === STRATEGY_STATUS.PAUSED
  }, [status])
  const isUnreleased = useMemo(() => {
    return (
      status === STRATEGY_STATUS.DRAFT || status === STRATEGY_STATUS.DRAFT_READY || status === STRATEGY_STATUS.DEPLOYING
    )
  }, [status])
  const isDraftReady = useMemo(() => {
    return status === STRATEGY_STATUS.DRAFT_READY || status === STRATEGY_STATUS.DEPLOYING
  }, [status])
  const isDelisted = useMemo(() => {
    return status === STRATEGY_STATUS.DELISTED || status === STRATEGY_STATUS.ARCHIVED
  }, [status])

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setCurrentRouter(`${ROUTER.CREATE_STRATEGY}?strategyId=${strategy_id}`)
    },
    [strategy_id, setCurrentRouter],
  )

  const handleDelist = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setCurrentStrategyId(strategy_id)
      toggleDelistStrategyModal()
    },
    [toggleDelistStrategyModal, setCurrentStrategyId, strategy_id],
  )

  const handlePause = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setCurrentStrategyId(strategy_id)
      togglePauseStrategyModal()
    },
    [togglePauseStrategyModal, setCurrentStrategyId, strategy_id],
  )

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setCurrentStrategyId(strategy_id)
      toggleDeleteStrategyModal()
    },
    [toggleDeleteStrategyModal, setCurrentStrategyId, strategy_id],
  )

  const handleDeploy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      toggleDeployModal(strategy_id)
    },
    [toggleDeployModal, strategy_id],
  )

  const handleRestart = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      if (isLoading) return
      try {
        if (address && strategy_id) {
          setIsLoading(true)
          const data = await triggerRestartStrategy({ strategyId: strategy_id, walletId: address })
          if ((data as any)?.data?.status === 'success') {
            await refetchMyStrategies()
          }
          setIsLoading(false)
          return data
        }
      } catch (error) {
        setIsLoading(false)
        return error
      }
    },
    [strategy_id, address, refetchMyStrategies, triggerRestartStrategy, isLoading],
  )

  if (isReleased) {
    return (
      <ButtonsWrapper>
        <ButtonAction onClick={handleEdit}>
          <Trans>Edit</Trans>
        </ButtonAction>
        <ButtonAction onClick={handleDelist}>
          <Trans>Delist</Trans>
        </ButtonAction>
        {status === STRATEGY_STATUS.DEPLOYED ? (
          <ButtonAction onClick={handlePause}>
            <Trans>Pause</Trans>
          </ButtonAction>
        ) : (
          <ButtonPrimary onClick={handleRestart}>{isLoading ? <Pending /> : <Trans>Restart</Trans>}</ButtonPrimary>
        )}
      </ButtonsWrapper>
    )
  } else if (isUnreleased) {
    return (
      <ButtonsWrapper>
        <ButtonAction onClick={handleEdit}>
          <Trans>Edit</Trans>
        </ButtonAction>
        <ButtonAction onClick={handleDelete}>
          <Trans>Delete</Trans>
        </ButtonAction>
        {isDraftReady && (
          <LaunchButton onClick={handleDeploy}>
            <Trans>Launch</Trans>
          </LaunchButton>
        )}
      </ButtonsWrapper>
    )
  } else if (isDelisted) {
    return (
      <ButtonsWrapper>
        <ButtonAction onClick={handleEdit}>
          <Trans>Edit</Trans>
        </ButtonAction>
      </ButtonsWrapper>
    )
  }
  return null
}

export default memo(function MyStrategies() {
  const theme = useTheme()
  const { myStrategies, isLoadingMyStrategies } = useMyStrategies()
  const { allVaults } = useVaultsData()
  const [strategyTabKey] = useMyStrategyTabKey()
  const [, setCurrentRouter] = useCurrentRouter()
  const pauseStrategyModalOpen = useModalOpen(ApplicationModal.PAUSE_STRATEGY_MODAL)
  const deleteStrategyModalOpen = useModalOpen(ApplicationModal.DELETE_STRATEGY_MODAL)
  const delistStrategyModalOpen = useModalOpen(ApplicationModal.DELIST_STRATEGY_MODAL)

  // 过滤策略的工具函数
  const filterStrategiesByTab = useCallback((strategies: StrategiesOverviewStrategy[], tabKey: STRATEGY_TAB_KEY) => {
    switch (tabKey) {
      case STRATEGY_TAB_KEY.LAUNCHED:
        return strategies.filter(
          (strategy) => strategy.status === STRATEGY_STATUS.DEPLOYED || strategy.status === STRATEGY_STATUS.PAUSED,
        )
      case STRATEGY_TAB_KEY.DRAFT:
        return strategies.filter(
          (strategy) =>
            strategy.status === STRATEGY_STATUS.DRAFT ||
            strategy.status === STRATEGY_STATUS.DRAFT_READY ||
            strategy.status === STRATEGY_STATUS.DEPLOYING,
        )
      case STRATEGY_TAB_KEY.ARCHIVED:
        return strategies.filter(
          (strategy) => strategy.status === STRATEGY_STATUS.DELISTED || strategy.status === STRATEGY_STATUS.ARCHIVED,
        )
      default:
        return strategies
    }
  }, [])

  const filteredStrategies = useMemo(
    () => filterStrategiesByTab(myStrategies, strategyTabKey),
    [filterStrategiesByTab, myStrategies, strategyTabKey],
  )

  const getVaultInfo = useCallback(
    (vaultId: string) => {
      return allVaults.find((vault) => vault.vault_id === vaultId)
    },
    [allVaults],
  )

  const handleRowClick = useCallback(
    (strategy: StrategiesOverviewStrategy) => {
      setCurrentRouter(`${ROUTER.CREATE_STRATEGY}?strategyId=${strategy.strategy_id}`)
    },
    [setCurrentRouter],
  )

  const columns: ColumnDef<StrategiesOverviewStrategy>[] = useMemo(
    () => [
      {
        key: 'name',
        title: <Trans>Name</Trans>,
        render: (record) => (
          <StrategyName>
            <NameText>{record.strategy_name}</NameText>
            <Status status={record.status} />
          </StrategyName>
        ),
      },
      {
        key: 'equity',
        title: <Trans>Equity</Trans>,
        render: (record) => <CellValue>{formatNumber(toFix(record.end_balance, 0), { showDollar: true })}</CellValue>,
      },
      {
        key: 'allTimeApr',
        title: <Trans>All-time APR</Trans>,
        render: (record) => {
          const isPositive = Number(record.all_time_apr) > 0
          const isNegative = Number(record.all_time_apr) < 0
          return (
            <CellValue
              style={{
                color: isPositive ? theme.green100 : isNegative ? theme.red100 : theme.black0,
              }}
            >
              {isInvalidValue(record.all_time_apr) ? '--' : formatPercent({ value: record.all_time_apr })}
            </CellValue>
          )
        },
      },
      {
        key: 'pnl',
        title: <Trans>Total PnL</Trans>,
        render: (record) => {
          const isPositive = Number(record.pnl) > 0
          const isNegative = Number(record.pnl) < 0
          return (
            <CellValue
              style={{
                color: isPositive ? theme.green100 : isNegative ? theme.red100 : theme.black0,
              }}
            >
              {isPositive ? '+' : isNegative ? '-' : ''}${formatNumber(toFix(Math.abs(record.pnl || 0), 2))}
            </CellValue>
          )
        },
      },
      {
        key: 'age',
        title: <Trans>Age(days)</Trans>,
        render: (record) => <CellValue>{record.age_days}</CellValue>,
      },
      {
        key: 'vaultTvl',
        title: <Trans>Vault TVL</Trans>,
        render: (record) => {
          const vaultInfo = getVaultInfo(record.vault_id)
          return (
            <CellValue>{vaultInfo ? formatKMBNumber(toFix(vaultInfo.tvl, 2), 2, { showDollar: true }) : '-'}</CellValue>
          )
        },
      },
      {
        key: 'depositors',
        title: <Trans>Depositors</Trans>,
        render: (record) => {
          const vaultInfo = getVaultInfo(record.vault_id)
          return <CellValue>{vaultInfo?.lp_counts ?? '-'}</CellValue>
        },
      },
      {
        key: 'commission',
        title: <Trans>Commission</Trans>,
        render: (record) => {
          const vaultInfo = getVaultInfo(record.vault_id)
          // Commission is calculated based on performance fee rate and pnl
          const commission = vaultInfo && record.pnl > 0 ? record.pnl * (vaultInfo.performance_fee_rate || 0) : 0
          return (
            <CellValue style={{ color: theme.green100 }}>
              {vaultInfo ? formatKMBNumber(toFix(commission, 2), 2, { showDollar: true }) : '-'}
            </CellValue>
          )
        },
      },
      {
        key: 'actions',
        title: '',
        align: 'right',
        render: (record) => <ActionButtons strategy={record} />,
      },
    ],
    [theme, getVaultInfo],
  )

  return (
    <MyStrategiesWrapper>
      <StrategiesListWrapper>
        {isLoadingMyStrategies ? (
          <Pending isNotButtonLoading />
        ) : filteredStrategies.length > 0 ? (
          <StyledTable
            data={filteredStrategies}
            columns={columns}
            headerHeight={38}
            headerBodyGap={0}
            rowGap={0}
            rowHeight={60}
            onRowClick={handleRowClick}
          />
        ) : (
          <NoData />
        )}
      </StrategiesListWrapper>
      {pauseStrategyModalOpen && <PauseStrategyModal />}
      {delistStrategyModalOpen && <DelistStrategyModal />}
      {deleteStrategyModalOpen && <DeleteStrategyModal />}
    </MyStrategiesWrapper>
  )
})

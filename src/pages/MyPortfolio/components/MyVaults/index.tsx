import { Trans } from '@lingui/react/macro'
import { VaultInfo } from 'api/vaults'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import Pending from 'components/Pending'
import Table, { ColumnDef } from 'components/Table'
import { ROUTER } from 'pages/router'
import { useCallback, useMemo } from 'react'
import { useAppKitNetwork } from '@reown/appkit/react'
import { useVaultLpInfoList } from 'store/myvault/hooks/useVaultLpInfo'
import { useVaultsData } from 'store/vaults/hooks'
import styled from 'styled-components'
import NoDataWrapper from './components/NoDataWrapper'
import NoConnected from './components/NoConnected'
import useValidVaultWalletAddress from 'hooks/useValidVaultWalletAddress'
import { useCurrentRouter, useDepositAndWithdrawModalToggle } from 'store/application/hooks'
import { useAllStrategiesOverview, useCurrentDepositAndWithdrawVault } from 'store/vaults/hooks'
import { useDepositAndWithdrawTabIndex } from 'store/vaultsdetail/hooks/useDepositAndWithdraw'
import { useTheme } from 'store/themecache/hooks'
import { toFix } from 'utils/calc'
import { formatKMBNumber, formatPercent } from 'utils/format'
import { CHAIN_ID_TO_CHAIN, CHAIN_INFO } from 'constants/chainInfo'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy'

const MyVaultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const VaultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 135px;
`

const VaultName = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textDark98};
`

const CellValue = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
`

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
`

const ButtonWithdraw = styled(ButtonBorder)`
  width: fit-content;
  padding: 0 12px;
  height: 24px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  border-radius: 0;
  color: ${({ theme }) => theme.textL3};
`

const ButtonDeposit = styled(ButtonCommon)`
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

const StyledTable = styled(Table)`
  table {
    table-layout: auto;
    min-width: 100%;
  }
  .table-header {
    background-color: transparent;
    border-bottom: 1px solid ${({ theme }) => theme.bgT20};
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
    &::after {
      content: '';
      position: absolute;
      left: 12px;
      right: 12px;
      bottom: 0;
      height: 1px;
      background-color: ${({ theme }) => theme.bgT20};
    }
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

export default function MyVaults() {
  const theme = useTheme()
  const { chainId, switchNetwork } = useAppKitNetwork()
  const [isValidWallet, address] = useValidVaultWalletAddress()
  const { allVaults, isLoadingVaults } = useVaultsData()
  const walletAddress = address && isValidWallet ? address : ''
  const { vaultLpInfoList, isLoadingVaultLpInfoList } = useVaultLpInfoList({
    walletAddress,
  })
  const [allStrategies] = useAllStrategiesOverview()
  const [, setCurrentRouter] = useCurrentRouter()
  const [, setDepositAndWithdrawTabIndex] = useDepositAndWithdrawTabIndex()
  const [, setCurrentDepositAndWithdrawVault] = useCurrentDepositAndWithdrawVault()
  const toggleDepositAndWithdrawModal = useDepositAndWithdrawModalToggle()

  const vaultsList = useMemo(() => {
    return allVaults.filter((item) => vaultLpInfoList.some((vaultLpInfo) => vaultLpInfo.vault_id === item.vault_id))
  }, [allVaults, vaultLpInfoList])

  const getStrategyDetail = useCallback(
    (vaultId: string) => {
      return allStrategies.find((strategy) => strategy.vaultId === vaultId)?.raw
    },
    [allStrategies],
  )

  const isDepositDisabled = useCallback(
    (vaultId: string) => {
      const strategyDetail = getStrategyDetail(vaultId)
      return (
        strategyDetail?.status === STRATEGY_STATUS.ARCHIVED ||
        strategyDetail?.status === STRATEGY_STATUS.DELISTED ||
        strategyDetail?.status === STRATEGY_STATUS.PAUSED
      )
    },
    [getStrategyDetail],
  )

  const isChainSupported = useCallback(
    (supportedChains: VaultInfo['supported_chains']) => {
      if (!chainId || !supportedChains || supportedChains.length === 0) return true
      return supportedChains.some((chain) => String(chain.chain_id) === String(chainId))
    },
    [chainId],
  )

  const handleViewVault = useCallback(
    (item: VaultInfo) => {
      const strategyDetail = getStrategyDetail(item.vault_id)
      setCurrentRouter(`${ROUTER.VAULT_DETAIL}?strategyId=${strategyDetail?.strategy_id}`)
    },
    [setCurrentRouter, getStrategyDetail],
  )

  const handleDeposit = useCallback(
    (e: React.MouseEvent, item: VaultInfo) => {
      e.stopPropagation()
      if (isDepositDisabled(item.vault_id)) return
      setDepositAndWithdrawTabIndex(0)
      setCurrentDepositAndWithdrawVault(item)
      toggleDepositAndWithdrawModal()
    },
    [
      setCurrentDepositAndWithdrawVault,
      setDepositAndWithdrawTabIndex,
      toggleDepositAndWithdrawModal,
      isDepositDisabled,
    ],
  )

  const handleWithdraw = useCallback(
    (e: React.MouseEvent, item: VaultInfo) => {
      e.stopPropagation()
      setDepositAndWithdrawTabIndex(1)
      setCurrentDepositAndWithdrawVault(item)
      toggleDepositAndWithdrawModal()
    },
    [setCurrentDepositAndWithdrawVault, setDepositAndWithdrawTabIndex, toggleDepositAndWithdrawModal],
  )

  const handleSwitchNetwork = useCallback(
    (e: React.MouseEvent, supportedChains: VaultInfo['supported_chains']) => {
      e.stopPropagation()
      if (!supportedChains || supportedChains.length === 0) return
      const targetChainId = Number(supportedChains[0].chain_id)
      const chainKey = CHAIN_ID_TO_CHAIN[targetChainId]
      if (chainKey && CHAIN_INFO[chainKey]) {
        switchNetwork(CHAIN_INFO[chainKey].appKitNetwork)
      }
    },
    [switchNetwork],
  )

  const columns: ColumnDef<VaultInfo>[] = useMemo(
    () => [
      {
        key: 'name',
        title: <Trans>Name</Trans>,
        render: (record) => <VaultName>{record.vault_name}</VaultName>,
      },
      {
        key: 'tvl',
        title: <Trans>TVL</Trans>,
        render: (record) => <CellValue>{formatKMBNumber(toFix(record.tvl, 2), 2, { showDollar: true })}</CellValue>,
      },
      {
        key: 'allTimeApr',
        title: <Trans>All time APR</Trans>,
        render: (record) => {
          const isPositive = Number(record.lifetime_apy) > 0
          const isNegative = Number(record.lifetime_apy) < 0
          return (
            <CellValue
              style={{
                color: isPositive ? theme.green100 : isNegative ? theme.red100 : theme.textL1,
              }}
            >
              {formatPercent({ value: record.lifetime_apy })}
            </CellValue>
          )
        },
      },
      {
        key: 'pnl',
        title: <Trans>PnL</Trans>,
        render: (record) => {
          const isPositive = Number(record.vault_lifetime_net_pnl) > 0
          const isNegative = Number(record.vault_lifetime_net_pnl) < 0
          return (
            <CellValue
              style={{
                color: isPositive ? theme.green100 : isNegative ? theme.red100 : theme.textL1,
              }}
            >
              {isPositive ? '+' : isNegative ? '-' : ''}$
              {formatKMBNumber(toFix(Math.abs(record.vault_lifetime_net_pnl), 2))}
            </CellValue>
          )
        },
      },
      {
        key: 'age',
        title: <Trans>Age(days)</Trans>,
        render: (record) => {
          const gapTime = Date.now() - record.vault_start_time
          const days = Math.floor(gapTime / (1000 * 60 * 60 * 24))
          return <CellValue>{days}</CellValue>
        },
      },
      {
        key: 'actions',
        title: '',
        align: 'right',
        render: (record) => {
          const chainSupported = isChainSupported(record.supported_chains)
          const depositDisabled = isDepositDisabled(record.vault_id)

          if (!chainSupported) {
            return (
              <ButtonsWrapper>
                <ButtonDeposit onClick={(e) => handleSwitchNetwork(e, record.supported_chains)}>
                  <Trans>Switch Network</Trans>
                </ButtonDeposit>
              </ButtonsWrapper>
            )
          }

          return (
            <ButtonsWrapper>
              <ButtonWithdraw onClick={(e) => handleWithdraw(e, record)}>
                <Trans>Withdraw</Trans>
              </ButtonWithdraw>
              <ButtonDeposit $disabled={depositDisabled} onClick={(e) => handleDeposit(e, record)}>
                <Trans>Deposit</Trans>
              </ButtonDeposit>
            </ButtonsWrapper>
          )
        },
      },
    ],
    [theme, isChainSupported, isDepositDisabled, handleDeposit, handleWithdraw, handleSwitchNetwork],
  )

  return (
    <MyVaultsWrapper>
      <VaultsList>
        {!address ? (
          <NoConnected />
        ) : isLoadingVaults || isLoadingVaultLpInfoList ? (
          <Pending isNotButtonLoading />
        ) : vaultsList.length > 0 ? (
          <StyledTable
            data={vaultsList}
            columns={columns}
            headerHeight={38}
            headerBodyGap={0}
            rowGap={0}
            rowHeight={48}
            onRowClick={handleViewVault}
          />
        ) : (
          <NoDataWrapper />
        )}
      </VaultsList>
    </MyVaultsWrapper>
  )
}

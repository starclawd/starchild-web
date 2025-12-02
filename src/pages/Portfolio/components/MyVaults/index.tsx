import { Trans } from '@lingui/react/macro'
import { useAppKitAccount } from '@reown/appkit/react'
import { VaultInfo } from 'api/vaults'
import { ButtonBorder } from 'components/Button'
import { IconBase } from 'components/Icons'
import NoData from 'components/NoData'
import Pending from 'components/Pending'
import { ANI_DURATION } from 'constants/index'
import { ROUTER } from 'pages/router'
import { useCallback, useMemo } from 'react'
import { useCurrentRouter, useDepositAndWithdrawModalToggle } from 'store/application/hooks'
import { useFetchVaultLpInfoList, useVaultLpInfoList } from 'store/portfolio/hooks'
import { useAllVaults, useCurrentDepositAndWithdrawVault, useVaultsData } from 'store/vaults/hooks'
import { useDepositAndWithdrawTabIndex } from 'store/vaultsdetail/hooks/useDepositAndWithdraw'
import styled from 'styled-components'
import { div, toFix } from 'utils/calc'
import { formatDuration, formatNumber, formatPercent } from 'utils/format'

const MyVaultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Title = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
`

const VaultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const VaultsItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
`

const ItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 16px;
  border-radius: 4px 4px 0 0;
  background-color: ${({ theme }) => theme.black700};
`

const TopLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  span:first-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textDark98};
  }
  span:last-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textDark54};
  }
`

const TopRight = styled.div<{ $isPositive: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  > span:first-child {
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    text-align: right;
    color: ${({ theme }) => theme.textL2};
  }
  > span:last-child {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    text-align: right;
    span:first-child {
      color: ${({ theme, $isPositive }) => ($isPositive ? theme.green100 : theme.red100)};
    }
    span:last-child {
      color: ${({ theme, $isPositive }) => ($isPositive ? theme.green200 : theme.red200)};
    }
  }
`

const ItemBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 26px;
  padding: 0 12px;
  border-radius: 0 0 4px 4px;
  background-color: ${({ theme }) => theme.black800};
`

const BottomLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  .icon-vault-period {
    font-size: 14px;
    color: ${({ theme }) => theme.textL4};
  }
  span {
    font-size: 11px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    color: ${({ theme }) => theme.textL2};
  }
`

const BottomRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  span {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
    cursor: pointer;
    transition: all ${ANI_DURATION}s;
    &:hover {
      opacity: 0.7;
    }
  }
  span:first-child {
    color: ${({ theme }) => theme.textL2};
  }
  span:last-child {
    color: ${({ theme }) => theme.brand100};
  }
`

const NoDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4px;
  .no-data-wrapper {
    min-height: unset;
    height: auto;
  }
  .no-data-des {
    margin-top: 4px;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.textL1};
  }
`

const ViewAllValut = styled(ButtonBorder)`
  width: fit-content;
  height: 32px;
  margin-top: 16px;
  padding: 8px 12px;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.textL2};
`

export default function MyVaults() {
  const { address: walletAddress } = useAppKitAccount()
  const { isLoadingVaults } = useVaultsData()
  const [, setCurrentRouter] = useCurrentRouter()
  const { isLoading: isLoadingVaultLpInfoList } = useFetchVaultLpInfoList({ walletAddress: walletAddress || '' })
  const [vaultLpInfoList] = useVaultLpInfoList()
  const [, setDepositAndWithdrawTabIndex] = useDepositAndWithdrawTabIndex()
  const [, setCurrentDepositAndWithdrawVault] = useCurrentDepositAndWithdrawVault()
  const toggleDepositAndWithdrawModal = useDepositAndWithdrawModalToggle()
  const allVaults = useAllVaults()
  const valutsList = useMemo(() => {
    return allVaults.filter((item) => vaultLpInfoList.some((vaultLpInfo) => vaultLpInfo.vault_id === item.vault_id))
  }, [allVaults, vaultLpInfoList])

  const showDepositAndWithdrawModal = useCallback(
    (index: number, vaultInfo: VaultInfo) => {
      return (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        setDepositAndWithdrawTabIndex(index)
        setCurrentDepositAndWithdrawVault(vaultInfo)
        toggleDepositAndWithdrawModal()
      }
    },
    [setCurrentDepositAndWithdrawVault, setDepositAndWithdrawTabIndex, toggleDepositAndWithdrawModal],
  )
  const handleViewVault = useCallback(
    (vaultId: string) => {
      return () => {
        setCurrentRouter(`${ROUTER.VAULT_DETAIL}?vaultId=${vaultId}`)
      }
    },
    [setCurrentRouter],
  )
  return (
    <MyVaultsWrapper>
      <Title>
        <Trans>My vaults</Trans>
      </Title>
      <VaultsList>
        {isLoadingVaults || isLoadingVaultLpInfoList ? (
          <Pending isFetching />
        ) : valutsList.length > 0 ? (
          valutsList.map((item) => {
            const { vault_name, vault_id, sp_name, vault_start_time } = item
            const vaultLpInfo = vaultLpInfoList.find((vaultLpInfo) => vaultLpInfo.vault_id === vault_id)
            const balance = formatNumber(toFix(vaultLpInfo?.lp_tvl || 0, 2))
            const potentialPnl = vaultLpInfo?.potential_pnl || 0
            const pnlRate = div(vaultLpInfo?.potential_pnl || 0, vaultLpInfo?.lp_tvl || 0)
            const gapTime = Date.now() - vault_start_time
            const isPositive = Number(potentialPnl) > 0
            return (
              <VaultsItem key={vault_id} onClick={handleViewVault(vault_id)}>
                <ItemTop>
                  <TopLeft>
                    <span>{vault_name}</span>
                    <span>{sp_name}</span>
                  </TopLeft>
                  <TopRight $isPositive={isPositive}>
                    <span>${balance}</span>
                    <span>
                      <span>
                        {isPositive ? '+' : '-'}${formatNumber(Math.abs(potentialPnl))}
                      </span>
                      <span>({formatPercent({ value: pnlRate })})</span>
                    </span>
                  </TopRight>
                </ItemTop>
                <ItemBottom>
                  <BottomLeft>
                    <IconBase className='icon-vault-period' />
                    <span>{formatDuration(gapTime)}</span>
                  </BottomLeft>
                  <BottomRight>
                    <span onClick={showDepositAndWithdrawModal(1, item)}>
                      <Trans>Withdraw</Trans>
                    </span>
                    <span onClick={showDepositAndWithdrawModal(0, item)}>
                      <Trans>Deposit</Trans>
                    </span>
                  </BottomRight>
                </ItemBottom>
              </VaultsItem>
            )
          })
        ) : (
          <NoDataWrapper>
            <NoData text={<Trans>Your vaults are empty.</Trans>} />
            <span className='no-data-des'>
              <Trans>Explore all strategies and activate your first one.</Trans>
            </span>
            <ViewAllValut>
              <Trans>View all vaults</Trans>
            </ViewAllValut>
          </NoDataWrapper>
        )}
      </VaultsList>
    </MyVaultsWrapper>
  )
}

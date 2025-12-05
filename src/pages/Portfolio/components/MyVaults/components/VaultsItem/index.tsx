import { Trans } from '@lingui/react/macro'
import { VaultInfo } from 'api/vaults'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { ROUTER } from 'pages/router'
import { useCallback, useMemo } from 'react'
import { useCurrentRouter, useDepositAndWithdrawModalToggle } from 'store/application/hooks'
import { useVaultLpInfoList } from 'store/portfolio/hooks/useVaultLpInfo'
import { useCurrentDepositAndWithdrawVault } from 'store/vaults/hooks'
import { useDepositAndWithdrawTabIndex } from 'store/vaultsdetail/hooks/useDepositAndWithdraw'
import styled from 'styled-components'
import { div, toFix } from 'utils/calc'
import { formatDuration, formatNumber, formatPercent } from 'utils/format'

const VaultsItemWrapper = styled.div`
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

interface VaultsItemProps {
  item: VaultInfo
  walletAddress: string
}

export default function VaultsItem({ item, walletAddress }: VaultsItemProps) {
  const [, setCurrentRouter] = useCurrentRouter()
  const { vaultLpInfoList } = useVaultLpInfoList({ walletAddress })
  const [, setDepositAndWithdrawTabIndex] = useDepositAndWithdrawTabIndex()
  const [, setCurrentDepositAndWithdrawVault] = useCurrentDepositAndWithdrawVault()
  const toggleDepositAndWithdrawModal = useDepositAndWithdrawModalToggle()

  const { vault_id, vault_name, sp_name, vault_start_time } = item

  const vaultLpInfo = useMemo(() => {
    return vaultLpInfoList.find((info) => info.vault_id === vault_id)
  }, [vaultLpInfoList, vault_id])

  const handleViewVault = useCallback(() => {
    setCurrentRouter(`${ROUTER.VAULT_DETAIL}?vaultId=${vault_id}`)
  }, [setCurrentRouter, vault_id])

  const handleDeposit = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      setDepositAndWithdrawTabIndex(0)
      setCurrentDepositAndWithdrawVault(item)
      toggleDepositAndWithdrawModal()
    },
    [setCurrentDepositAndWithdrawVault, setDepositAndWithdrawTabIndex, toggleDepositAndWithdrawModal, item],
  )

  const handleWithdraw = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      setDepositAndWithdrawTabIndex(1)
      setCurrentDepositAndWithdrawVault(item)
      toggleDepositAndWithdrawModal()
    },
    [setCurrentDepositAndWithdrawVault, setDepositAndWithdrawTabIndex, toggleDepositAndWithdrawModal, item],
  )

  const balance = formatNumber(toFix(vaultLpInfo?.lp_tvl || 0, 2))
  const potentialPnl = vaultLpInfo?.potential_pnl || 0
  const pnlRate = div(vaultLpInfo?.potential_pnl || 0, vaultLpInfo?.lp_tvl || 0)
  const gapTime = Date.now() - vault_start_time
  const isPositive = Number(potentialPnl) > 0

  return (
    <VaultsItemWrapper onClick={handleViewVault}>
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
          <span onClick={handleWithdraw}>
            <Trans>Withdraw</Trans>
          </span>
          <span onClick={handleDeposit}>
            <Trans>Deposit</Trans>
          </span>
        </BottomRight>
      </ItemBottom>
    </VaultsItemWrapper>
  )
}

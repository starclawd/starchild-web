import { Trans } from '@lingui/react/macro'
import { VaultInfo } from 'api/vaults'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import Divider from 'components/Divider'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { ROUTER } from 'pages/router'
import { useCallback, useMemo } from 'react'
import { useCurrentRouter, useDepositAndWithdrawModalToggle } from 'store/application/hooks'
import { useVaultLpInfoList } from 'store/portfolio/hooks/useVaultLpInfo'
import { useTheme } from 'store/themecache/hooks'
import { useCurrentDepositAndWithdrawVault } from 'store/vaults/hooks'
import { useDepositAndWithdrawTabIndex } from 'store/vaultsdetail/hooks/useDepositAndWithdraw'
import styled from 'styled-components'
import { div, toFix } from 'utils/calc'
import { formatDuration, formatKMBNumber, formatNumber, formatPercent } from 'utils/format'

const VaultsItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  height: 135px;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.bgT20};
  background: ${({ theme }) => theme.black800};
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  &:hover {
    opacity: 0.7;
  }
`

const ItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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
  gap: 8px;
`

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 116px;
  > span:first-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
  }
  > span:last-child {
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.textL1};
  }
  &:last-child {
    width: 80px;
    span:first-child {
      text-align: right;
    }
    span:last-child {
      text-align: right;
    }
  }
`

const ItemBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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
`

const ButtonWithdraw = styled(ButtonBorder)`
  width: fit-content;
  padding: 0 12px;
  height: 24px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
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
`

interface VaultsItemProps {
  item: VaultInfo
  walletAddress: string
}

export default function VaultsItem({ item, walletAddress }: VaultsItemProps) {
  const theme = useTheme()
  const [, setCurrentRouter] = useCurrentRouter()
  // const { vaultLpInfoList } = useVaultLpInfoList({ walletAddress })
  const [, setDepositAndWithdrawTabIndex] = useDepositAndWithdrawTabIndex()
  const [, setCurrentDepositAndWithdrawVault] = useCurrentDepositAndWithdrawVault()
  const toggleDepositAndWithdrawModal = useDepositAndWithdrawModalToggle()

  const { vault_id, vault_name, sp_name, vault_start_time, tvl, vault_lifetime_net_pnl, lifetime_apy } = item

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

  const gapTime = Date.now() - vault_start_time
  const isPositive = Number(vault_lifetime_net_pnl) >= 0

  const dataList = useMemo(() => {
    return [
      {
        key: 'TVL',
        text: <Trans>TVL</Trans>,
        value: `$${formatKMBNumber(toFix(tvl, 2))}`,
      },
      {
        key: ' Total PnL',
        text: <Trans>Total PnL</Trans>,
        value: (
          <span style={{ color: isPositive ? theme.green100 : theme.red100 }}>
            {isPositive ? '+' : '-'}${formatKMBNumber(Math.abs(toFix(vault_lifetime_net_pnl, 2)))}
          </span>
        ),
      },
      {
        key: 'All-time APY',
        text: <Trans>All-time APY</Trans>,
        value: (
          <span style={{ color: lifetime_apy >= 0 ? theme.green100 : theme.red100 }}>
            {formatPercent({ value: lifetime_apy })}
          </span>
        ),
      },
    ]
  }, [vault_lifetime_net_pnl, lifetime_apy, tvl, isPositive, theme])

  return (
    <VaultsItemWrapper onClick={handleViewVault}>
      <ItemTop>
        <TopLeft>
          <span>{vault_name}</span>
          <span>{sp_name}</span>
        </TopLeft>
        <TopRight $isPositive={isPositive}>
          {dataList.map((data) => {
            const { key, text, value } = data
            return (
              <ItemWrapper key={key}>
                <span>{text}</span>
                <span>{value}</span>
              </ItemWrapper>
            )
          })}
        </TopRight>
      </ItemTop>
      <Divider color={theme.bgT10} height={1} paddingVertical={12} />
      <ItemBottom>
        <BottomLeft>
          <IconBase className='icon-vault-period' />
          <span>{formatDuration(gapTime)}</span>
        </BottomLeft>
        <BottomRight>
          <ButtonWithdraw onClick={handleWithdraw}>
            <Trans>Withdraw</Trans>
          </ButtonWithdraw>
          <ButtonDeposit onClick={handleDeposit}>
            <Trans>Deposit</Trans>
          </ButtonDeposit>
        </BottomRight>
      </ItemBottom>
    </VaultsItemWrapper>
  )
}

import { Trans } from '@lingui/react/macro'
import { useMemo } from 'react'
import { ProtocolVault } from 'store/vaults/vaults'
import styled from 'styled-components'
import { toFix } from 'utils/calc'
import { formatNumber } from 'utils/format'

const VaultDataWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`

const VaultDataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  span:first-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  span:last-child {
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px;
    color: ${({ theme }) => theme.green100};
  }
  &:last-child {
    span:first-child {
      text-align: right;
      color: ${({ theme }) => theme.textL3};
    }
    span:last-child {
      text-align: right;
      color: ${({ theme }) => theme.textL2};
    }
  }
`

export default function VaultData({ vaultData }: { vaultData: ProtocolVault }) {
  const vaultDataList = useMemo(() => {
    return [
      {
        key: 'apr',
        text: <Trans>APR</Trans>,
        value: vaultData.allTimeApy,
      },
      {
        key: 'pnl',
        text: <Trans>PnL</Trans>,
        value: `$${formatNumber(toFix(vaultData.raw?.vault_lifetime_net_pnl || 0, 2))}`,
      },
      {
        key: 'maxDrawdown',
        text: <Trans>Max drawdown</Trans>,
        value: '--',
      },
    ]
  }, [vaultData])
  return (
    <VaultDataWrapper>
      {vaultDataList.map((item) => (
        <VaultDataItem key={item.key}>
          <span>{item.text}</span>
          <span>{item.value}</span>
        </VaultDataItem>
      ))}
    </VaultDataWrapper>
  )
}

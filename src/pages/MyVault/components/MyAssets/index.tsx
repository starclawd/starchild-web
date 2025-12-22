import { Trans } from '@lingui/react/macro'
import { useAppKitAccount } from '@reown/appkit/react'
import { ButtonBorder } from 'components/Button'
import { useEffect, useMemo } from 'react'
import { useTotalUserData } from 'store/myvault/hooks/useTotalUserData'
import { useFetchMyVaultStatsData } from 'store/vaults/hooks'
import styled from 'styled-components'
import { formatNumber, formatPercent } from 'utils/format'

const MyAssetsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
`

const TopContent = styled.div`
  display: flex;
  justify-content: space-between;
`

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  span:first-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textDark54};
  }
  span:last-child {
    font-size: 26px;
    font-style: normal;
    font-weight: 700;
    line-height: 34px;
    color: ${({ theme }) => theme.textL1};
  }
`

const FundVaultButton = styled(ButtonBorder)`
  width: fit-content;
  height: 32px;
  padding: 8px 16px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL1};
`

const BottomContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 12px;
  gap: 12px;
  background-color: ${({ theme }) => theme.black800};
`

const AccountItem = styled.div<{ value?: number | null; $isEmpty: boolean; $showSignColor?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  span:first-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
  }
  span:last-child {
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme, value, $isEmpty, $showSignColor = false }) => {
      if ($isEmpty || value === null || value === undefined) return theme.textL4
      if (!$showSignColor) return theme.textL1
      if (value === 0) return theme.textL1
      return value > 0 ? theme.green100 : theme.red100
    }};
  }
  &:last-child {
    span {
      text-align: right;
    }
  }
`

export default function MyAssets() {
  const { address } = useAppKitAccount()
  const { myVaultStats, fetchMyVaultStats } = useFetchMyVaultStatsData()
  const { totalUserData } = useTotalUserData({ walletAddress: address || '' })
  const AccountList = useMemo(() => {
    return [
      {
        key: 'Total PnL',
        text: <Trans>Total PnL</Trans>,
        displayValue: myVaultStats?.myAllTimePnL || '--',
        rawValue: myVaultStats?.raw?.total_vaults_lifetime_net_pnl,
        isEmpty: !myVaultStats?.myAllTimePnL,
        showSignColor: true,
      },
      {
        key: 'Total ROI',
        text: <Trans>Total ROI</Trans>,
        displayValue: totalUserData?.roi ? formatPercent({ value: totalUserData.roi }) : '--',
        rawValue: totalUserData?.roi,
        isEmpty: !totalUserData?.roi,
        showSignColor: true,
      },
      {
        key: 'Total APR',
        text: <Trans>Total APR</Trans>,
        displayValue: totalUserData?.apr ? formatPercent({ value: totalUserData.apr }) : '--',
        rawValue: totalUserData?.apr,
        isEmpty: !totalUserData?.apr,
        showSignColor: true,
      },
      {
        key: 'Amount (Vaults)',
        text: <Trans>Amount (Vaults)</Trans>,
        displayValue: myVaultStats?.vaultCount || '--',
        rawValue: myVaultStats?.raw?.total_involved_vaults_count,
        isEmpty: !myVaultStats?.vaultCount,
        showSignColor: false,
      },
    ]
  }, [myVaultStats, totalUserData])
  useEffect(() => {
    if (address) {
      fetchMyVaultStats()
    }
  }, [fetchMyVaultStats, address])
  return (
    <MyAssetsWrapper>
      <TopContent>
        <LeftContent>
          <span>
            <Trans>Total balance</Trans>
          </span>
          <span>{myVaultStats?.myTvl || '--'}</span>
        </LeftContent>
        {/* <FundVaultButton>
          <Trans>Fund vault performance</Trans>
        </FundVaultButton> */}
      </TopContent>
      <BottomContent>
        {AccountList.map((item) => (
          <AccountItem
            key={item.key}
            $isEmpty={item.isEmpty}
            value={typeof item.rawValue === 'number' ? item.rawValue : null}
            $showSignColor={item.showSignColor}
          >
            <span>{item.text}</span>
            <span>{item.displayValue}</span>
          </AccountItem>
        ))}
      </BottomContent>
    </MyAssetsWrapper>
  )
}

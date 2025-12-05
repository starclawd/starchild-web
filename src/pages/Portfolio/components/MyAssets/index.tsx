import { Trans } from '@lingui/react/macro'
import { useAppKitAccount } from '@reown/appkit/react'
import { ButtonBorder } from 'components/Button'
import { useEffect, useMemo } from 'react'
import { useTotalUserData } from 'store/portfolio/hooks/useTotalUserData'
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
  border-radius: 4px;
  gap: 12px;
  background-color: ${({ theme }) => theme.black800};
`

const AccountItem = styled.div<{ $isPositive: boolean }>`
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
    color: ${({ theme, $isPositive }) => ($isPositive ? theme.green100 : theme.red100)};
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
    const totalPnL = myVaultStats?.myAllTimePnL || 0
    const isPositive = Number(myVaultStats?.raw?.total_vaults_lifetime_net_pnl) >= 0
    return [
      {
        key: 'Total PnL',
        text: <Trans>Total PnL</Trans>,
        value: totalPnL,
        isPositive,
      },
      {
        key: 'Total ROI',
        text: <Trans>Total ROI</Trans>,
        value: totalUserData?.roi ? formatPercent({ value: totalUserData.roi }) : '--',
        isPositive,
      },
      {
        key: 'Total APR',
        text: <Trans>Total APR</Trans>,
        value: totalUserData?.apr ? formatPercent({ value: totalUserData.apr }) : '--',
        isPositive,
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
          <AccountItem key={item.key} $isPositive={item.isPositive}>
            <span>{item.text}</span>
            <span>{item.value}</span>
          </AccountItem>
        ))}
      </BottomContent>
    </MyAssetsWrapper>
  )
}

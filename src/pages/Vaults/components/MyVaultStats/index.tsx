import { memo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { useVaultOverviewData } from 'store/vaults/hooks/useVaultData'
import Pending from 'components/Pending'

const MyStatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bgL0};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: 12px;
  padding: 24px;
`

const MyStatsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

const MyStatsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;
`

const MyVaultCount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`

const VaultCountValue = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
`

const VaultCountLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textL2};
  text-transform: uppercase;
`

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
`

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: ${({ theme }) => theme.bgL1};
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.bgL2};
  }
`

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textL2};
  font-weight: 500;
`

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  display: flex;
  align-items: center;
  gap: 4px;
`

const ProfitIcon = styled.div<{ $isProfit?: boolean }>`
  width: 12px;
  height: 12px;
  background: ${({ theme, $isProfit }) =>
    $isProfit
      ? "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='%2322c55e' d='M8 3l5 5H3l5-5z'/%3e%3c/svg%3e\")"
      : "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='%23ef4444' d='M8 13L3 8h10l-5 5z'/%3e%3c/svg%3e\")"};
  background-size: contain;
  background-repeat: no-repeat;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
`

const MyVaultStats = memo(() => {
  const { myVaultStats, isLoadingMyStats } = useVaultOverviewData()

  console.log('MyVaultStats render:', { myVaultStats, isLoadingMyStats })

  if (isLoadingMyStats) {
    return (
      <MyStatsContainer>
        <MyStatsHeader>
          <MyStatsTitle>
            <Trans>My Vault Stats</Trans>
          </MyStatsTitle>
        </MyStatsHeader>
        <LoadingContainer>
          <Pending isFetching />
        </LoadingContainer>
      </MyStatsContainer>
    )
  }

  if (!myVaultStats && !isLoadingMyStats) {
    // 如果没有数据且不在加载中，显示默认值
    const defaultStats = {
      vaultCount: '--',
      myTvl: '--',
      myAllTimePnL: '--',
    }

    return (
      <MyStatsContainer>
        <MyStatsHeader>
          <MyStatsTitle>
            <Trans>My Vault Stats</Trans>
          </MyStatsTitle>
          <MyVaultCount>
            <VaultCountValue>{defaultStats.vaultCount}</VaultCountValue>
            <VaultCountLabel>
              <Trans>Vaults</Trans>
            </VaultCountLabel>
          </MyVaultCount>
        </MyStatsHeader>

        <StatsRow>
          <StatItem>
            <StatLabel>
              <Trans>My TVL</Trans>
            </StatLabel>
            <StatValue>{defaultStats.myTvl}</StatValue>
          </StatItem>

          <StatItem>
            <StatLabel>
              <Trans>My all-time PnL</Trans>
            </StatLabel>
            <StatValue>{defaultStats.myAllTimePnL}</StatValue>
          </StatItem>
        </StatsRow>
      </MyStatsContainer>
    )
  }

  // 确保 myVaultStats 存在后再使用
  if (!myVaultStats) {
    return null // 这种情况下前面的默认状态应该已经处理了
  }

  // 判断是否为正收益
  const isProfitPositive =
    myVaultStats.myAllTimePnL.includes('+') ||
    (!myVaultStats.myAllTimePnL.includes('-') && myVaultStats.myAllTimePnL !== '--')

  return (
    <MyStatsContainer>
      <MyStatsHeader>
        <MyStatsTitle>
          <Trans>My Vault Stats</Trans>
        </MyStatsTitle>
        <MyVaultCount>
          <VaultCountValue>{myVaultStats.vaultCount}</VaultCountValue>
          <VaultCountLabel>
            <Trans>Vaults</Trans>
          </VaultCountLabel>
        </MyVaultCount>
      </MyStatsHeader>

      <StatsRow>
        <StatItem>
          <StatLabel>
            <Trans>My TVL</Trans>
          </StatLabel>
          <StatValue>{myVaultStats.myTvl}</StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>
            <Trans>My all-time PnL</Trans>
          </StatLabel>
          <StatValue>
            {myVaultStats.myAllTimePnL !== '--' && <ProfitIcon $isProfit={isProfitPositive} />}
            {myVaultStats.myAllTimePnL}
          </StatValue>
        </StatItem>
      </StatsRow>
    </MyStatsContainer>
  )
})

MyVaultStats.displayName = 'MyVaultStats'

export default MyVaultStats

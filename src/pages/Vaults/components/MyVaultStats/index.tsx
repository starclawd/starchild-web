import { memo, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { useFetchMyVaultStatsData } from 'store/vaults/hooks/useVaultData'
import Pending from 'components/Pending'
import { ButtonBorder } from 'components/Button'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { useVaultWalletInfo } from 'store/vaults/hooks'

const MyStatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: transparent;
  padding: 0;
`

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  margin-bottom: 24px;
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 0;
`

const StatLabel = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.textL4};
  font-weight: 400;
  margin: 0;
`

const StatValue = styled.div<{ $isProfit?: boolean | null; $isDisabled?: boolean }>`
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
  color: ${({ theme, $isProfit, $isDisabled = false }) =>
    $isDisabled ? theme.textL4 : $isProfit === null ? theme.textL1 : $isProfit ? theme.green100 : theme.red100};
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
`

const MyPortfolioButton = styled(ButtonBorder)`
  width: auto;
  padding: 7px 17px;
  border-radius: 60px;
  align-self: flex-start;
  height: 34px;
  font-size: 12px;
  line-height: 20px;
`

const MyVaultStats = memo(() => {
  const { myVaultStats, isLoading: isLoadingMyStats, fetchMyVaultStats } = useFetchMyVaultStatsData()
  const walletInfo = useVaultWalletInfo()
  const [, setCurrentRouter] = useCurrentRouter()

  useEffect(() => {
    if (walletInfo?.address) {
      fetchMyVaultStats()
    }
  }, [fetchMyVaultStats, walletInfo?.address])

  const handleMyPortfolio = useCallback(() => {
    setCurrentRouter(ROUTER.MY_PORTFOLIO)
  }, [setCurrentRouter])

  if (isLoadingMyStats) {
    return (
      <MyStatsContainer>
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
        <StatsRow>
          <StatItem>
            <StatLabel>
              <Trans>My TVL</Trans>
            </StatLabel>
            <StatValue $isProfit={null}>{defaultStats.myTvl}</StatValue>
          </StatItem>

          <StatItem>
            <StatLabel>
              <Trans>My PnL</Trans>
            </StatLabel>
            <StatValue $isProfit={null}>{defaultStats.myAllTimePnL}</StatValue>
          </StatItem>

          <StatItem>
            <StatLabel>
              <Trans>Vaults</Trans>
            </StatLabel>
            <StatValue $isProfit={null}>{defaultStats.vaultCount}</StatValue>
          </StatItem>
        </StatsRow>

        <MyPortfolioButton>
          <Trans>My portfolio</Trans>
        </MyPortfolioButton>
      </MyStatsContainer>
    )
  }

  // 确保 myVaultStats 存在后再使用
  if (!myVaultStats) {
    return null
  }

  // 判断是否为正收益
  const isProfitPositive =
    myVaultStats.raw?.total_vaults_lifetime_net_pnl != null && myVaultStats.raw?.total_vaults_lifetime_net_pnl !== 0
      ? myVaultStats.raw.total_vaults_lifetime_net_pnl > 0
      : null

  return (
    <MyStatsContainer>
      <StatsRow>
        <StatItem>
          <StatLabel>
            <Trans>My TVL</Trans>
          </StatLabel>
          <StatValue $isProfit={null}>{myVaultStats.myTvl}</StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>
            <Trans>My PnL</Trans>
          </StatLabel>
          <StatValue $isProfit={isProfitPositive}>{myVaultStats.myAllTimePnL}</StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>
            <Trans>Vaults</Trans>
          </StatLabel>
          <StatValue $isProfit={null}>{myVaultStats.vaultCount}</StatValue>
        </StatItem>
      </StatsRow>

      <MyPortfolioButton onClick={handleMyPortfolio}>
        <Trans>My portfolio</Trans>
      </MyPortfolioButton>
    </MyStatsContainer>
  )
})

MyVaultStats.displayName = 'MyVaultStats'

export default MyVaultStats

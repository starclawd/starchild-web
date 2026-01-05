import { memo, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { useFetchMyVaultStatsData } from 'store/vaults/hooks/useVaultData'
import Pending from 'components/Pending'
import { ButtonBorder } from 'components/Button'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { useAppKitAccount } from '@reown/appkit/react'

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
  gap: 2px;
  padding: 0;
`

const StatLabel = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.black300};
  font-weight: 400;
  margin: 0;
`

const StatValue = styled.div<{ value?: number | null; $isDisabled?: boolean; $showSignColor?: boolean }>`
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
  color: ${({ theme, value, $isDisabled = false, $showSignColor = false }) => {
    if ($isDisabled) return theme.black300
    if (value === null || value === undefined) return theme.black300
    if (!$showSignColor) return theme.black0
    if (value === 0) return theme.black0
    return value > 0 ? theme.jade10 : theme.ruby50
  }};
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
  const { address } = useAppKitAccount()
  const [, setCurrentRouter] = useCurrentRouter()

  useEffect(() => {
    if (address) {
      fetchMyVaultStats()
    }
  }, [fetchMyVaultStats, address])

  const handleMyVaultPortfolio = useCallback(() => {
    setCurrentRouter(ROUTER.MY_VAULT)
  }, [setCurrentRouter])

  if (isLoadingMyStats) {
    return (
      <MyStatsContainer>
        <LoadingContainer>
          <Pending isNotButtonLoading />
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
            <StatValue value={null}>{defaultStats.myTvl}</StatValue>
          </StatItem>

          <StatItem>
            <StatLabel>
              <Trans>My PnL</Trans>
            </StatLabel>
            <StatValue value={null} $showSignColor={true}>
              {defaultStats.myAllTimePnL}
            </StatValue>
          </StatItem>

          <StatItem>
            <StatLabel>
              <Trans>Vaults</Trans>
            </StatLabel>
            <StatValue value={null}>{defaultStats.vaultCount}</StatValue>
          </StatItem>
        </StatsRow>

        <MyPortfolioButton onClick={handleMyVaultPortfolio}>
          <Trans>My vault portfolio</Trans>
        </MyPortfolioButton>
      </MyStatsContainer>
    )
  }

  // 确保 myVaultStats 存在后再使用
  if (!myVaultStats) {
    return null
  }

  return (
    <MyStatsContainer>
      <StatsRow>
        <StatItem>
          <StatLabel>
            <Trans>My TVL</Trans>
          </StatLabel>
          <StatValue value={myVaultStats.raw?.total_vaults_tvl}>{myVaultStats.myTvl}</StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>
            <Trans>My PnL</Trans>
          </StatLabel>
          <StatValue value={myVaultStats.raw?.total_vaults_lifetime_net_pnl} $showSignColor={true}>
            {myVaultStats.myAllTimePnL}
          </StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>
            <Trans>Vaults</Trans>
          </StatLabel>
          <StatValue value={myVaultStats.raw?.total_involved_vaults_count}>{myVaultStats.vaultCount}</StatValue>
        </StatItem>
      </StatsRow>

      <MyPortfolioButton onClick={handleMyVaultPortfolio}>
        <Trans>My vault portfolio</Trans>
      </MyPortfolioButton>
    </MyStatsContainer>
  )
})

MyVaultStats.displayName = 'MyVaultStats'

export default MyVaultStats

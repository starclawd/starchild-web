import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useAllStrategiesOverview } from 'store/vaults/hooks'
import LeaderboardItem from './components/LeaderboardItem'
import { ANI_DURATION } from 'constants/index'
import { ROUTER } from 'pages/router'
import { useSetCurrentRouter } from 'store/application/hooks'

const LeaderboardContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 108px;
  gap: 12px;
  padding-right: 100px;
`

const LeaderboardItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-width: 392px;
  height: 100%;
  padding: 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: all ${ANI_DURATION}s;
  border: 1px solid ${({ theme }) => theme.black800};
  background: ${({ theme }) => theme.black1000};
  overflow: hidden;
  &:hover {
    border-color: ${({ theme }) => theme.black600};
  }
  .strategy-content {
    padding-bottom: 6px;
  }
`

const Leaderboard = memo(() => {
  const { allStrategies } = useAllStrategiesOverview()
  const setCurrentRouter = useSetCurrentRouter()
  const filterStrategies = useMemo(() => {
    return [...allStrategies].sort((a, b) => b.all_time_apr - a.all_time_apr).slice(0, 3)
  }, [allStrategies])
  const goVaultDetailPage = useCallback(
    (strategyId: string) => {
      return () => {
        setCurrentRouter(`${ROUTER.VAULT_DETAIL}?strategyId=${strategyId}`)
      }
    },
    [setCurrentRouter],
  )
  return (
    <LeaderboardContainer>
      {filterStrategies.map((strategy, index) => (
        <LeaderboardItemWrapper key={strategy.strategy_id} onClick={goVaultDetailPage(strategy.strategy_id)}>
          <LeaderboardItem strategyData={strategy} rank={index + 1} />
        </LeaderboardItemWrapper>
      ))}
    </LeaderboardContainer>
  )
})

Leaderboard.displayName = 'Leaderboard'

export default Leaderboard

import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { ROUTER } from 'pages/router'
import LeaderboardItem from 'pages/Vaults/components/Leaderboard/components/LeaderboardItem'
import { memo, useCallback, useMemo, useState } from 'react'
import { useSetCurrentRouter } from 'store/application/hooks'
import { useAllStrategiesOverview } from 'store/vaults/hooks'
import styled from 'styled-components'
import Pagination from '../Pagination'
import Pending from 'components/Pending'

const LeaderboardWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: calc((100% - 12px) / 2);
  height: 100%;
  padding: 16px;
  border-radius: 8px;
  transition: all ${ANI_DURATION}s;
  border: 1px solid ${({ theme }) => theme.black800};
  background-color: ${({ theme }) => theme.black1000};
  overflow: hidden;
  &:hover {
    border-color: ${({ theme }) => theme.black600};
  }
`

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  span:first-child {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    color: ${({ theme }) => theme.black0};
  }
  span:last-child {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.black200};
    cursor: pointer;
    .icon-arrow {
      font-size: 18px;
      transition: all ${ANI_DURATION}s;
      color: ${({ theme }) => theme.black200};
      transform: rotate(90deg);
    }
    &:hover {
      color: ${({ theme }) => theme.black0};
      .icon-arrow {
        color: ${({ theme }) => theme.black0};
      }
    }
  }
`

const LeaderboardList = styled.div`
  display: flex;
  flex-shrink: 0;
  overflow: hidden;
  width: 366px;
  height: 88px;
`

const PendingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const ListWrapper = styled.div<{ $translateX: number }>`
  display: flex;
  width: auto;
  height: 100%;
  transform: translateX(${({ $translateX }) => $translateX}px);
  transition: transform ${ANI_DURATION}s;
  .leaderboard-item {
    width: 366px;
  }
`

const LeaderboardItemWrapper = styled.div`
  width: 366px;
  height: 100%;
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
`

export default memo(function Leaderboard() {
  const setCurrentRouter = useSetCurrentRouter()
  const { allStrategies, isLoading } = useAllStrategiesOverview()
  const [currentIndex, setCurrentIndex] = useState(0)

  const sortedStrategies = useMemo(() => {
    return [...allStrategies].sort((a, b) => b.all_time_apr - a.all_time_apr).slice(0, 3)
  }, [allStrategies])

  const goVibePage = useCallback(() => {
    setCurrentRouter(ROUTER.VAULTS)
  }, [setCurrentRouter])

  const goVaultDetailPage = useCallback(
    (strategyId: string) => {
      return () => {
        setCurrentRouter(`${ROUTER.VAULT_DETAIL}?strategyId=${strategyId}`)
      }
    },
    [setCurrentRouter],
  )

  return (
    <LeaderboardWrapper>
      <Title>
        <span>
          <Trans>Leaderboard</Trans>
        </span>
        <span onClick={goVibePage}>
          <Trans>View more</Trans>
          <IconBase className='icon-arrow' />
        </span>
      </Title>
      <LeaderboardList>
        {isLoading ? (
          <PendingWrapper>
            <Pending />
          </PendingWrapper>
        ) : (
          <ListWrapper $translateX={-currentIndex * 366}>
            {sortedStrategies.map((strategy, index) => (
              <LeaderboardItemWrapper onClick={goVaultDetailPage(strategy.strategy_id)} key={strategy.strategy_id}>
                <LeaderboardItem strategyData={strategy} rank={index + 1} />
              </LeaderboardItemWrapper>
            ))}
          </ListWrapper>
        )}
      </LeaderboardList>
      <Pagination currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} total={sortedStrategies.length} />
    </LeaderboardWrapper>
  )
})

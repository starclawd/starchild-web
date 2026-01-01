import { Trans } from '@lingui/react/macro'
import { StrategiesOverviewStrategy } from 'api/strategy'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { ROUTER } from 'pages/router'
import LeaderboardItem from 'pages/Vaults/components/Leaderboard/components/LeaderboardItem'
import { memo, useCallback, useMemo, useState } from 'react'
import { useCurrentRouter } from 'store/application/hooks'
import { useAllStrategiesOverview } from 'store/vaults/hooks'
import styled from 'styled-components'
import Pagination from '../Pagination'

const LeaderboardWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: calc((100% - 12px) / 2);
  height: 100%;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.black600};
  background-color: ${({ theme }) => theme.black1000};
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
    color: ${({ theme }) => theme.textL1};
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
    color: ${({ theme }) => theme.textL3};
    cursor: pointer;
    .icon-arrow {
      font-size: 18px;
      transition: all ${ANI_DURATION}s;
      color: ${({ theme }) => theme.textL3};
      transform: rotate(90deg);
    }
    &:hover {
      color: ${({ theme }) => theme.textL1};
      .icon-arrow {
        color: ${({ theme }) => theme.textL1};
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

const ListWrapper = styled.div<{ $translateX: number }>`
  display: flex;
  width: auto;
  height: 100%;
  transform: translateX(${({ $translateX }) => $translateX}px);
  transition: transform ${ANI_DURATION}s ease-in-out;
  .leaderboard-item {
    width: 366px;
  }
`

export default memo(function Leaderboard() {
  const [, setCurrentRouter] = useCurrentRouter()
  const [allStrategies] = useAllStrategiesOverview()
  const [currentIndex, setCurrentIndex] = useState(0)

  const sortedStrategies = useMemo(() => {
    return [...allStrategies].sort((a, b) => b.allTimeApr - a.allTimeApr).slice(0, 10)
  }, [allStrategies])

  const goVibePage = useCallback(() => {
    setCurrentRouter(ROUTER.VAULTS)
  }, [setCurrentRouter])

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
        <ListWrapper $translateX={-currentIndex * 366}>
          {sortedStrategies.map((strategy, index) => (
            <LeaderboardItem
              key={strategy.strategyId}
              strategyData={strategy.raw as StrategiesOverviewStrategy}
              rank={index + 1}
            />
          ))}
        </ListWrapper>
      </LeaderboardList>
      <Pagination currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} total={sortedStrategies.length} />
    </LeaderboardWrapper>
  )
})

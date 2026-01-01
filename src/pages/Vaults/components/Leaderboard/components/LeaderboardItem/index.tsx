import { memo, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { StrategiesOverviewStrategy } from 'api/strategy'
import RankBg from 'assets/vaults/rank-bg.svg'
import LeaderboardBg from 'assets/vaults/leaderboard-bg.svg'
import { Trans } from '@lingui/react/macro'
import { formatPercent } from 'utils/format'

const LeaderboardItemWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 12px;
  width: 100%;
  height: 100%;
`

const RankWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 30px;
  height: 29px;
  img {
    position: absolute;
    left: 0;
    top: 0;
    width: 20px;
    height: 20px;
  }
  span {
    position: relative;
    width: 24px;
    font-size: 32px;
    font-style: italic;
    font-weight: 700;
    line-height: 25px;
    z-index: 2;
  }
`

const StrategyContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: calc(100% - 42px);
  height: 100%;
  padding-bottom: 16px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
`

const StrategyName = styled.div`
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
`

const StrategyApr = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const AprItem = styled.div<{ $emptyVaule: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  span:first-child {
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    color: ${({ theme }) => theme.textL4};
  }
  span:last-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
  }
  &:last-child {
    justify-content: flex-end;
    span:last-child {
      color: ${({ theme }) => theme.brand100};
    }
  }
  ${({ $emptyVaule, theme }) =>
    $emptyVaule &&
    css`
      span:last-child {
        color: ${theme.textL4} !important;
      }
    `}
`

export default memo(function LeaderBoardItem({
  strategyData,
  rank,
}: {
  strategyData: StrategiesOverviewStrategy
  rank: number
}) {
  const colorMap = useMemo(() => {
    return ['#f90', '#888', '#AF3C1F']
  }, [])
  const aprList = useMemo(() => {
    return [
      {
        key: '24H APR',
        text: <Trans>24H APR:</Trans>,
        value: strategyData.apr,
      },
      {
        key: 'All-time APR',
        text: <Trans>All-time APR:</Trans>,
        value: strategyData.all_time_apr,
      },
    ]
  }, [strategyData])
  return (
    <LeaderboardItemWrapper className='leaderboard-item'>
      <RankWrapper>
        <img src={RankBg} alt='rank' />
        <span style={{ color: colorMap[rank - 1] || 'rgba(255, 255, 255, 0.80)' }}>{rank}</span>
      </RankWrapper>
      <StrategyContent style={{ backgroundImage: `url(${LeaderboardBg})` }}>
        <StrategyName>{strategyData.strategy_name}</StrategyName>
        <StrategyApr>
          {aprList.map((item) => (
            <AprItem $emptyVaule={!item.value} key={item.key}>
              <span>{item.text}</span>
              <span>{item.value ? formatPercent({ value: item.value }) : '--'}</span>
            </AprItem>
          ))}
        </StrategyApr>
      </StrategyContent>
    </LeaderboardItemWrapper>
  )
})

import { memo, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { StrategiesOverviewDataType } from 'api/strategy'
import { Trans } from '@lingui/react/macro'
import { formatPercent } from 'utils/format'
import { isInvalidValue } from 'utils/calc'
import Rank, { RANK_TYPE } from '../Rank'

const LeaderboardItemWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 12px;
  width: 100%;
  height: 100%;
`

const StrategyContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: calc(100% - 42px);
  height: 100%;
  padding-bottom: 12px;
`

const StrategyName = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
`

const StrategyApr = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const AprItem = styled.div<{ $isPositive: boolean; $invalidVaule: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  span:first-child {
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    color: ${({ theme }) => theme.black300};
  }
  span:last-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.black0};
  }
  &:last-child {
    justify-content: flex-end;
  }
  ${({ $isPositive, theme }) =>
    $isPositive &&
    css`
      &:last-child {
        span:last-child {
          color: ${$isPositive ? theme.green100 : theme.red100};
        }
      }
    `}
  ${({ $invalidVaule, theme }) =>
    $invalidVaule &&
    css`
      &:last-child {
        span:last-child {
          color: ${theme.black300};
        }
      }
    `}
`

export default memo(function LeaderBoardItem({
  strategyData,
  rank,
}: {
  strategyData: StrategiesOverviewDataType
  rank: number
}) {
  const aprList = useMemo(() => {
    return [
      {
        key: 'All-time APR',
        text: <Trans>All-time APR:</Trans>,
        value: strategyData.all_time_apr,
      },
    ]
  }, [strategyData])
  return (
    <LeaderboardItemWrapper className='leaderboard-item'>
      <Rank type={RANK_TYPE.LEADERBOARD} rank={rank} />
      <StrategyContent className='strategy-content'>
        <StrategyName className='strategy-name'>{strategyData.strategy_name}</StrategyName>
        <StrategyApr>
          {aprList.map((item) => (
            <AprItem $isPositive={Number(item.value) > 0} $invalidVaule={isInvalidValue(item.value)} key={item.key}>
              <span>{item.text}</span>
              <span>{!isInvalidValue(item.value) ? formatPercent({ value: item.value }) : '--'}</span>
            </AprItem>
          ))}
        </StrategyApr>
      </StrategyContent>
    </LeaderboardItemWrapper>
  )
})

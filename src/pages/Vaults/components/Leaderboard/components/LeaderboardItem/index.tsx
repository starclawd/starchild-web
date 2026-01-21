import { memo } from 'react'
import styled, { css } from 'styled-components'
import { StrategiesOverviewDataType } from 'api/strategy'
import { Trans } from '@lingui/react/macro'
import { formatPercent, shouldShowApr } from 'utils/format'
import { isInvalidValue } from 'utils/calc'
import Rank, { RANK_TYPE } from '../Rank'
import { useTheme } from 'store/themecache/hooks'

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
  align-items: center;
  gap: 4px;
  > span:first-child {
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    color: ${({ theme }) => theme.black300};
  }
  > span:last-child {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.black0};
    span {
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
    }
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
  const theme = useTheme()
  return (
    <LeaderboardItemWrapper className='leaderboard-item'>
      <Rank type={RANK_TYPE.LEADERBOARD} rank={rank} />
      <StrategyContent className='strategy-content'>
        <StrategyName className='strategy-name'>{strategyData.strategy_name}</StrategyName>
        <StrategyApr>
          <AprItem
            $isPositive={Number(strategyData.roe) > 0}
            $invalidVaule={isInvalidValue(strategyData.roe)}
            key='ROE'
          >
            <span>
              <Trans>ROE:</Trans>
            </span>
            <span>
              {!isInvalidValue(strategyData.roe) ? formatPercent({ value: strategyData.roe }) : '--'}
              {shouldShowApr(strategyData) && (
                <span
                  style={{ color: theme.green300 }}
                >{` (APR: ${formatPercent({ value: strategyData.all_time_apr })})`}</span>
              )}
            </span>
          </AprItem>
        </StrategyApr>
      </StrategyContent>
    </LeaderboardItemWrapper>
  )
})

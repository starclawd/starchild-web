import { Trans } from '@lingui/react/macro'
import { ANI_DURATION } from 'constants/index'
import { ROUTER } from 'pages/router'
import { memo, useCallback, useMemo } from 'react'
import { useSetCurrentRouter } from 'store/application/hooks'
import { useAllStrategiesOverview } from 'store/vaults/hooks'
import styled, { css } from 'styled-components'
import Pending from 'components/Pending'
import { isInvalidValue } from 'utils/calc'
import { formatPercent } from 'utils/format'
import Rank, { RANK_TYPE } from 'pages/Vaults/components/Leaderboard/components/Rank'
import { StrategiesOverviewDataType } from 'api/strategy'

const LeaderboardWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc((100% - 12px) / 2);
  height: 100%;
  padding: 2px;
  border-radius: 8px;
  background: ${({ theme }) => theme.black900};
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);

  @keyframes angleRotateChange {
    0% {
      --gradientAngle: 0deg;
    }
    100% {
      --gradientAngle: 360deg;
    }
  }
  &::before {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    content: '';
    z-index: 1;
    border-radius: 8px;
    opacity: 0;
    transition: opacity ${ANI_DURATION}s;
    animation-name: angleRotateChange;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-duration: 5s;
    background-image: conic-gradient(
      from var(--gradientAngle),
      rgba(18, 19, 21, 0),
      rgba(248, 70, 0, 1) 30deg,
      rgba(18, 19, 21, 0) 60deg,
      rgba(18, 19, 21, 0) 360deg
    );
  }

  &:hover::before {
    opacity: 1;
  }
`

const InnerContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 18px;
  border-radius: 8px;
  background: ${({ theme }) => theme.black900};
`

const Title = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  color: ${({ theme }) => theme.black0};
`

const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  flex-grow: 1;
`

const PendingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const LeaderboardItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 34px;
  cursor: pointer;
  &:hover {
    .strategy-name {
      color: ${({ theme }) => theme.black0};
    }
  }
`

const LeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const RightContent = styled.div<{ $isPositive: boolean; $invalidVaule: boolean }>`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.black100};
  ${({ $isPositive, theme }) =>
    $isPositive &&
    css`
      color: ${$isPositive ? theme.green100 : theme.red100};
    `}
  ${({ $invalidVaule, theme }) =>
    $invalidVaule &&
    css`
      color: ${theme.black300};
    `}
`

const StrategyName = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.black0};
  span:last-child {
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    color: ${({ theme }) => theme.black300};
  }
`

const Footer = styled.div`
  width: 100%;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.black200};
  cursor: pointer;
  text-align: right;
  transition: all ${ANI_DURATION}s;
  &:hover {
    color: ${({ theme }) => theme.black0};
  }
`

export default memo(function Leaderboard() {
  const setCurrentRouter = useSetCurrentRouter()
  const { allStrategies, isLoading } = useAllStrategiesOverview()

  const sortedStrategies = useMemo(() => {
    return allStrategies.slice(0, 3)
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
      <InnerContent>
        <Title>
          <Trans>Top Performing Strategies</Trans>
        </Title>
        <LeaderboardList>
          {isLoading ? (
            <PendingWrapper>
              <Pending />
            </PendingWrapper>
          ) : (
            sortedStrategies.map((strategy: StrategiesOverviewDataType, index: number) => (
              <LeaderboardItemWrapper onClick={goVaultDetailPage(strategy.strategy_id)} key={strategy.strategy_id}>
                <LeftContent>
                  <Rank type={RANK_TYPE.CHAT} rank={index + 1} />
                  <StrategyName className='strategy-name'>
                    <span>{strategy.strategy_name}</span>
                    <span>{strategy.user_info?.user_name}</span>
                  </StrategyName>
                </LeftContent>
                <RightContent
                  $isPositive={Number(strategy.all_time_apr) > 0}
                  $invalidVaule={isInvalidValue(strategy.all_time_apr)}
                >
                  {!isInvalidValue(strategy.all_time_apr) ? formatPercent({ value: strategy.all_time_apr }) : '--'}
                </RightContent>
              </LeaderboardItemWrapper>
            ))
          )}
        </LeaderboardList>
      </InnerContent>
    </LeaderboardWrapper>
  )
})

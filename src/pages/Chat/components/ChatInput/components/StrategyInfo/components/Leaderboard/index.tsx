import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { ROUTER } from 'pages/router'
import LeaderboardItem from 'pages/Vaults/components/Leaderboard/components/LeaderboardItem'
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
  flex-direction: column;
  justify-content: space-between;
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
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  color: ${({ theme }) => theme.black0};
`

const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
  gap: 4px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 16px;
  padding-left: 22px;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  color: ${({ theme }) => theme.black300};
`

const PendingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`

const LeaderboardItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 18px;
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
  gap: 7px;
`

const RightContent = styled.div<{ $isPositive: boolean; $invalidVaule: boolean }>`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
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
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.black100};
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
      <Title>
        <Trans>Top Performing Strategies</Trans>
      </Title>
      <LeaderboardList>
        {isLoading ? (
          <PendingWrapper>
            <Pending />
          </PendingWrapper>
        ) : (
          <>
            <Header>
              <span>
                <Trans>Name</Trans>
              </span>
              <span>
                <Trans>APR</Trans>
              </span>
            </Header>
            <ListWrapper>
              {sortedStrategies.map((strategy: StrategiesOverviewDataType, index: number) => (
                <LeaderboardItemWrapper onClick={goVaultDetailPage(strategy.strategy_id)} key={strategy.strategy_id}>
                  <LeftContent>
                    <Rank type={RANK_TYPE.CHAT} rank={index + 1} />
                    <StrategyName className='strategy-name'>{strategy.strategy_name}</StrategyName>
                  </LeftContent>
                  <RightContent
                    $isPositive={Number(strategy.all_time_apr) > 0}
                    $invalidVaule={isInvalidValue(strategy.all_time_apr)}
                  >
                    {!isInvalidValue(strategy.all_time_apr) ? formatPercent({ value: strategy.all_time_apr }) : '--'}
                  </RightContent>
                </LeaderboardItemWrapper>
              ))}
            </ListWrapper>
          </>
        )}
      </LeaderboardList>
      <Footer onClick={goVibePage}>
        <Trans>View more</Trans>
      </Footer>
    </LeaderboardWrapper>
  )
})

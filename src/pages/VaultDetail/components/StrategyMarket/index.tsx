import { memo, useCallback, useMemo } from 'react'
import { useIsShowStrategyMarket } from 'store/vaultsdetailcache/hooks'
import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { Trans } from '@lingui/react/macro'
import { useAllStrategiesOverview } from 'store/vaults/hooks'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { formatPercent, getStatValueColor } from 'utils/format'
import { useTheme } from 'store/themecache/hooks'
import { useToggleStrategyId } from 'hooks/useAddUrlParam'
import { useResetAllState } from 'store/vaultsdetail/hooks/useResetAllState'
import { useSort, SortArrows, SortableHeader, SortDirection } from 'components/TableSortableColumn'
import { isInvalidValue } from 'utils/calc'

const StrategyMarketWrapper = styled.div<{ $isShowStrategyMarket: boolean }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 320px;
  height: 100%;
  transition: all ${ANI_DURATION}s;
  ${({ $isShowStrategyMarket }) =>
    !$isShowStrategyMarket &&
    css`
      width: 0;
      overflow: hidden;
    `}
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 320px;
  height: 100%;
  padding: 0 8px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border-bottom: 1px solid ${({ theme }) => theme.black800};
  .name {
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.black300};
  }
  .apr {
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.black300};
  }
`

const StrategyList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 40px);
  flex: 1;
`

const StrategyItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  gap: 8px;
  width: 100%;
  height: 40px;
  padding: 12px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black100};
  ${({ $isActive }) =>
    $isActive &&
    css`
      background-color: ${({ theme }) => theme.black800};
    `}
`

export default memo(function StrategyMarket() {
  const theme = useTheme()
  const resetAllState = useResetAllState()
  const toggleStrategyId = useToggleStrategyId()
  const { strategyId } = useParsedQueryString()
  const [isShowStrategyMarket] = useIsShowStrategyMarket()
  const { allStrategies } = useAllStrategiesOverview()
  const { sortState, handleSort } = useSort('all_time_apr', SortDirection.NONE)

  // 根据排序状态对策略列表进行排序
  const sortedStrategies = useMemo(() => {
    if (sortState.field !== 'all_time_apr' || sortState.direction === SortDirection.NONE) {
      return allStrategies
    }
    return [...allStrategies].sort((a, b) => {
      if (sortState.direction === SortDirection.ASC) {
        return a.all_time_apr - b.all_time_apr
      }
      return b.all_time_apr - a.all_time_apr
    })
  }, [allStrategies, sortState])

  const handleToggleStrategyId = useCallback(
    (newStrategyId: string) => {
      return () => {
        // 切换策略前先清空旧的策略数据和重置状态
        if (newStrategyId !== strategyId) {
          resetAllState()
        }
        toggleStrategyId(newStrategyId)
      }
    },
    [toggleStrategyId, resetAllState, strategyId],
  )

  const handleSortByApr = useCallback(() => {
    handleSort('all_time_apr')
  }, [handleSort])

  return (
    <StrategyMarketWrapper $isShowStrategyMarket={isShowStrategyMarket}>
      <InnerContent>
        <Header>
          <span className='name'>
            <Trans>Name</Trans>
          </span>
          <SortableHeader onClick={handleSortByApr}>
            <span className='apr'>
              <Trans>APR</Trans>
            </span>
            <SortArrows
              direction={sortState.field === 'all_time_apr' ? sortState.direction : SortDirection.NONE}
              onClick={handleSortByApr}
            />
          </SortableHeader>
        </Header>
        <StrategyList className='scroll-style'>
          {sortedStrategies.map((strategy) => (
            <StrategyItem
              onClick={handleToggleStrategyId(strategy.strategy_id)}
              $isActive={strategy.strategy_id === strategyId}
              key={strategy.strategy_id}
            >
              <span>{strategy.strategy_name}</span>
              <span style={{ color: getStatValueColor(strategy.all_time_apr, true, theme) }}>
                {!isInvalidValue(strategy.all_time_apr)
                  ? formatPercent({ value: strategy.all_time_apr, mark: true, precision: 1 })
                  : '--'}
              </span>
            </StrategyItem>
          ))}
        </StrategyList>
      </InnerContent>
    </StrategyMarketWrapper>
  )
})

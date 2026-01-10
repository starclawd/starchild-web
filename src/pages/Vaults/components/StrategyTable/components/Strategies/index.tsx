import { memo, useMemo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import Pending from 'components/Pending'
import { useAllStrategiesOverview } from 'store/vaults/hooks'
import { SortState, SortDirection } from 'components/TableSortableColumn'
import { toFix } from 'utils/calc'
import { formatKMBNumber } from 'utils/format'
import { useSetCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { ANI_DURATION } from 'constants/index'
import VibeItem from '../../../../../VaultDetail/components/VaultInfo/components/VibeItem'
import Rank from '../../../Leaderboard/components/Rank'
import Avatar from 'components/Avatar'
import Tooltip from 'components/Tooltip'
import { IconBase } from 'components/Icons'
import { COLUMN_WIDTHS } from '../../index'
import { StrategiesOverviewDataType } from 'api/strategy'
import Divider from 'components/Divider'
import { useTheme } from 'store/themecache/hooks'
import Snapshot from '../Snapshort'

const StrategiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 300px;
  flex: 1;
`

const TableScrollContainer = styled.div`
  flex: 1;
  min-height: 0;
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`

// 每个策略用一个 tbody 包裹，实现数据行+标签行共同 hover
const StrategyTbody = styled.tbody`
  cursor: pointer;
  position: relative;

  tr td {
    transition: background-color ${ANI_DURATION}s;
  }

  ${({ theme }) =>
    theme.isMobile
      ? css`
          &:active tr td {
            background-color: ${theme.black900};
          }
        `
      : css`
          &:hover tr td {
            background-color: ${theme.black800};
          }
        `}
`

const DataRow = styled.tr`
  height: 28px;

  td {
    padding-top: 10px;
    box-sizing: content-box;
  }
`

const TagsRow = styled.tr`
  height: 40px;

  td {
    padding-bottom: 10px;
    box-sizing: content-box;
  }
`

const TableCell = styled.td<{ $align?: 'left' | 'center' | 'right' }>`
  text-align: ${(props) => props.$align || 'left'};
  color: ${({ theme }) => theme.black100};
  padding: 0 12px;
  vertical-align: middle;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;

  &:first-child {
    padding-left: 0;
    border-top-left-radius: 8px;
  }
  &:last-child {
    padding-right: 0;
    border-top-right-radius: 8px;
  }
`

const TagsCell = styled.td`
  padding: 0 12px;
  vertical-align: top;

  &:first-child {
    border-bottom-left-radius: 8px;
  }
  &:last-child {
    border-bottom-right-radius: 8px;
  }
`

const TagsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  height: 40px;
`

const PercentageText = styled.span<{ $isPositive?: boolean; $isNegative?: boolean }>`
  color: ${({ theme, $isPositive, $isNegative }) =>
    $isPositive ? theme.green100 : $isNegative ? theme.red100 : theme.black100};
`

const StrategyName = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
`

const LeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const LeaderName = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.black100};
`

const TvfText = styled.span<{ $hasValue?: boolean }>`
  color: ${({ theme, $hasValue }) => ($hasValue ? theme.brand100 : theme.black100)};
`

const AprWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  span {
    color: ${({ theme }) => theme.black100};
  }
`

const WarningIcon = styled(IconBase)`
  font-size: 18px;
  color: ${({ theme }) => theme.black0};
  cursor: pointer;
  transform: rotate(180deg);
`

const RankPlaceholder = styled.div`
  width: 34px;
  height: 32px;
`

const NormalRank = styled.span`
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
`

const VibeWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  span {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    &:first-child {
      color: ${({ theme }) => theme.brand200};
    }
    &:last-child {
      font-size: 13px;
      font-style: italic;
      font-weight: 400;
      line-height: 18px;
      color: ${({ theme }) => theme.black0};
    }
  }
`

interface StrategiesProps {
  searchValue: string
  sortState: SortState
}

const Strategies = memo(({ searchValue, sortState }: StrategiesProps) => {
  const theme = useTheme()
  const { allStrategies, isLoading: isLoadingAllStrategies } = useAllStrategiesOverview()
  const setCurrentRouter = useSetCurrentRouter()
  // 通过 searchValue 筛选数据
  const filteredStrategies = useMemo(() => {
    if (!searchValue.trim()) {
      return allStrategies
    }

    const lowerSearchValue = searchValue.toLowerCase().trim()
    return allStrategies.filter((strategy) => {
      const userName = strategy.user_info?.user_name?.toLowerCase() || ''
      const strategyName = strategy.strategy_name?.toLowerCase() || ''
      return userName.includes(lowerSearchValue) || strategyName.includes(lowerSearchValue)
    })
  }, [allStrategies, searchValue])

  // 排序后的数据
  const sortedStrategies = useMemo(() => {
    if (sortState.field === null || sortState.direction === SortDirection.NONE) {
      return filteredStrategies
    }

    const sorted = [...filteredStrategies].sort((a, b) => {
      const field = sortState.field as keyof StrategiesOverviewDataType
      const aValue = a[field]
      const bValue = b[field]

      // 处理 null 和 undefined 值，将它们排到最后
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return 1
      if (bValue == null) return -1

      // 尝试转换为数字进行比较
      const aNum = Number(aValue)
      const bNum = Number(bValue)

      let result: number
      if (!isNaN(aNum) && !isNaN(bNum)) {
        result = aNum - bNum
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        result = aValue.localeCompare(bValue)
      } else {
        result = 0
      }

      // 根据排序方向返回结果
      return sortState.direction === SortDirection.DESC ? -result : result
    })

    return sorted
  }, [filteredStrategies, sortState])

  // 行点击跳转到详情页
  const handleRowClick = useCallback(
    (record: StrategiesOverviewDataType) => {
      setCurrentRouter(`${ROUTER.VAULT_DETAIL}?strategyId=${record.strategy_id}`)
    },
    [setCurrentRouter],
  )

  // 格式化百分比显示
  const formatPercent = (value: number) => {
    const formatted = toFix(value * 100, 1)
    return `${formatted}%`
  }

  if (isLoadingAllStrategies) {
    return (
      <StrategiesContainer>
        <Pending isNotButtonLoading />
      </StrategiesContainer>
    )
  }

  return (
    <StrategiesContainer>
      <TableScrollContainer>
        <StyledTable>
          <colgroup>
            {COLUMN_WIDTHS.map((width, index) => (
              <col key={index} style={{ width }} />
            ))}
          </colgroup>
          {sortedStrategies.map((record, rowIndex) => {
            const vibe = record.vibe
            const rankIndex = rowIndex + 1
            const tvf = (record as any).tvf || 0
            const followers = (record as any).followers || 0
            const userName = record.user_info?.user_name || ''
            const columnCount = 9
            const showRank = rankIndex <= 3
            return (
              <StrategyTbody key={record.strategy_id || rowIndex} onClick={() => handleRowClick(record)}>
                <DataRow>
                  <TableCell>
                    {showRank ? <Rank rank={rankIndex} isLeaderboard={false} /> : <NormalRank>{rankIndex}</NormalRank>}
                  </TableCell>
                  <TableCell>
                    <StrategyName>{record.strategy_name}</StrategyName>
                  </TableCell>
                  <TableCell>
                    <LeaderWrapper>
                      <Avatar avatar={record.user_info?.user_avatar} name={userName} size={24} />
                      <LeaderName>{userName}</LeaderName>
                    </LeaderWrapper>
                  </TableCell>
                  <TableCell>
                    {/* {isAgeLessThan30 ? (
                      <AprWrapper>
                        <span>--</span>
                        <Tooltip placement='top' content={<Trans>APR shown for strategies aged over 30 days.</Trans>}>
                          <WarningIcon className='icon-circle-warning' />
                        </Tooltip>
                      </AprWrapper>
                    ) : (
                    )} */}
                    <PercentageText $isPositive={record.all_time_apr > 0} $isNegative={record.all_time_apr < 0}>
                      {formatPercent(record.all_time_apr)}
                    </PercentageText>
                  </TableCell>
                  <TableCell>{Math.floor(record.age_days)}</TableCell>
                  <TableCell>
                    <PercentageText $isNegative={record.max_drawdown > 0}>
                      {formatPercent(record.max_drawdown)}
                    </PercentageText>
                  </TableCell>
                  <TableCell>
                    <TvfText $hasValue={tvf > 0}>{tvf ? `$${formatKMBNumber(tvf)}` : '0'}</TvfText>
                  </TableCell>
                  <TableCell>{followers ? formatKMBNumber(followers) : '0'}</TableCell>
                  <TableCell $align='right'>
                    <Snapshot data={record.s24h} />
                  </TableCell>
                </DataRow>
                <TagsRow>
                  <TagsCell />
                  <TagsCell colSpan={columnCount - 1}>
                    <VibeWrapper>
                      <span>Just for test</span>
                      <Divider height={1} length={18} color={theme.black600} vertical paddingHorizontal={8} />
                      <span>"{vibe || '--'}"</span>
                    </VibeWrapper>
                  </TagsCell>
                </TagsRow>
              </StrategyTbody>
            )
          })}
        </StyledTable>
      </TableScrollContainer>
    </StrategiesContainer>
  )
})

Strategies.displayName = 'Strategies'

export default Strategies

import { memo, useMemo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import Pending from 'components/Pending'
import { useAllStrategiesOverview } from 'store/vaults/hooks'
import { SortState, SortDirection } from 'components/TableSortableColumn'
import { toFix } from 'utils/calc'
import { useSetCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { ANI_DURATION } from 'constants/index'
import tagBg from 'assets/vaults/tag-bg.png'
import VibeItem from '../VibeItem'
import { COLUMN_WIDTHS } from '../../index'
import { StrategiesOverviewDataType } from 'api/strategy'

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
    padding-left: 12px;
    border-top-left-radius: 8px;
  }
  &:last-child {
    padding-right: 12px;
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

const SnapshotChart = styled.div`
  width: 100%;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const SnapshotSvg = styled.svg`
  width: 100%;
  height: 100%;
`

// 标签颜色映射
const TAG_COLORS: Record<string, string> = {
  orange: '#F59E0B',
  green: '#22C55E',
  yellow: '#EAB308',
  blue: '#3B82F6',
  purple: '#A855F7',
  red: '#EF4444',
}

// 简单的折线图组件，用于 Snapshot 列
const MiniChart = memo<{ dataPoints: number; isPositive: boolean }>(({ dataPoints, isPositive }) => {
  // 生成简单的模拟数据点用于展示
  const points = useMemo(() => {
    const numPoints = Math.min(dataPoints, 20)
    const arr = []
    let y = 50
    for (let i = 0; i < numPoints; i++) {
      y = Math.max(10, Math.min(90, y + (Math.random() - 0.5) * 20))
      arr.push({ x: (i / (numPoints - 1 || 1)) * 80, y: 100 - y })
    }
    return arr
  }, [dataPoints])

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <SnapshotChart>
      <SnapshotSvg viewBox='0 0 80 100' preserveAspectRatio='none'>
        <path
          d={pathD}
          fill='none'
          stroke={isPositive ? '#22c55e' : '#ef4444'}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </SnapshotSvg>
    </SnapshotChart>
  )
})

MiniChart.displayName = 'MiniChart'
interface StrategiesProps {
  searchValue: string
  sortState: SortState
}

const Strategies = memo(({ searchValue, sortState }: StrategiesProps) => {
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

  // 列数
  const columnCount = 11

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
            return (
              <StrategyTbody key={record.strategy_id || rowIndex} onClick={() => handleRowClick(record)}>
                <DataRow>
                  <TableCell>{record.strategy_name}</TableCell>
                  <TableCell>{record.user_info?.user_name}</TableCell>
                  <TableCell>
                    <PercentageText $isPositive={record.apr > 0} $isNegative={record.apr < 0}>
                      {formatPercent(record.apr)}
                    </PercentageText>
                  </TableCell>
                  <TableCell>
                    <PercentageText $isPositive={record.apr > 0} $isNegative={record.apr < 0}>
                      {formatPercent(record.apr)}
                    </PercentageText>
                  </TableCell>
                  <TableCell>
                    <PercentageText $isPositive={record.all_time_apr > 0} $isNegative={record.all_time_apr < 0}>
                      {formatPercent(record.all_time_apr)}
                    </PercentageText>
                  </TableCell>
                  <TableCell>
                    <PercentageText $isNegative={record.max_drawdown > 0}>
                      {formatPercent(record.max_drawdown)}
                    </PercentageText>
                  </TableCell>
                  <TableCell>{toFix(record.sharpe_ratio, 1)}</TableCell>
                  <TableCell>{Math.floor(record.age_days)}</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell $align='right'>
                    <MiniChart dataPoints={record.data_points} isPositive={record.all_time_apr >= 0} />
                  </TableCell>
                </DataRow>
                <TagsRow>
                  <TagsCell colSpan={columnCount}>
                    <TagsContainer style={{ backgroundImage: `url(${tagBg})` }}>
                      {vibe && <VibeItem colorType='brand' text={vibe} size='small' />}
                    </TagsContainer>
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

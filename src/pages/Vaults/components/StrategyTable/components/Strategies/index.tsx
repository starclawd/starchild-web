import { memo, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import Pending from 'components/Pending'
import Table, { ColumnDef } from 'components/Table'
import { useAllStrategiesOverview, useFetchAllStrategiesOverviewData } from 'store/vaults/hooks'
import { AllStrategiesOverview } from 'store/vaults/vaults.d'
import { useSort, useSortableHeader, SortDirection } from 'components/TableSortableColumn'
import { formatNumber } from 'utils/format'
import { toFix } from 'utils/calc'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import Avatar from 'components/Avatar'

const StrategiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 300px;
  .table-scroll-container {
    padding: 0;
  }
  table {
    table-layout: auto;
    min-width: 100%;
  }
  /* tableHeader 高度 38px，无背景色 */
  .table-header {
    background-color: transparent;
    border-bottom: 1px solid ${({ theme }) => theme.bgT20};
  }
  .header-container {
    height: 38px;
  }
  /* th 左右 12px padding */
  .table-header th {
    &:first-child {
      padding-left: 12px;
    }
    &:last-child {
      padding-right: 12px;
    }
  }
  /* tr 高度 48px */
  .table-row {
    height: 48px;
  }
  .table-body tr {
    cursor: pointer;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 12px;
      right: 12px;
      bottom: 0;
      height: 1px;
      background-color: ${({ theme }) => theme.bgT20};
    }
  }
  /* td 左右 12px padding */
  .table-row td {
    &:first-child {
      padding-left: 12px;
      border-radius: 0;
    }
    &:last-child {
      padding-right: 12px;
      border-radius: 0;
    }
  }
`

const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const LeaderCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const LeaderName = styled.span`
  color: ${({ theme }) => theme.black100};
`

const PercentageText = styled.span<{ $isPositive?: boolean; $isNegative?: boolean }>`
  color: ${({ theme, $isPositive, $isNegative }) =>
    $isPositive ? theme.green100 : $isNegative ? theme.red100 : theme.black100};
`

const SnapshotChart = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const SnapshotSvg = styled.svg`
  width: 100%;
  height: 100%;
`

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

const Strategies = memo(({ searchValue }: { searchValue: string }) => {
  const { isLoading: isLoadingAllStrategies } = useFetchAllStrategiesOverviewData()
  const [allStrategies] = useAllStrategiesOverview()
  const [, setCurrentRouter] = useCurrentRouter()
  const { sortState, handleSort } = useSort()
  const createSortableHeader = useSortableHeader(sortState, handleSort)

  // 通过 searchValue 筛选数据
  const filteredStrategies = useMemo(() => {
    if (!searchValue.trim()) {
      return allStrategies
    }

    const lowerSearchValue = searchValue.toLowerCase().trim()
    return allStrategies.filter((strategy) => {
      const userName = strategy.raw?.user_info?.user_name?.toLowerCase() || ''
      const strategyName = strategy.raw?.strategy_name?.toLowerCase() || ''
      return userName.includes(lowerSearchValue) || strategyName.includes(lowerSearchValue)
    })
  }, [allStrategies, searchValue])

  // 排序后的数据
  const sortedStrategies = useMemo(() => {
    if (sortState.field === null || sortState.direction === SortDirection.NONE) {
      return filteredStrategies
    }

    const sorted = [...filteredStrategies].sort((a, b) => {
      const field = sortState.field as keyof AllStrategiesOverview
      const aValue = a[field]
      const bValue = b[field]

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue)
      }

      return 0
    })

    return sortState.direction === SortDirection.DESC ? sorted.reverse() : sorted
  }, [filteredStrategies, sortState])

  // 行点击跳转到详情页
  const handleRowClick = useCallback(
    (record: AllStrategiesOverview) => {
      setCurrentRouter(`${ROUTER.VAULT_DETAIL}?strategyId=${record.strategyId}`)
    },
    [setCurrentRouter],
  )

  // 格式化百分比显示
  const formatPercent = (value: number) => {
    const formatted = toFix(value * 100, 1)
    return `${formatted}%`
  }

  // 表格列定义
  const columns: ColumnDef<AllStrategiesOverview>[] = useMemo(
    () => [
      {
        key: 'strategyName',
        title: <Trans>Name</Trans>,
        render: (record) => <NameCell>{record.strategyName}</NameCell>,
      },
      {
        key: 'leader',
        title: <Trans>Leader</Trans>,
        render: (record) => (
          <LeaderCell>
            <LeaderName>{record.userInfo?.user_name}</LeaderName>
          </LeaderCell>
        ),
      },
      {
        key: 'apr',
        title: createSortableHeader(<Trans>7D APR</Trans>, 'apr'),
        render: (record) => (
          <PercentageText $isPositive={record.apr > 0} $isNegative={record.apr < 0}>
            {formatPercent(record.apr)}
          </PercentageText>
        ),
      },
      {
        key: 'apr30d',
        title: createSortableHeader(<Trans>30D APR</Trans>, 'apr'),
        render: (record) => (
          <PercentageText $isPositive={record.apr > 0} $isNegative={record.apr < 0}>
            {formatPercent(record.apr)}
          </PercentageText>
        ),
      },
      {
        key: 'allTimeApr',
        title: createSortableHeader(<Trans>All time APR</Trans>, 'allTimeApr'),
        render: (record) => (
          <PercentageText $isPositive={record.allTimeApr > 0} $isNegative={record.allTimeApr < 0}>
            {formatPercent(record.allTimeApr)}
          </PercentageText>
        ),
      },
      {
        key: 'maxDrawdown',
        title: createSortableHeader(<Trans>Max drawdown</Trans>, 'maxDrawdown'),
        render: (record) => (
          <PercentageText $isNegative={record.maxDrawdown > 0}>{formatPercent(record.maxDrawdown)}</PercentageText>
        ),
      },
      {
        key: 'sharpeRatio',
        title: createSortableHeader(<Trans>Sharpe ratio</Trans>, 'sharpeRatio'),
        render: (record) => <span>{toFix(record.sharpeRatio, 1)}</span>,
      },
      {
        key: 'ageDays',
        title: createSortableHeader(<Trans>Age(days)</Trans>, 'ageDays'),
        render: (record) => <span>{Math.floor(record.ageDays)}</span>,
      },
      {
        key: 'tvf',
        title: <Trans>TVF</Trans>,
        render: (record) => <span>--</span>,
      },
      {
        key: 'followers',
        title: <Trans>Followers</Trans>,
        render: () => <span>--</span>,
      },
      {
        key: 'snapshot',
        title: <Trans>Snapshot</Trans>,
        align: 'right',
        render: (record) => <MiniChart dataPoints={record.dataPoints} isPositive={record.allTimeApr >= 0} />,
      },
    ],
    [createSortableHeader],
  )

  if (isLoadingAllStrategies) {
    return (
      <StrategiesContainer>
        <Pending isNotButtonLoading />
      </StrategiesContainer>
    )
  }

  return (
    <StrategiesContainer>
      <Table
        data={sortedStrategies}
        columns={columns}
        headerHeight={38}
        rowHeight={48}
        rowGap={0}
        headerBodyGap={0}
        onRowClick={handleRowClick}
      />
    </StrategiesContainer>
  )
})

Strategies.displayName = 'Strategies'

export default Strategies

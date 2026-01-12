import { memo, useMemo } from 'react'
import styled from 'styled-components'
import Pending from 'components/Pending'
import { useAllStrategiesOverview } from 'store/vaults/hooks'
import { SortState, SortDirection } from 'components/TableSortableColumn'
import { COLUMN_WIDTHS } from '../../index'
import { StrategiesOverviewDataType } from 'api/strategy'
import StrategyItem from '../StrategyItem'

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
  --name-column-width: 20%;

  ${({ theme }) => theme.mediaMaxWidth.width1920`
    --name-column-width: 280px;
  `}
  ${({ theme }) => theme.mediaMaxWidth.width1440`
    --name-column-width: 260px;
  `}
  ${({ theme }) => theme.mediaMaxWidth.width1280`
    --name-column-width: 240px;
  `}
`

interface StrategiesProps {
  searchValue: string
  sortState: SortState
}

const Strategies = memo(({ searchValue, sortState }: StrategiesProps) => {
  const { allStrategies, isLoading: isLoadingAllStrategies } = useAllStrategiesOverview()

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
          {sortedStrategies.map((record, rowIndex) => (
            <StrategyItem key={record.strategy_id || rowIndex} record={record} rowIndex={rowIndex} />
          ))}
        </StyledTable>
      </TableScrollContainer>
    </StrategiesContainer>
  )
})

Strategies.displayName = 'Strategies'

export default Strategies

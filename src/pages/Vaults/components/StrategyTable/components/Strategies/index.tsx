import { memo, useMemo, useState, useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Pending from 'components/Pending'
import { useAllStrategiesOverview } from 'store/vaults/hooks'
import { SortState, SortDirection } from 'components/TableSortableColumn'
import { COLUMN_WIDTHS } from '../../index'
import { StrategiesOverviewDataType } from 'api/strategy'
import StrategyItem from '../StrategyItem'

const PAGE_SIZE = 20

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

const LoadMoreTrigger = styled.div`
  height: 1px;
  width: 100%;
`

const LoadingMore = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
`

interface StrategiesProps {
  searchValue: string
  sortState: SortState
  strategies?: StrategiesOverviewDataType[]
  isLoading?: boolean
  roeRankMap?: Map<string, number>
  showActions?: boolean
  columnWidths?: string[]
}

const Strategies = memo(
  ({
    searchValue,
    sortState,
    strategies,
    isLoading,
    roeRankMap: externalRoeRankMap,
    showActions,
    columnWidths,
  }: StrategiesProps) => {
    const { allStrategies, isLoading: isLoadingAllStrategies } = useAllStrategiesOverview()

    // 使用传入的数据或默认的 allStrategies
    const dataSource = strategies ?? allStrategies
    const loading = isLoading ?? isLoadingAllStrategies

    const [displayCount, setDisplayCount] = useState(PAGE_SIZE)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const loadMoreRef = useRef<HTMLDivElement>(null)

    // 计算基于 roe 倒序的排名 Map（如果外部传入则使用外部的）
    const internalRoeRankMap = useMemo(() => {
      if (externalRoeRankMap) return externalRoeRankMap

      const sorted = [...dataSource].sort((a, b) => {
        const aValue = a.roe ?? 0
        const bValue = b.roe ?? 0
        // 倒序排列（DESC），大的在前
        return bValue - aValue
      })
      const rankMap = new Map<string, number>()
      sorted.forEach((strategy, index) => {
        if (strategy.strategy_id) {
          rankMap.set(String(strategy.strategy_id), index + 1)
        }
      })
      return rankMap
    }, [dataSource, externalRoeRankMap])

    const roeRankMap = externalRoeRankMap ?? internalRoeRankMap

    // 通过 searchValue 筛选数据
    const filteredStrategies = useMemo(() => {
      if (!searchValue.trim()) {
        return dataSource
      }

      const lowerSearchValue = searchValue.toLowerCase().trim()
      return dataSource.filter((strategy) => {
        const userName = strategy.user_info?.user_name?.toLowerCase() || ''
        const strategyName = strategy.strategy_name?.toLowerCase() || ''
        return userName.includes(lowerSearchValue) || strategyName.includes(lowerSearchValue)
      })
    }, [dataSource, searchValue])

    // 排序后的数据
    const sortedStrategies = useMemo(() => {
      if (sortState.field === null || sortState.direction === SortDirection.NONE) {
        return filteredStrategies
      }

      const sorted = [...filteredStrategies].sort((a, b) => {
        const field = sortState.field as keyof StrategiesOverviewDataType
        const aValue = a[field] ?? 0
        const bValue = b[field] ?? 0

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
    // 当搜索或排序变化时，重置显示数量
    useEffect(() => {
      setDisplayCount(PAGE_SIZE)
    }, [searchValue, sortState])

    // 当前显示的数据
    const displayStrategies = useMemo(() => {
      return sortedStrategies.slice(0, displayCount)
    }, [sortedStrategies, displayCount])

    // 是否还有更多数据
    const hasNextPage = displayCount < sortedStrategies.length

    // 加载更多
    const loadMore = useCallback(() => {
      if (hasNextPage && !isLoadingMore) {
        setIsLoadingMore(true)
        // 模拟短暂延迟，让用户看到加载状态
        setTimeout(() => {
          setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, sortedStrategies.length))
          setIsLoadingMore(false)
        }, 100)
      }
    }, [hasNextPage, isLoadingMore, sortedStrategies.length])

    // IntersectionObserver 监听滚动到底部
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isLoadingMore) {
            loadMore()
          }
        },
        { threshold: 0.1 },
      )

      const currentRef = loadMoreRef.current
      if (currentRef) {
        observer.observe(currentRef)
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef)
        }
      }
    }, [hasNextPage, isLoadingMore, loadMore, loading])

    if (loading) {
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
              {(columnWidths || COLUMN_WIDTHS).map((width, index) => (
                <col key={index} style={{ width }} />
              ))}
            </colgroup>
            {displayStrategies.map((record, index) => (
              <StrategyItem
                key={record.strategy_id || index}
                record={record}
                roeRank={record.strategy_id ? roeRankMap.get(String(record.strategy_id)) || 0 : 0}
                showActions={showActions}
              />
            ))}
          </StyledTable>
          {hasNextPage && (
            <>
              <LoadMoreTrigger ref={loadMoreRef} />
              {isLoadingMore && (
                <LoadingMore>
                  <Pending isNotButtonLoading />
                </LoadingMore>
              )}
            </>
          )}
        </TableScrollContainer>
      </StrategiesContainer>
    )
  },
)

Strategies.displayName = 'Strategies'

export default Strategies

import { useCallback, useState } from 'react'
import { SortDirection, SortState, UseSortResult } from '../types'

/**
 * 通用排序状态管理钩子
 * @param initialField 初始排序字段
 * @param initialDirection 初始排序方向
 * @returns 排序状态和处理函数
 */
export function useSort(
  initialField: string | null = null,
  initialDirection: SortDirection = SortDirection.NONE,
): UseSortResult {
  // 排序状态管理
  const [sortState, setSortState] = useState<SortState>({
    field: initialField,
    direction: initialDirection,
  })

  // 排序处理函数
  const handleSort = useCallback((field: string) => {
    setSortState((prevState) => {
      let newDirection: SortDirection

      if (prevState.field === field) {
        // 同一字段，切换排序方向：升序 -> 降序 -> 不排序 -> 升序
        switch (prevState.direction) {
          case SortDirection.NONE:
            newDirection = SortDirection.ASC
            break
          case SortDirection.ASC:
            newDirection = SortDirection.DESC
            break
          case SortDirection.DESC:
            newDirection = SortDirection.NONE
            break
          default:
            newDirection = SortDirection.ASC
        }
      } else {
        // 不同字段，重置为升序
        newDirection = SortDirection.ASC
      }

      return {
        field: newDirection === SortDirection.NONE ? null : field,
        direction: newDirection,
      }
    })
  }, [])

  return {
    sortState,
    handleSort,
  }
}

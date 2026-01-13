import { useCallback } from 'react'
import { ReactNode } from 'react'
import { SortDirection, SortState } from '../types'
import { SortArrows, SortableHeader } from '../components/SortComponents'

/**
 * 创建可排序表头的hook
 * @param sortState 排序状态
 * @param handleSort 排序处理函数
 * @returns 创建可排序表头的函数
 */
export function useSortableHeader(sortState: SortState, handleSort: (field: string) => void) {
  const createSortableHeader = useCallback(
    (text: ReactNode, field: string): ReactNode => {
      const isCurrentField = sortState.field === field
      const direction = isCurrentField ? sortState.direction : SortDirection.NONE

      return (
        <SortableHeader onClick={() => handleSort(field)}>
          {text}
          <SortArrows direction={direction} onClick={() => handleSort(field)} />
        </SortableHeader>
      )
    },
    [sortState, handleSort],
  )

  return createSortableHeader
}

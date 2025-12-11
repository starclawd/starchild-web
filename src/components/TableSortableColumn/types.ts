import { ReactNode } from 'react'
import { ColumnDef } from 'components/Table'

// 排序方向枚举
export enum SortDirection {
  NONE = 'none',
  ASC = 'asc',
  DESC = 'desc',
}

// 排序状态接口
export interface SortState {
  field: string | null
  direction: SortDirection
}

// 扩展的列定义接口，支持排序
export interface SortableColumnDef<T> extends ColumnDef<T> {
  sortable?: boolean
  sortField?: string
  sortDirection?: SortDirection
  onSort?: (field: string) => void
}

// 排序钩子返回值
export interface UseSortResult {
  sortState: SortState
  handleSort: (field: string) => void
}

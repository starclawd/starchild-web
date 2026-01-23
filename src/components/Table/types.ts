/**
 * Table 组件类型定义
 */
import { ReactNode } from 'react'

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

// 列定义接口
export interface ColumnDef<T> {
  key: string
  title: ReactNode
  width?: string
  render?: (record: T, index: number) => ReactNode
  align?: 'left' | 'center' | 'right'
}

// 列定义基础接口（别名，保持向后兼容）
export type BaseColumnDef<T> = ColumnDef<T>

// 扩展的列定义接口，支持排序
export interface SortableColumnDef<T> extends ColumnDef<T> {
  sortable?: boolean
  sortField?: string
  sortDirection?: SortDirection
  onSort?: (field: string) => void
}

// 表格属性接口
export interface TableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  className?: string
  emptyText?: ReactNode
  headerHeight?: number // 表头高度，默认18px
  rowHeight?: number // 表体行高，默认44px
  rowGap?: number // 行间距，默认20px
  headerBodyGap?: number // 表头和表体之间的间距，默认20px
  showPagination?: boolean // 是否显示翻页器，仅在总页数大于1时显示
  showPageSizeSelector?: boolean // 是否显示每页条数选择器，默认true，仅在有多页时生效
  pageIndex?: number // 当前页码
  totalSize?: number // 总数据条数
  pageSize?: number // 每页条数，默认10
  onPageChange?: (page: number) => void // 翻页回调
  onPageSizeChange?: (pageSize: number) => void // 每页条数变化回调
  onRowClick?: (record: T, index: number) => void // 行点击回调
}

// 排序钩子返回值
export interface UseSortResult {
  sortState: SortState
  handleSort: (field: string) => void
}

import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { ReactNode, useMemo } from 'react'
import styled, { css } from 'styled-components'
import Select, { DataType, TriggerMethod } from 'components/Select'

// 最外层容器
const TableContainer = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 100%;
`

// 表格滚动容器
const TableScrollContainer = styled.div`
  flex: 1;
  overflow: auto;
  min-height: 0; /* 确保可以缩小 */
`

// 表格样式
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  min-width: max-content; /* 确保表格至少有内容所需的宽度 */
`

// 表头样式 - 使用sticky定位保持固定
const TableHeader = styled.thead`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: ${({ theme }) => theme.black800}; /* 确保表头有背景色 */
`

// 表头行样式
const TableHeaderRow = styled.tr<{ $headerHeight?: number }>`
  height: ${(props) => props.$headerHeight ?? 18}px;
`

// 表头单元格样式
const TableHeaderCell = styled.th<{ $align?: 'left' | 'center' | 'right'; $isFirst?: boolean; $isLast?: boolean }>`
  font-weight: 500;
  text-align: ${(props) => props.$align || 'left'};
  white-space: nowrap;
  color: ${({ theme }) => theme.black200};
  padding: 0;
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;

  /* 添加右边距，但最后一列除外 */
  padding-right: ${(props) => (!props.$isLast ? '12px' : '0')};

  /* 第一列左边和最后一列右边不需要间距 */
  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }
  ${({ theme }) =>
    theme.isMobile
      ? css`
          font-size: 13px;
          font-weight: 400;
          line-height: 20px;
        `
      : css``}
`

// 表头和表体之间的间距行
const HeaderBodyGapRow = styled.tr<{ gap?: number }>`
  height: ${(props) => props.gap ?? 20}px;
`

// 表体样式
const TableBody = styled.tbody<{ $rowGap?: number }>`
  /* 设置行间距 */
  & > tr:not(:last-child) {
    margin-bottom: ${(props) => props.$rowGap ?? 20}px;

    & > td {
      padding-bottom: ${(props) => props.$rowGap ?? 20}px;
    }
  }
`

// 表体行样式
const TableRow = styled.tr<{ $rowHeight?: number }>`
  height: ${(props) => props.$rowHeight ?? 44}px;

  &:last-child {
    border-bottom: none;
  }
  td {
    transition: all ${ANI_DURATION}s;
    &:first-child {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }
    &:last-child {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }
  ${({ theme }) =>
    theme.isMobile
      ? css`
          &:active {
            td {
              background-color: ${({ theme }) => theme.black900};
            }
          }
        `
      : css`
          &:hover {
            td {
              background-color: ${({ theme }) => theme.black800};
            }
          }
        `}
`

// 表体单元格样式
const TableCell = styled.td<{ $align?: 'left' | 'center' | 'right'; $isFirst?: boolean; $isLast?: boolean }>`
  text-align: ${(props) => props.$align || 'left'};
  color: ${({ theme }) => theme.black100};
  padding: 0;
  margin: 0;
  vertical-align: middle;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;

  /* 添加右边距，但最后一列除外 */
  padding-right: ${(props) => (!props.$isLast ? '12px' : '0')};

  /* 第一列左边和最后一列右边不需要间距 */
  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }
  ${({ theme }) =>
    theme.isMobile
      ? css`
          font-size: 13px;
          font-weight: 400;
          line-height: 20px;
        `
      : css``}
`

// 空白单元格
const EmptyCell = styled.td`
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
`

// 翻页器容器
const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  gap: 8px;
`

// 翻页器左侧容器
const PaginationLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

// 翻页器右侧容器
const PaginationRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

// Rows per page 标签
const RowsPerPageLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.black200};
  white-space: nowrap;
`

// 自定义 Select 样式
const PageSizeSelect = styled.div`
  .select-wrapper {
    height: 24px;
  }
  .select-border-wrapper {
    padding: 4px 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .icon-chat-expand-down {
    color: ${({ theme }) => theme.black200};
  }
`

// 选中的页面大小文本
const PageSizeText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.black200};
  font-weight: 500;
`

// 翻页按钮
const PaginationButton = styled.button<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: all 0.2s;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  background-color: transparent;
  .icon-expand {
    font-size: 14px;
    color: ${({ theme, $disabled }) => ($disabled ? theme.black300 : theme.black200)};
  }
`

// 页码按钮
const PageButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  background: ${({ theme, $isActive }) => ($isActive ? theme.brand100 : 'transparent')};
  color: ${({ theme, $isActive }) => ($isActive ? theme.black0 : theme.black100)};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
`

// 省略号
const Ellipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  color: ${({ theme }) => theme.black200};
  font-size: 12px;
`

// 列定义接口
export interface ColumnDef<T> {
  key: string
  title: ReactNode
  width?: string
  render?: (record: T, index: number) => ReactNode
  align?: 'left' | 'center' | 'right'
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

// 表格组件
function Table<T extends Record<string, any>>({
  data,
  columns,
  className,
  emptyText = '',
  headerHeight,
  rowHeight,
  rowGap,
  headerBodyGap,
  showPagination = false,
  showPageSizeSelector = true,
  pageIndex = 1,
  totalSize = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onRowClick,
}: TableProps<T>) {
  const scrollRef = useScrollbarClass<HTMLDivElement>()
  // 为最后一列设置右对齐
  const processedColumns = useMemo(() => {
    return columns.map((column, index) => {
      if (index === columns.length - 1 && !column.align) {
        return { ...column, align: 'right' as const }
      }
      return column
    })
  }, [columns])

  // 计算翻页相关数据
  const totalPages = useMemo(() => {
    return Math.ceil(totalSize / pageSize)
  }, [totalSize, pageSize])

  const canPrevious = pageIndex > 1
  const canNext = pageIndex < totalPages

  // 翻页处理函数
  const handlePrevious = () => {
    if (canPrevious && onPageChange) {
      onPageChange(pageIndex - 1)
    }
  }

  const handleNext = () => {
    if (canNext && onPageChange) {
      onPageChange(pageIndex + 1)
    }
  }

  // 生成页码显示数组
  const generatePageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = []
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      // 总页数少于等于7，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 总页数大于7，使用省略号
      if (pageIndex <= 4) {
        // 当前页在前面
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (pageIndex >= totalPages - 3) {
        // 当前页在后面
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // 当前页在中间
        pages.push(1)
        pages.push('ellipsis')
        for (let i = pageIndex - 1; i <= pageIndex + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }, [pageIndex, totalPages])

  // 处理页码点击
  const handlePageClick = (page: number) => {
    if (page !== pageIndex && onPageChange) {
      onPageChange(page)
    }
  }

  // 页面大小选项
  const pageSizeOptions: DataType[] = useMemo(
    () => [
      {
        text: '10',
        value: 10,
        isActive: false,
        clickCallback: (value: number) => {
          onPageSizeChange?.(value)
        },
      },
      {
        text: '20',
        value: 20,
        isActive: false,
        clickCallback: (value: number) => {
          onPageSizeChange?.(value)
        },
      },
      {
        text: '50',
        value: 50,
        isActive: false,
        clickCallback: (value: number) => {
          onPageSizeChange?.(value)
        },
      },
    ],
    [onPageSizeChange],
  )

  // 创建colgroup元素
  const renderColGroup = () => (
    <colgroup>
      {processedColumns.map((column, index) => (
        <col key={`col-${column.key}`} style={{ width: column.width || 'auto' }} />
      ))}
    </colgroup>
  )

  return (
    <TableContainer className={className}>
      <TableScrollContainer ref={scrollRef} className='table-scroll-container scroll-style'>
        <StyledTable>
          {renderColGroup()}
          <TableHeader className='table-header'>
            <TableHeaderRow $headerHeight={headerHeight} className='header-container'>
              {processedColumns.map((column, colIndex) => (
                <TableHeaderCell
                  key={column.key}
                  $align={column.align}
                  $isFirst={colIndex === 0}
                  $isLast={colIndex === processedColumns.length - 1}
                >
                  {column.title}
                </TableHeaderCell>
              ))}
            </TableHeaderRow>
            {/* 表头和表体之间的间距行 */}
            {headerBodyGap !== 0 && <HeaderBodyGapRow gap={headerBodyGap} />}
          </TableHeader>

          <TableBody className='table-body' $rowGap={rowGap}>
            {data.length > 0 ? (
              data.map((record, rowIndex) => (
                <TableRow
                  className='table-row'
                  key={rowIndex}
                  $rowHeight={rowHeight}
                  onClick={() => onRowClick?.(record, rowIndex)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {processedColumns.map((column, colIndex) => (
                    <TableCell
                      className='table-cell'
                      key={`${rowIndex}-${column.key}`}
                      $align={column.align}
                      $isFirst={colIndex === 0}
                      $isLast={colIndex === processedColumns.length - 1}
                    >
                      {column.render ? column.render(record, rowIndex) : record[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow $rowHeight={rowHeight}>
                <TableCell colSpan={processedColumns.length} $align='center'>
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </StyledTable>
      </TableScrollContainer>

      {/* 翻页器 */}
      {showPagination && totalPages > 1 && (
        <PaginationContainer
          className='table-pagination'
          style={{ justifyContent: showPageSizeSelector ? 'space-between' : 'flex-end' }}
        >
          {/* 左侧：Rows per page */}
          {showPageSizeSelector && (
            <PaginationLeft>
              <RowsPerPageLabel>Rows per page</RowsPerPageLabel>
              <PageSizeSelect>
                <Select
                  value={pageSize}
                  dataList={pageSizeOptions}
                  triggerMethod={TriggerMethod.CLICK}
                  placement='top-start'
                  usePortal={true}
                  popStyle={{ width: '48px', borderRadius: '4px' }}
                  popItemStyle={{ borderRadius: '4px' }}
                >
                  <PageSizeText>{pageSize}</PageSizeText>
                </Select>
              </PageSizeSelect>
            </PaginationLeft>
          )}

          {/* 右侧：页码导航 */}
          <PaginationRight>
            <PaginationButton $disabled={!canPrevious} disabled={!canPrevious} onClick={handlePrevious}>
              <IconBase className='icon-expand' style={{ transform: 'rotate(90deg)' }} />
            </PaginationButton>

            {generatePageNumbers.map((page, index) => {
              if (page === 'ellipsis') {
                return <Ellipsis key={`ellipsis-${index}`}>···</Ellipsis>
              }

              return (
                <PageButton key={page} $isActive={page === pageIndex} onClick={() => handlePageClick(page)}>
                  {page}
                </PageButton>
              )
            })}

            <PaginationButton $disabled={!canNext} disabled={!canNext} onClick={handleNext}>
              <IconBase className='icon-expand' style={{ transform: 'rotate(-90deg)' }} />
            </PaginationButton>
          </PaginationRight>
        </PaginationContainer>
      )}
    </TableContainer>
  )
}

export default Table

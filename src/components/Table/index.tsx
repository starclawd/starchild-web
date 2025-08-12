import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { ReactNode, useMemo } from 'react'
import styled, { css } from 'styled-components'

// 表格容器
const TableContainer = styled.div`
  width: 100%;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 100%;
`

// 表格内容容器
const TableScrollContainer = styled.div`
  flex: 1;
`

// 表格样式
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  overflow: hidden;
`

// 表头容器
const HeaderContainer = styled.div`
  width: 100%;
`

// 表头样式
const TableHeader = styled.thead``

// 表头行样式
const TableHeaderRow = styled.tr<{ headerHeight?: number }>`
  height: ${(props) => props.headerHeight ?? 18}px;
`

// 表头单元格样式
const TableHeaderCell = styled.th<{ $align?: 'left' | 'center' | 'right'; $isFirst?: boolean; $isLast?: boolean }>`
  font-weight: 500;
  text-align: ${(props) => props.$align || 'left'};
  white-space: nowrap;
  color: ${({ theme }) => theme.textL3};
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
const TableBody = styled.tbody<{ rowGap?: number }>`
  /* 设置行间距 */
  & > tr:not(:last-child) {
    margin-bottom: ${(props) => props.rowGap ?? 20}px;

    & > td {
      padding-bottom: ${(props) => props.rowGap ?? 20}px;
    }
  }
`

// 表体行样式
const TableRow = styled.tr<{ rowHeight?: number }>`
  height: ${(props) => props.rowHeight ?? 44}px;

  &:last-child {
    border-bottom: none;
  }
  td {
    transition: all ${ANI_DURATION}s;
    &:first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }
    &:last-child {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }
  ${({ theme }) =>
    theme.isMobile
      ? css`
          &:active {
            td {
              background-color: ${({ theme }) => theme.bgT10};
            }
          }
        `
      : css`
          &:hover {
            td {
              background-color: ${({ theme }) => theme.bgT10};
            }
          }
        `}
`

// 表体单元格样式
const TableCell = styled.td<{ $align?: 'left' | 'center' | 'right'; $isFirst?: boolean; $isLast?: boolean }>`
  text-align: ${(props) => props.$align || 'left'};
  color: ${({ theme }) => theme.textL2};
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
  justify-content: flex-end;
  align-items: center;
  padding: 8px 0;
  gap: 8px;
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
  .icon-chat-expand {
    font-size: 14px;
    color: ${({ theme, $disabled }) => ($disabled ? theme.textL4 : theme.textDark54)};
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
  color: ${({ theme, $isActive }) => ($isActive ? theme.textDark98 : theme.textDark80)};
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
  color: ${({ theme }) => theme.textL3};
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
  showPagination?: boolean // 是否显示翻页器
  pageIndex?: number // 当前页码
  totalSize?: number // 总数据条数
  pageSize?: number // 每页条数，默认10
  onPageChange?: (page: number) => void // 翻页回调
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
  pageIndex = 1,
  totalSize = 0,
  pageSize = 10,
  onPageChange,
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
      <HeaderContainer className='header-container'>
        <StyledTable>
          {renderColGroup()}
          <TableHeader>
            <TableHeaderRow headerHeight={headerHeight}>
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
          </TableHeader>
        </StyledTable>
      </HeaderContainer>

      {/* 表头和表体之间的间距 */}
      {headerBodyGap !== 0 && <div style={{ height: headerBodyGap ?? 20 }} />}

      <TableScrollContainer ref={scrollRef} className='table-scroll-container scroll-style'>
        <StyledTable>
          {renderColGroup()}
          <TableBody className='table-body' rowGap={rowGap}>
            {data.length > 0 ? (
              data.map((record, rowIndex) => (
                <TableRow className='table-row' key={rowIndex} rowHeight={rowHeight}>
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
              <TableRow rowHeight={rowHeight}>
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
        <PaginationContainer className='table-pagination'>
          <PaginationButton $disabled={!canPrevious} disabled={!canPrevious} onClick={handlePrevious}>
            <IconBase className='icon-chat-expand' style={{ transform: 'rotate(180deg)' }} />
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
            <IconBase className='icon-chat-expand' />
          </PaginationButton>
        </PaginationContainer>
      )}
    </TableContainer>
  )
}

export default Table

import React, { ReactNode } from 'react';
import styled from 'styled-components';

// 表格容器
const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

// 表格样式
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
`;

// 表头样式
const TableHeader = styled.thead`
`;

// 表头行样式
const TableHeaderRow = styled.tr<{ headerHeight?: number }>`
  height: ${props => props.headerHeight ?? 18}px;
`;

// 表头单元格样式
const TableHeaderCell = styled.th<{ width?: string; align?: 'left' | 'center' | 'right'; $isFirst?: boolean; $isLast?: boolean }>`
  font-weight: 500;
  text-align: ${props => props.align || 'left'};
  white-space: nowrap;
  color: ${({ theme }) => theme.textL3};
  padding: 0;
  margin: 0;
  ${props => props.width ? `width: ${props.width};` : 'width: auto;'}
  
  /* 添加右边距，但最后一列除外 */
  padding-right: ${props => !props.$isLast ? '12px' : '0'};
  
  /* 第一列左边和最后一列右边不需要间距 */
  &:first-child {
    padding-left: 0;
  }
  
  &:last-child {
    padding-right: 0;
  }
`;

// 表头和表体之间的间距行
const HeaderBodyGapRow = styled.tr<{ gap?: number }>`
  height: ${props => props.gap ?? 20}px;
`;

// 表体样式
const TableBody = styled.tbody<{ rowGap?: number }>`
  /* 设置行间距 */
  & > tr:not(:last-child) {
    margin-bottom: ${props => props.rowGap ?? 20}px;
    
    & > td {
      padding-bottom: ${props => props.rowGap ?? 20}px;
    }
  }
`;

// 表体行样式
const TableRow = styled.tr<{ rowHeight?: number }>`
  height: ${props => props.rowHeight ?? 44}px;
  
  &:last-child {
    border-bottom: none;
  }
`;

// 表体单元格样式
const TableCell = styled.td<{ align?: 'left' | 'center' | 'right'; $isFirst?: boolean; $isLast?: boolean }>`
  text-align: ${props => props.align || 'left'};
  color: ${({ theme }) => theme.textL2};
  padding: 0;
  margin: 0;
  vertical-align: middle;
  
  /* 添加右边距，但最后一列除外 */
  padding-right: ${props => !props.$isLast ? '12px' : '0'};
  
  /* 第一列左边和最后一列右边不需要间距 */
  &:first-child {
    padding-left: 0;
  }
  
  &:last-child {
    padding-right: 0;
  }
`;

// 空白单元格
const EmptyCell = styled.td`
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
`;

// 列定义接口
export interface ColumnDef<T> {
  key: string;
  title: ReactNode;
  width?: string;
  render?: (record: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

// 表格属性接口
export interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
  emptyText?: ReactNode;
  headerHeight?: number; // 表头高度，默认18px
  rowHeight?: number; // 表体行高，默认44px
  rowGap?: number; // 行间距，默认20px
  headerBodyGap?: number; // 表头和表体之间的间距，默认20px
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
}: TableProps<T>) {
  // 为最后一列设置右对齐
  const processedColumns = columns.map((column, index) => {
    if (index === columns.length - 1 && !column.align) {
      return { ...column, align: 'right' as const };
    }
    return column;
  });

  return (
    <TableContainer className={className}>
      <StyledTable>
        <TableHeader>
          <TableHeaderRow headerHeight={headerHeight}>
            {processedColumns.map((column, colIndex) => (
              <TableHeaderCell 
                key={column.key} 
                width={column.width}
                align={column.align}
                $isFirst={colIndex === 0}
                $isLast={colIndex === processedColumns.length - 1}
              >
                {column.title}
              </TableHeaderCell>
            ))}
          </TableHeaderRow>
        </TableHeader>
        {/* 表头和表体之间的间距 */}
        {headerBodyGap !== 0 && (
          <tbody>
            <HeaderBodyGapRow gap={headerBodyGap}>
              <EmptyCell colSpan={processedColumns.length} />
            </HeaderBodyGapRow>
          </tbody>
        )}
        <TableBody rowGap={rowGap}>
          {data.length > 0 ? (
            data.map((record, rowIndex) => (
              <TableRow key={rowIndex} rowHeight={rowHeight}>
                {processedColumns.map((column, colIndex) => (
                  <TableCell 
                    key={`${rowIndex}-${column.key}`}
                    align={column.align}
                    $isFirst={colIndex === 0}
                    $isLast={colIndex === processedColumns.length - 1}
                  >
                    {column.render 
                      ? column.render(record, rowIndex)
                      : record[column.key]
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow rowHeight={rowHeight}>
              <TableCell 
                colSpan={processedColumns.length}
                align="center"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
}

export default Table; 
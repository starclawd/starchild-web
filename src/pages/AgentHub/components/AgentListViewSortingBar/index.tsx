import styled from 'styled-components'
import { memo, useCallback } from 'react'
import { Trans } from '@lingui/react/macro'
import { useListViewSorting } from 'store/agenthub/hooks'
import { ListViewSortingColumn, ListViewSortingOrder } from 'store/agenthub/agenthub'
import { vm } from 'pages/helper'

const SortingBarContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  gap: 24px;

  ${({ theme }) =>
    theme.isMobile &&
    `
    gap: ${vm(24)};
  `}
`

const SortableColumn = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  user-select: none;
  color: ${({ theme, $isActive }) => ($isActive ? theme.textL2 : theme.textL4)};
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  transition: color 0.2s ease;

  ${({ theme }) =>
    theme.isMobile
      ? `
    gap: ${vm(4)};
    font-size: 0.13rem;
    line-height: 0.2rem;
    cursor: default;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    
    /* 移动端使用active状态替代hover */
    &:active {
      color: ${theme.textL3};
    }
  `
      : `
    cursor: pointer;
    /* PC端使用hover状态 */
    &:hover {
      color: ${theme.textL3};
    }
  `}
`

const SortIcon = styled.div<{ order: ListViewSortingOrder | null }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 10px;
  position: relative;

  ${({ theme }) =>
    theme.isMobile &&
    `
    width: ${vm(10)};
    height: ${vm(10)};
  `}

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    transition: opacity 0.2s ease;

    ${({ theme }) =>
      theme.isMobile &&
      `
      border-left-width: ${vm(3)};
      border-right-width: ${vm(3)};
    `}
  }

  &::before {
    border-bottom: 4px solid ${({ theme, order }) => (order === ListViewSortingOrder.ASC ? theme.textL1 : theme.textL3)};
    top: 0;
    opacity: ${({ order }) => (order === ListViewSortingOrder.ASC ? 1 : 0.5)};

    ${({ theme }) =>
      theme.isMobile &&
      `
      border-bottom-width: ${vm(4)};
    `}
  }

  &::after {
    border-top: 4px solid ${({ theme, order }) => (order === ListViewSortingOrder.DESC ? theme.textL1 : theme.textL3)};
    bottom: 0;
    opacity: ${({ order }) => (order === ListViewSortingOrder.DESC ? 1 : 0.5)};

    ${({ theme }) =>
      theme.isMobile &&
      `
      border-top-width: ${vm(4)};
    `}
  }
`

const sortableColumns = [
  {
    key: ListViewSortingColumn.UPDATED_TIME,
    label: <Trans>Updated time</Trans>,
  },
  {
    key: ListViewSortingColumn.CREATED_TIME,
    label: <Trans>Created time</Trans>,
  },
  {
    key: ListViewSortingColumn.SUBSCRIPTIONS,
    label: <Trans>Subscriptions</Trans>,
  },
]

export default memo(function AgentListViewSortingBar() {
  const { sortingColumn, sortingOrder, handleSort } = useListViewSorting()

  const handleColumnClick = useCallback(
    (column: ListViewSortingColumn) => {
      handleSort(column)
    },
    [handleSort],
  )

  return (
    <SortingBarContainer>
      {sortableColumns.map((column) => (
        <SortableColumn
          key={column.key}
          $isActive={sortingColumn === column.key}
          onClick={() => handleColumnClick(column.key)}
        >
          {column.label}
          <SortIcon order={sortingColumn === column.key ? sortingOrder : null} />
        </SortableColumn>
      ))}
    </SortingBarContainer>
  )
})

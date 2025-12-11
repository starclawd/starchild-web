import { memo } from 'react'
import styled from 'styled-components'
import { IconBase } from 'components/Icons'
import { SortDirection } from '../types'

// 排序箭头容器
const SortArrowsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 6px;
`

// 排序箭头
const SortArrow = styled(IconBase)<{ $isActive: boolean }>`
  font-size: 8px;
  color: ${({ theme, $isActive }) => ($isActive ? theme.textL1 : theme.textL3)};
  cursor: pointer;
  transition: color 0.2s ease;
`

// 表头可点击容器
const SortableHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;

  &:hover {
    .sort-arrow {
      opacity: 0.7;
    }
  }
`

// 排序箭头组件
interface SortArrowsProps {
  direction: SortDirection
  onClick: () => void
}

export const SortArrows = memo<SortArrowsProps>(({ direction, onClick }) => {
  return (
    <SortArrowsContainer onClick={onClick}>
      <SortArrow
        className='icon-tooltip-arrow sort-arrow'
        $isActive={direction === SortDirection.ASC}
        style={{ transform: 'rotate(180deg)' }}
      />
      <SortArrow className='icon-tooltip-arrow sort-arrow' $isActive={direction === SortDirection.DESC} />
    </SortArrowsContainer>
  )
})

SortArrows.displayName = 'SortArrows'

// 可排序表头容器组件
interface SortableHeaderProps {
  children: React.ReactNode
  onClick: () => void
}

export const SortableHeader = memo<SortableHeaderProps>(({ children, onClick }) => {
  return <SortableHeaderContainer onClick={onClick}>{children}</SortableHeaderContainer>
})

SortableHeader.displayName = 'SortableHeader'

import { memo } from 'react'
import styled, { useTheme } from 'styled-components'
import { SortDirection } from '../types'
import { ANI_DURATION } from 'constants/index'

// 排序箭头容器
const SortArrowsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 6px;
  cursor: pointer;
  transition: opacity ${ANI_DURATION}s;

  &:hover {
    opacity: 0.7;
  }
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

// 排序箭头 SVG 组件
interface SortArrowsSvgProps {
  upColor: string
  downColor: string
}

const SortArrowsSvg = memo<SortArrowsSvgProps>(({ upColor, downColor }) => {
  return (
    <svg
      className='sort-arrow'
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      {/* 上箭头 */}
      <path
        d='M8.95 9.04998L7.5 7.59998L12 3.09998L16.5 7.59998L15.05 9.04998L12 5.99998L8.95 9.04998Z'
        fill={upColor}
      />
      {/* 下箭头 */}
      <path d='M12 21L7.5 16.5L8.95 15.05L12 18.1L15.05 15.05L16.5 16.5L12 21Z' fill={downColor} />
    </svg>
  )
})

SortArrowsSvg.displayName = 'SortArrowsSvg'

// 排序箭头组件
interface SortArrowsProps {
  direction: SortDirection
  onClick: () => void
}

export const SortArrows = memo<SortArrowsProps>(({ direction, onClick }) => {
  const theme = useTheme()

  // 根据排序方向决定箭头颜色
  const upColor = direction === SortDirection.ASC ? theme.black0 : theme.black300
  const downColor = direction === SortDirection.DESC ? theme.black0 : theme.black300

  return (
    <SortArrowsContainer onClick={onClick}>
      <SortArrowsSvg upColor={upColor} downColor={downColor} />
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

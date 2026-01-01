import { memo } from 'react'
import styled, { useTheme } from 'styled-components'
import { SortDirection } from '../types'

// 排序箭头容器
const SortArrowsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 6px;
  cursor: pointer;
  transition: opacity 0.2s ease;

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

// 像素风格排序箭头 SVG 组件
interface SortArrowsSvgProps {
  upColor: string
  downColor: string
}

const SortArrowsSvg = memo<SortArrowsSvgProps>(({ upColor, downColor }) => {
  // 像素大小
  const px = 1

  return (
    <svg
      className='sort-arrow'
      width={7 * px}
      height={11 * px}
      viewBox={`0 0 ${7 * px} ${11 * px}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      style={{ shapeRendering: 'crispEdges' }}
    >
      {/* 上箭头 - 像素风格（空心） */}
      {/* 第1行: 中间1个像素 */}
      <rect x={3 * px} y={0} width={px} height={px} fill={upColor} />
      {/* 第2行: 两侧2个像素 */}
      <rect x={2 * px} y={1 * px} width={px} height={px} fill={upColor} />
      <rect x={4 * px} y={1 * px} width={px} height={px} fill={upColor} />
      {/* 第3行: 两侧2个像素 */}
      <rect x={1 * px} y={2 * px} width={px} height={px} fill={upColor} />
      <rect x={5 * px} y={2 * px} width={px} height={px} fill={upColor} />
      {/* 第4行: 最外侧2个像素 */}
      <rect x={0} y={3 * px} width={px} height={px} fill={upColor} />
      <rect x={6 * px} y={3 * px} width={px} height={px} fill={upColor} />

      {/* 下箭头 - 像素风格（空心） */}
      {/* 第1行: 最外侧2个像素 */}
      <rect x={0} y={7 * px} width={px} height={px} fill={downColor} />
      <rect x={6 * px} y={7 * px} width={px} height={px} fill={downColor} />
      {/* 第2行: 两侧2个像素 */}
      <rect x={1 * px} y={8 * px} width={px} height={px} fill={downColor} />
      <rect x={5 * px} y={8 * px} width={px} height={px} fill={downColor} />
      {/* 第3行: 两侧2个像素 */}
      <rect x={2 * px} y={9 * px} width={px} height={px} fill={downColor} />
      <rect x={4 * px} y={9 * px} width={px} height={px} fill={downColor} />
      {/* 第4行: 中间1个像素 */}
      <rect x={3 * px} y={10 * px} width={px} height={px} fill={downColor} />
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
  const upColor = direction === SortDirection.ASC ? theme.textL1 : theme.textL4
  const downColor = direction === SortDirection.DESC ? theme.textL1 : theme.textL4

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

import { memo, useMemo } from 'react'
import styled from 'styled-components'

const ChartContainer = styled.div`
  width: 100%;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const PixelCanvas = styled.svg`
  width: 100%;
  height: 100%;
`

export interface SnapshotDataPoint {
  t: number // timestamp
  b: number // balance
}

interface SnapshotProps {
  data: SnapshotDataPoint[]
}

const GRID_COLS = 60 // 横向格子数
const GRID_ROWS = 14 // 纵向格子数
const PIXEL_SIZE = 1.5 // 每个像素块的大小

const Snapshot = memo<SnapshotProps>(({ data }) => {
  // 按时间戳 t 正序排列
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) {
      return []
    }
    return [...data].sort((a, b) => a.t - b.t)
  }, [data])

  // 根据排序后第一个和最后一个数据的差值判断正负
  const isPositive = useMemo(() => {
    if (sortedData.length < 2) {
      return true
    }
    const firstBalance = sortedData[0].b
    const lastBalance = sortedData[sortedData.length - 1].b
    return lastBalance >= firstBalance
  }, [sortedData])

  const pixels = useMemo(() => {
    if (sortedData.length === 0) {
      return []
    }

    // 提取余额值
    const balances = sortedData.map((d) => d.b)
    const minBalance = Math.min(...balances)
    const maxBalance = Math.max(...balances)
    const range = maxBalance - minBalance || 1

    // 将数据点映射到网格
    const result: { x: number; y: number }[] = []

    let prevY: number | null = null

    for (let i = 0; i < GRID_COLS; i++) {
      const dataIndex = Math.min(Math.floor((i / GRID_COLS) * sortedData.length), sortedData.length - 1)
      const balance = sortedData[dataIndex]?.b ?? minBalance

      // 归一化到网格行数（反转Y轴，使较高值在顶部）
      const normalizedY = Math.floor(((balance - minBalance) / range) * (GRID_ROWS - 1))
      const y = GRID_ROWS - 1 - normalizedY

      // 添加当前点
      result.push({ x: i, y })

      // 如果与上一个点有垂直差距，填充中间的像素实现阶梯效果
      if (prevY !== null && prevY !== y) {
        const minY = Math.min(prevY, y)
        const maxY = Math.max(prevY, y)
        for (let fillY = minY + 1; fillY < maxY; fillY++) {
          result.push({ x: i, y: fillY })
        }
      }

      prevY = y
    }

    return result
  }, [sortedData])

  const color = isPositive ? '#4ADE80' : '#EF4444'

  const viewBoxWidth = GRID_COLS * PIXEL_SIZE
  const viewBoxHeight = GRID_ROWS * PIXEL_SIZE

  return (
    <ChartContainer>
      <PixelCanvas viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} preserveAspectRatio='none'>
        {pixels.map((pixel, index) => (
          <rect
            key={index}
            x={pixel.x * PIXEL_SIZE}
            y={pixel.y * PIXEL_SIZE}
            width={PIXEL_SIZE}
            height={PIXEL_SIZE}
            fill={color}
          />
        ))}
      </PixelCanvas>
    </ChartContainer>
  )
})

Snapshot.displayName = 'Snapshot'

export default Snapshot

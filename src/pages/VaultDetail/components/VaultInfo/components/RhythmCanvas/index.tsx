import { memo, useEffect, useRef } from 'react'
import styled from 'styled-components'

const CELL_SIZE = 6
const COLS = 40 // 240 / 6
const ROWS = 4 // 24 / 6
const COLORS = ['#C63A00', '#8F2A00']

const RhythmCanvasWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 240px;
  height: 24px;
`

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
`

// 计算基础高度曲线：两边高中间低 (U形曲线)
const getBaseHeight = (col: number): number => {
  const center = (COLS - 1) / 2
  const distance = Math.abs(col - center) / center // 0 到 1，中间是 0，两边是 1
  // 基础高度：两边最高 4，中间最低 0
  return distance * 4
}

export default memo(function RhythmCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const colorsRef = useRef<number[][]>([])
  const randomOffsetsRef = useRef<number[]>([])
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 为每列生成随机偏移，让高度参差不齐
    randomOffsetsRef.current = Array.from(
      { length: COLS },
      (_) => Math.floor(Math.random() * 3) - 1, // -1, 0, 1
    )

    // 初始化颜色网格
    colorsRef.current = Array.from({ length: ROWS }, (_) =>
      Array.from({ length: COLS }, (_) => Math.floor(Math.random() * 2)),
    )

    let lastUpdate = 0
    const updateInterval = 200

    const animate = (time: number) => {
      // 定期随机更新部分列的偏移和颜色
      if (time - lastUpdate >= updateInterval) {
        lastUpdate = time

        // 随机更新几列的高度偏移
        const colsToUpdate = Math.floor(COLS * 0.15)
        for (let i = 0; i < colsToUpdate; i++) {
          const col = Math.floor(Math.random() * COLS)
          randomOffsetsRef.current[col] = Math.floor(Math.random() * 3) - 1
        }

        // 随机更新部分色块颜色
        const colorUpdates = Math.floor(COLS * ROWS * 0.1)
        for (let i = 0; i < colorUpdates; i++) {
          const row = Math.floor(Math.random() * ROWS)
          const col = Math.floor(Math.random() * COLS)
          colorsRef.current[row][col] = Math.floor(Math.random() * 2)
        }
      }

      // 计算每列高度
      const heights: number[] = []
      for (let col = 0; col < COLS; col++) {
        const baseHeight = getBaseHeight(col)
        const randomOffset = randomOffsetsRef.current[col]
        // 加入时间波动，但幅度小
        const wave = Math.sin(time * 0.001 + col * 0.8) * 0.5
        heights[col] = Math.max(0, Math.min(ROWS, Math.round(baseHeight + randomOffset + wave)))
      }

      // 绘制
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let col = 0; col < COLS; col++) {
        const height = heights[col]
        if (height === 0) continue
        // 从底部向上绘制 height 个色块
        for (let h = 0; h < height; h++) {
          const row = ROWS - 1 - h
          const colorIndex = colorsRef.current[row][col]
          ctx.fillStyle = COLORS[colorIndex]
          ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <RhythmCanvasWrapper>
      <Canvas ref={canvasRef} width={240} height={24} />
    </RhythmCanvasWrapper>
  )
})

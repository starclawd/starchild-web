import { memo, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const BLOCK_SIZE = 112
const LIGHT_OUTER_RADIUS = 500 // 照亮效果的外圈半径
const CSS_BLUR_NORMAL = 10 // 正常模糊强度（像素）
const CSS_BLUR_EXTRA = 20 // 额外模糊强度（像素）
const COLOR_LERP_SPEED = 0.03 // 颜色过渡速度（0-1，越小越慢）
const CENTER_LERP_SPEED = 0.04 // 中心点跟随速度（0-1，越小越慢）
const COLOR_CHANGE_PROBABILITY = 0.005 // 每帧每个色块变化颜色的概率
const BLUR_GRADIENT_HEIGHT = 300 // 模糊渐变过渡区域高度（像素）

// 预设的颜色调色板
const COLOR_PALETTE = [
  '#000000',
  '#7A2200',
  '#FF5E1F',
  '#F84600',
  '#330E00',
  '#D74012',
  '#9F4917',
  '#000000',
  '#7A2200',
  '#330E00',
  '#7A2200',
  '#FF8513',
  '#000000',
  '#FFFFFF',
  '#F84600',
  '#000000',
  '#000000',
  '#7A2200',
  '#7A2200',
  '#000000',
  '#FF5E1F',
  '#000000',
  '#000000',
  '#000000',
  '#000000',
  '#000000',
  '#000000',
  '#000000',
]

const PixelCanvasWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: ${({ theme }) => theme.black1000};
`

const CanvasBase = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  transform: scale(1.1); /* 放大一点以避免边缘出现黑边 */
  pointer-events: none;
`

const CanvasNormal = styled(CanvasBase)`
  filter: blur(${CSS_BLUR_NORMAL}px);
`

const CanvasBlurred = styled(CanvasBase)<{ $maskY: number }>`
  filter: blur(${CSS_BLUR_EXTRA}px);
  mask-image: ${({ $maskY }) =>
    `linear-gradient(to bottom, transparent ${$maskY}px, black ${$maskY + BLUR_GRADIENT_HEIGHT}px)`};
  -webkit-mask-image: ${({ $maskY }) =>
    `linear-gradient(to bottom, transparent ${$maskY}px, black ${$maskY + BLUR_GRADIENT_HEIGHT}px)`};
`

const BlackMask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(11, 12, 14, 0.2);
  z-index: 3;
`

interface RGBA {
  r: number
  g: number
  b: number
  a: number
}

interface Block {
  x: number
  y: number
  currentColor: RGBA
  targetColor: RGBA
  opacity: number
}

// 将 hex 颜色转换为 RGBA
function hexToRgba(hex: string): RGBA {
  // 处理透明色
  if (hex === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0 }
  }
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 1,
      }
    : { r: 0, g: 0, b: 0, a: 1 }
}

// RGBA 转换为 CSS 颜色字符串
function rgbaToString(rgba: RGBA): string {
  return `rgba(${Math.round(rgba.r)}, ${Math.round(rgba.g)}, ${Math.round(rgba.b)}, ${rgba.a})`
}

// 线性插值
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

// RGBA 颜色插值
function lerpColor(current: RGBA, target: RGBA, t: number): RGBA {
  return {
    r: lerp(current.r, target.r, t),
    g: lerp(current.g, target.g, t),
    b: lerp(current.b, target.b, t),
    a: lerp(current.a, target.a, t),
  }
}

export default memo(function PixelCanvas() {
  const canvasNormalRef = useRef<HTMLCanvasElement>(null)
  const canvasBlurredRef = useRef<HTMLCanvasElement>(null)
  const blocksRef = useRef<Block[][]>([])
  const currentCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const targetCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const isHoveringRef = useRef(false)
  const animationFrameRef = useRef<number>(0)
  const [maskY, setMaskY] = useState(window.innerHeight / 2)

  // 获取随机颜色（返回 RGBA）
  const getRandomColor = useCallback(() => {
    const hex = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]
    return hexToRgba(hex)
  }, [])

  // 计算距离中心的距离
  const getDistanceFromCenter = useCallback((blockX: number, blockY: number, centerX: number, centerY: number) => {
    const dx = blockX + BLOCK_SIZE / 2 - centerX
    const dy = blockY + BLOCK_SIZE / 2 - centerY
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  // 初始化色块
  const initBlocks = useCallback(
    (width: number, height: number) => {
      const cols = Math.ceil(width / BLOCK_SIZE)
      const rows = Math.ceil(height / BLOCK_SIZE)
      const blocks: Block[][] = []

      for (let row = 0; row < rows; row++) {
        blocks[row] = []
        for (let col = 0; col < cols; col++) {
          const color = getRandomColor()
          blocks[row][col] = {
            x: col * BLOCK_SIZE,
            y: row * BLOCK_SIZE,
            currentColor: { ...color },
            targetColor: { ...color },
            opacity: 1,
          }
        }
      }

      blocksRef.current = blocks
    },
    [getRandomColor],
  )

  // 绘制画布
  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const blocks = blocksRef.current
    const center = currentCenterRef.current

    // 清空画布
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)

    // 第一层：绘制所有色块（完全不透明）
    ctx.globalAlpha = 1
    for (let row = 0; row < blocks.length; row++) {
      for (let col = 0; col < blocks[row].length; col++) {
        const block = blocks[row][col]
        ctx.fillStyle = rgbaToString(block.currentColor)
        ctx.fillRect(block.x, block.y, BLOCK_SIZE, BLOCK_SIZE)
      }
    }

    // 第二层：绘制黑色蒙层，使用平滑的径向渐变
    // 关键：不要有完全透明的内圈，从中心就开始有轻微遮罩，逐渐加深
    // 这样就不会有明显的亮暗边界
    const gradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, LIGHT_OUTER_RADIUS)

    // 使用 smoothstep 曲线：从中心就开始有轻微透明度，平滑过渡到边缘
    // 中心透明度约 5%，这样就不会有突兀的完全亮区
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.05)')
    gradient.addColorStop(0.1, 'rgba(0, 0, 0, 0.08)')
    gradient.addColorStop(0.2, 'rgba(0, 0, 0, 0.15)')
    gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.25)')
    gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.38)')
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.5)')
    gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.62)')
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.74)')
    gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.84)')
    gradient.addColorStop(0.9, 'rgba(0, 0, 0, 0.92)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.97)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }, [])

  // 更新目标颜色（所有色块都会随机变化）
  const updateTargetColors = useCallback(() => {
    const blocks = blocksRef.current

    // 每帧每个色块都有概率变化颜色
    for (let row = 0; row < blocks.length; row++) {
      for (let col = 0; col < blocks[row].length; col++) {
        const block = blocks[row][col]
        // 随机决定是否变化颜色
        if (Math.random() < COLOR_CHANGE_PROBABILITY) {
          block.targetColor = getRandomColor()
        }
      }
    }
  }, [getRandomColor])

  // 平滑过渡颜色和中心点
  const updateTransitions = useCallback(() => {
    const blocks = blocksRef.current

    // 平滑过渡中心点
    currentCenterRef.current = {
      x: lerp(currentCenterRef.current.x, targetCenterRef.current.x, CENTER_LERP_SPEED),
      y: lerp(currentCenterRef.current.y, targetCenterRef.current.y, CENTER_LERP_SPEED),
    }

    // 平滑过渡每个色块的颜色
    for (let row = 0; row < blocks.length; row++) {
      for (let col = 0; col < blocks[row].length; col++) {
        const block = blocks[row][col]
        block.currentColor = lerpColor(block.currentColor, block.targetColor, COLOR_LERP_SPEED)
      }
    }
  }, [])

  // 动画循环
  const animate = useCallback(() => {
    const canvasNormal = canvasNormalRef.current
    const canvasBlurred = canvasBlurredRef.current
    if (!canvasNormal || !canvasBlurred) return

    const ctxNormal = canvasNormal.getContext('2d')
    const ctxBlurred = canvasBlurred.getContext('2d')
    if (!ctxNormal || !ctxBlurred) return

    updateTargetColors()
    updateTransitions()
    // 绘制到两个 canvas
    draw(ctxNormal, canvasNormal.width, canvasNormal.height)
    draw(ctxBlurred, canvasBlurred.width, canvasBlurred.height)

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [draw, updateTargetColors, updateTransitions])

  // 处理鼠标移动
  const handleMouseMove = useCallback((e: MouseEvent) => {
    isHoveringRef.current = true
    targetCenterRef.current = { x: e.clientX, y: e.clientY }
    setMaskY(e.clientY)
  }, [])

  // 处理鼠标离开 - 保持在最后的位置
  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false
    // 不重置 targetCenterRef，保留鼠标离开时的最后位置
  }, [])

  // 处理窗口大小变化
  const handleResize = useCallback(() => {
    const canvasNormal = canvasNormalRef.current
    const canvasBlurred = canvasBlurredRef.current
    if (!canvasNormal || !canvasBlurred) return

    const width = window.innerWidth
    const height = window.innerHeight

    // 设置 canvas 实际像素大小
    const dpr = window.devicePixelRatio || 1
    canvasNormal.width = width * dpr
    canvasNormal.height = height * dpr
    canvasBlurred.width = width * dpr
    canvasBlurred.height = height * dpr

    // 缩放上下文以匹配 DPR
    const ctxNormal = canvasNormal.getContext('2d')
    const ctxBlurred = canvasBlurred.getContext('2d')
    if (ctxNormal) {
      ctxNormal.scale(dpr, dpr)
    }
    if (ctxBlurred) {
      ctxBlurred.scale(dpr, dpr)
    }

    // 重置中心点
    if (!isHoveringRef.current) {
      const centerX = width / 2
      const centerY = height / 2
      currentCenterRef.current = { x: centerX, y: centerY }
      targetCenterRef.current = { x: centerX, y: centerY }
      setMaskY(centerY)
    }

    // 重新初始化色块
    initBlocks(width, height)
  }, [initBlocks])

  useEffect(() => {
    const canvasNormal = canvasNormalRef.current
    const canvasBlurred = canvasBlurredRef.current
    if (!canvasNormal || !canvasBlurred) return

    // 初始化
    handleResize()

    // 开始动画
    animate()

    // 添加事件监听
    window.addEventListener('resize', handleResize)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [animate, handleMouseLeave, handleMouseMove, handleResize])

  return (
    <PixelCanvasWrapper>
      <CanvasNormal ref={canvasNormalRef} />
      <CanvasBlurred ref={canvasBlurredRef} $maskY={maskY} />
      <BlackMask />
    </PixelCanvasWrapper>
  )
})

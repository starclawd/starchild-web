import { memo, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import svgContent from 'assets/chat/background.svg?raw'
import { ANI_DURATION } from 'constants/index'

const SvgCanvasWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;

  svg {
    width: 2560px;
    height: 2560px;
    min-width: 2560px;
    min-height: 2560px;

    path {
      transition: fill-opacity ${ANI_DURATION}s ease-out;
    }
  }
`

interface PathCache {
  element: SVGPathElement
  centerX: number
  centerY: number
}

const HOVER_RADIUS = 200
const THROTTLE_MS = 16 // ~60fps

export default memo(function SvgCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathCacheRef = useRef<PathCache[]>([])
  const lastUpdateRef = useRef<number>(0)
  const rafRef = useRef<number | null>(null)
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null)

  // 计算每个 path 的中心点并缓存
  const buildPathCache = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const svg = container.querySelector('svg')
    if (!svg) return

    const paths = svg.querySelectorAll('path')
    const cache: PathCache[] = []

    paths.forEach((path) => {
      try {
        const bbox = path.getBBox()
        cache.push({
          element: path,
          centerX: bbox.x + bbox.width / 2,
          centerY: bbox.y + bbox.height / 2,
        })
      } catch {
        // getBBox 可能在某些情况下失败，忽略该 path
      }
    })

    pathCacheRef.current = cache
  }, [])

  // 更新高亮状态
  const updateHighlight = useCallback((mouseX: number, mouseY: number) => {
    const container = containerRef.current
    if (!container) return

    const svg = container.querySelector('svg')
    if (!svg) return

    // 获取 SVG 相对于视口的位置
    const svgRect = svg.getBoundingClientRect()

    // 将鼠标坐标转换为 SVG 坐标系
    const scaleX = 2560 / svgRect.width
    const scaleY = 2560 / svgRect.height
    const svgMouseX = (mouseX - svgRect.left) * scaleX
    const svgMouseY = (mouseY - svgRect.top) * scaleY

    // 根据缩放比例调整半径
    const adjustedRadius = HOVER_RADIUS * Math.max(scaleX, scaleY)
    const radiusSquared = adjustedRadius * adjustedRadius

    pathCacheRef.current.forEach(({ element, centerX, centerY }) => {
      const dx = svgMouseX - centerX
      const dy = svgMouseY - centerY
      const distanceSquared = dx * dx + dy * dy

      if (distanceSquared <= radiusSquared) {
        // 计算渐变效果：距离越近越亮
        const distance = Math.sqrt(distanceSquared)
        const intensity = 1 - distance / adjustedRadius
        const opacity = 0.12 + 0.88 * intensity
        element.style.fillOpacity = String(opacity)

        // 计算从 path 中心指向鼠标的角度（假设线条初始朝向向上）
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90
        element.style.transformOrigin = `${centerX}px ${centerY}px`
        element.style.transform = `rotate(${angle}deg)`
      } else {
        element.style.fillOpacity = '0.12'
        element.style.transform = 'rotate(0deg)'
      }
    })
  }, [])

  // 节流处理鼠标移动
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      lastMousePosRef.current = { x: e.clientX, y: e.clientY }

      const now = Date.now()
      if (now - lastUpdateRef.current < THROTTLE_MS) {
        // 如果还没到更新时间，安排一个 RAF
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null
            if (lastMousePosRef.current) {
              updateHighlight(lastMousePosRef.current.x, lastMousePosRef.current.y)
              lastUpdateRef.current = Date.now()
            }
          })
        }
        return
      }

      lastUpdateRef.current = now
      updateHighlight(e.clientX, e.clientY)
    },
    [updateHighlight],
  )

  // 鼠标离开时重置所有 path
  const handleMouseLeave = useCallback(() => {
    pathCacheRef.current.forEach(({ element }) => {
      element.style.fillOpacity = '0.12'
    })
  }, [])

  useEffect(() => {
    // 使用 ?raw 导入的 SVG 内容直接渲染
    if (containerRef.current) {
      containerRef.current.innerHTML = svgContent
      // 等待 DOM 更新后构建缓存
      requestAnimationFrame(buildPathCache)
    }
  }, [buildPathCache])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleMouseMove, handleMouseLeave])

  return <SvgCanvasWrapper ref={containerRef} />
})

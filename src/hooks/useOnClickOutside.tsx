/**
 * 是否点击在指定元素外面（支持移动端和桌面端）
 */
import { useEffect, useRef } from 'react'

export function useOnClickOutside(
  nodes: (HTMLElement | null) | (HTMLElement | null)[],
  handler: undefined | (() => void),
) {
  const handlerRef = useRef<undefined | (() => void)>(handler)
  const startTarget = useRef<EventTarget | null>(null)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    // 统一的开始事件处理
    const handleStart = (e: MouseEvent | TouchEvent) => {
      const target = e.type === 'touchstart' ? (e as TouchEvent).touches[0]?.target : (e as MouseEvent).target
      startTarget.current = target
    }

    // 统一的结束事件处理
    const handleEnd = (e: MouseEvent | TouchEvent) => {
      const target = e.type === 'touchend' ? (e as TouchEvent).changedTouches[0]?.target : (e as MouseEvent).target

      // 确保开始和结束是在同一个元素上
      if (startTarget.current !== target) {
        startTarget.current = null
        return
      }

      const nodeArray = Array.isArray(nodes) ? nodes : [nodes]
      const isInside = nodeArray.some((node) => {
        if (!node) return false
        // 检查触摸/点击的元素是否在目标节点内
        const isNodeContains = node.contains(target as Node)
        // 检查触摸/点击的元素是否在Portal内（通过检查className）
        const isInPortal = (target as Element)?.closest('.select-pop-contrainer')
        return isNodeContains || isInPortal
      })

      if (!isInside && handlerRef.current) {
        handlerRef.current()
      }

      startTarget.current = null
    }

    // 桌面端事件
    const handleMouseDown = (e: MouseEvent) => handleStart(e)
    const handleMouseUp = (e: MouseEvent) => handleEnd(e)

    // 移动端事件
    const handleTouchStart = (e: TouchEvent) => handleStart(e)
    const handleTouchEnd = (e: TouchEvent) => handleEnd(e)

    // 添加所有事件监听器
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      // 清理所有事件监听器
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [nodes])
}

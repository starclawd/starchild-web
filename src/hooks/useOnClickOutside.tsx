/**
 * 是否点击在指定元素外面
 */
import { useEffect, useRef } from 'react'

export function useOnClickOutside(
  nodes: (HTMLElement | null) | (HTMLElement | null)[],
  handler: undefined | (() => void),
) {
  const handlerRef = useRef<undefined | (() => void)>(handler)
  const mouseDownTarget = useRef<EventTarget | null>(null)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      mouseDownTarget.current = e.target
    }

    const handleMouseUp = (e: MouseEvent) => {
      // 确保点击开始和结束是在同一个元素上
      if (mouseDownTarget.current !== e.target) {
        mouseDownTarget.current = null
        return
      }

      const nodeArray = Array.isArray(nodes) ? nodes : [nodes]
      const isInside = nodeArray.some((node) => {
        if (!node) return false
        // 检查点击的元素是否在目标节点内
        const isNodeContains = node.contains(e.target as Node)
        // 检查点击的元素是否在Portal内（通过检查className）
        const isInPortal = (e.target as Element)?.closest('.select-pop-contrainer')
        return isNodeContains || isInPortal
      })

      if (!isInside && handlerRef.current) {
        handlerRef.current()
      }

      mouseDownTarget.current = null
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [nodes])
}

import { useEffect, useRef, RefObject } from 'react'

export const useScrollbarClass = <T extends HTMLElement>(elementRef?: RefObject<T>) => {
  const ref = useRef<T>(null)
  const targetRef = elementRef || ref

  useEffect(() => {
    const element = targetRef.current
    if (!element) return

    const checkScrollbars = () => {
      const hasVerticalScroll = element.scrollHeight > element.clientHeight
      const hasHorizontalScroll = element.scrollWidth > element.clientWidth

      const shouldHaveScrollbar = hasVerticalScroll || hasHorizontalScroll
      const currentlyHasClass = element.classList.contains('has-scrollbar')

      // 只在需要时修改class，避免不必要的DOM操作
      if (shouldHaveScrollbar && !currentlyHasClass) {
        element.classList.add('has-scrollbar')
      } else if (!shouldHaveScrollbar && currentlyHasClass) {
        element.classList.remove('has-scrollbar')
      }
    }

    // 初始检测
    checkScrollbars()

    // 监听窗口大小变化
    const resizeObserver = new ResizeObserver(checkScrollbars)
    resizeObserver.observe(element)

    // 监听内容变化，但不监听class属性变化以避免无限循环
    const mutationObserver = new MutationObserver(checkScrollbars)
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style'], // 移除 'class'，只监听 style 变化
    })

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      element.classList.remove('has-scrollbar')
    }
  }, [targetRef])

  return targetRef
}

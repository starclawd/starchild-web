import { useCallback, useRef, RefObject, MutableRefObject } from 'react'

export const useScrollbarClass = <T extends HTMLElement>(elementRef?: RefObject<T>) => {
  const observersRef = useRef<(ResizeObserver | MutationObserver)[]>([])

  const refCallback = useCallback(
    (element: T | null) => {
      // 先清理之前的观察器
      observersRef.current.forEach((observer) => observer.disconnect())
      observersRef.current = []

      // 如果提供了外部 ref，同步更新
      if (elementRef) {
        ;(elementRef as RefObject<T | null>).current = element
      }

      // 元素卸载时直接返回
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
      observersRef.current.push(resizeObserver)

      // 监听内容变化
      const mutationObserver = new MutationObserver(checkScrollbars)
      mutationObserver.observe(element, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style'],
      })
      observersRef.current.push(mutationObserver)
    },
    [elementRef],
  )

  // 总是返回 callback ref，这样可以保证我们的逻辑被执行
  // 在 callback 内部同步外部 ref（如果提供了的话）
  return refCallback
}

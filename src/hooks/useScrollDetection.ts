import { useEffect, useState, RefObject } from 'react';

export const useScrollDetection = <T extends HTMLElement>(ref: RefObject<T>) => {
  const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false);
  const [hasVerticalScroll, setHasVerticalScroll] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const checkScrollbars = () => {
      const hasVertical = element.scrollHeight > element.clientHeight;
      const hasHorizontal = element.scrollWidth > element.clientWidth;
      
      setHasVerticalScroll(hasVertical);
      setHasHorizontalScroll(hasHorizontal);
    };

    // 初始检测
    checkScrollbars();

    // 监听窗口大小变化
    const resizeObserver = new ResizeObserver(checkScrollbars);
    resizeObserver.observe(element);

    // 监听内容变化
    const mutationObserver = new MutationObserver(checkScrollbars);
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [ref]);

  return { hasHorizontalScroll, hasVerticalScroll };
}; 
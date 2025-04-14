/**
 * 手机版
 */
import styled from 'styled-components'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useMobileHtmlScrollTop, useVisualViewportHeight } from 'store/application/hooks'
import { useCallback, useEffect } from 'react'
import { isIos } from 'utils/userAgent'
import { MobileInsights, MobileTradeAi, ROUTER } from 'pages/router'
const MobileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
`

export default function Mobile() {
  const [, setVisualViewportHeight] = useVisualViewportHeight()
  const [, setHtmlScrollTop] = useMobileHtmlScrollTop()
  // 获取页面滚动高度
  const scrollCallback = useCallback((e: any) => {
    const top = document.documentElement.scrollTop || document.body.scrollTop
    setHtmlScrollTop(top)
  }, [setHtmlScrollTop])
  useEffect(() => {
    window.addEventListener('scroll', scrollCallback)
    return () => {
      window.removeEventListener('scroll', scrollCallback)
    }
  }, [scrollCallback])
  // 获取页面可见区域的高度
  useEffect(() => {
    const callback = () => {
      setVisualViewportHeight(visualViewport?.height || 0)
    }
    visualViewport?.addEventListener('resize', callback)
    return () => {
      visualViewport?.removeEventListener('resize', callback)
    }
  }, [setVisualViewportHeight])
  // 切换route关闭全屏效果，主要处理kline全屏
  // 如果是ios将body用fixed固定，去掉弹性，避免下拉的时候，body层也会出现弹性下拉
  useEffect(() => {
    if (isIos) {
      document.body.classList.add('fixed-style')
      document.body.style.height = `${window.innerHeight}px`
    }
  }, [])
  return (
    <MobileWrapper>
      <Routes>
        <Route path={ROUTER.TRADE_AI} element={<MobileTradeAi />} />
        <Route path={ROUTER.INSIGHTS} element={<MobileInsights />} />
        <Route path="*" element={<Navigate to={ROUTER.INSIGHTS} replace />} />
      </Routes>
    </MobileWrapper>
  )
}

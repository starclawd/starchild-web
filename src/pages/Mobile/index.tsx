/**
 * 手机版
 */
import styled from 'styled-components'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useMobileHtmlScrollTop, useVisualViewportHeight } from 'store/application/hooks'
import { useCallback, useEffect } from 'react'
import { isIos } from 'utils/userAgent'
import { MobileDownload, MobileInsights, MobileTradeAi, ROUTER } from 'pages/router'
import useJsBridge from 'hooks/useJsBridge'
import { useAuthToken } from 'store/logincache/hooks'
import { BottomSafeArea } from 'components/SafeAreaWrapper'
const MobileWrapper = styled(BottomSafeArea)`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export default function Mobile() {
  const [authToken] = useAuthToken()
  const { bridgeReady, getAuthToken } = useJsBridge()
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
  useEffect(() => {
    const designWidth = 430
    function setRemUnit() {
      const docEl = document.documentElement
      const clientWidth = docEl.clientWidth
      if (!clientWidth) return
      const fontSize = 100 * (clientWidth / designWidth)
      docEl.style.fontSize = fontSize + 'px'
    }
    window.addEventListener('resize', setRemUnit);
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        setRemUnit();
      }
    });
    setRemUnit();
  }, [])
  useEffect(() => {
    if (!authToken && bridgeReady) {
      getAuthToken()
    }
  }, [getAuthToken, authToken, bridgeReady])
  return (
    <MobileWrapper>
      <Routes>
        <Route path={ROUTER.TRADE_AI} element={<MobileTradeAi />} />
        <Route path={ROUTER.INSIGHTS} element={<MobileInsights />} />
        <Route path={ROUTER.DOWNLOAD} element={<MobileDownload />} />
        <Route path="*" element={<Navigate to={ROUTER.INSIGHTS} replace />} />
      </Routes>
    </MobileWrapper>
  )
}

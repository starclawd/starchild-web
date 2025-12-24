/**
 * 手机版
 */
import styled from 'styled-components'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useMobileHtmlScrollTop, useVisualViewportHeight } from 'store/application/hooks'
import { useCallback, useEffect } from 'react'
import { isIos } from 'utils/userAgent'
import {
  MobileDemoPage,
  MobileAgentDetail,
  MobileChat,
  ROUTER,
  MobileAgentHub,
  Home,
  MobileMySignals,
  MobileUseCases,
  MobileDocuments,
  MobileAgentKolRadar,
  MobileAgentTokenDeepDive,
  MobileInsights,
  MobileLiveChat,
} from 'pages/router'
import useJsBridge from 'hooks/useJsBridge'
import { useAuthToken } from 'store/logincache/hooks'
import { BottomSafeArea } from 'components/SafeAreaWrapper'
import { isLocalEnv } from 'utils/url'
import { MOBILE_DESIGN_WIDTH } from 'constants/index'
import MobileMenu from './components/MobileMenu'
import { useIsLogin } from 'store/login/hooks'

const MobileWrapper = styled(BottomSafeArea)`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export default function Mobile() {
  const isLogin = useIsLogin()
  const { pathname } = useLocation()
  const [authToken] = useAuthToken()
  const { bridgeReady, getAuthToken } = useJsBridge()
  const [, setVisualViewportHeight] = useVisualViewportHeight()
  const [, setHtmlScrollTop] = useMobileHtmlScrollTop()
  // 获取页面滚动高度
  const scrollCallback = useCallback(
    (e: any) => {
      const top = document.documentElement.scrollTop || document.body.scrollTop
      setHtmlScrollTop(top)
    },
    [setHtmlScrollTop],
  )
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
    function setRemUnit() {
      const docEl = document.documentElement
      const clientWidth = docEl.clientWidth
      if (!clientWidth) return
      const fontSize = 100 * (clientWidth / MOBILE_DESIGN_WIDTH)
      docEl.style.fontSize = fontSize + 'px'
    }
    window.addEventListener('resize', setRemUnit)
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        setRemUnit()
      }
    })
    setRemUnit()
  }, [])
  useEffect(() => {
    if (!authToken && bridgeReady) {
      getAuthToken()
    }
  }, [getAuthToken, authToken, bridgeReady])
  return (
    <MobileWrapper>
      <Routes>
        <Route path={ROUTER.HOME} element={<Home />} />
        <Route path={ROUTER.CHAT} element={<MobileChat />} />
        <Route path={ROUTER.SIGNALS} element={<MobileInsights />} />
        <Route path={ROUTER.LIVECHAT} element={<MobileLiveChat />} />
        <Route path={ROUTER.BACK_TEST} element={<MobileAgentDetail />} />
        <Route path={ROUTER.TASK_DETAIL} element={<MobileAgentDetail />} />
        <Route path={ROUTER.AGENT_DETAIL} element={<MobileAgentDetail />} />
        {isLocalEnv && <Route path={ROUTER.DEMO} element={<MobileDemoPage />} />}
        <Route path={ROUTER.AGENT_HUB} element={<MobileAgentHub />} />
        <Route path={ROUTER.AGENT_HUB_KOL} element={<MobileAgentKolRadar />} />
        <Route path={ROUTER.AGENT_HUB_DEEP_DIVE} element={<MobileAgentTokenDeepDive />} />
        <Route path={ROUTER.MY_SIGNALS} element={<MobileMySignals />} />
        <Route path={ROUTER.USE_CASES} element={<MobileUseCases />} />
        <Route path={ROUTER.DOCUMENTS} element={<MobileDocuments />} />
        {/* Redirect /agenthub/* to /agentmarket/* */}
        <Route path='/agenthub/*' element={<Navigate to={pathname.replace('/agenthub', '/agentmarket')} replace />} />
        <Route path='*' element={<Navigate to={isLogin ? ROUTER.AGENT_HUB : ROUTER.HOME} replace />} />
      </Routes>
      <MobileMenu />
    </MobileWrapper>
  )
}

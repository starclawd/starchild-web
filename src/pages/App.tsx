import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import suggestImg from 'assets/tradeai/suggest.png'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { ThemeProvider } from 'theme/ThemeProvider'
import { Header } from 'components/Header'
import { ROUTER } from 'pages/router'
import { useCurrentRouter, useGetRouteByPathname, useIsMobile } from 'store/application/hooks'
import { Suspense, useEffect } from 'react'
import Mobile from './Mobile'
import RouteLoading from 'components/RouteLoading'
import { useAuthToken } from 'store/logincache/hooks'
import { useGetUserInfo, useIsLogin, useLoginStatus } from 'store/login/hooks'
import { LOGIN_STATUS } from 'store/login/login.d'
// import Footer from 'components/Footer'
import { ANI_DURATION } from 'constants/index'
import { useChangeHtmlBg } from 'store/themecache/hooks'
import TradeAi from './TradeAi'
import Insights from './Insights'
import Portfolio from './Portfolio'
import { StyledToastContent } from 'components/Toast'
import Connect from './Connect'
import { useInsightsSubscription, useKlineSubscription } from 'store/insights/hooks'

dayjs.extend(utc)
dayjs.extend(timezone)

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${({ theme }) => theme.bgL0};
`

const BodyWrapper = styled.div<{ isTradeAiPage?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  height: calc(100% - 68px);
  overflow: hidden;
`

const InnerWrapper = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  ${({ theme }) => theme.mediaMinWidth.minWidth1024`
    width: 976px;
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1280`
    width: 1212px;
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1440`
    width: 1358px;
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1920`
    width: 1570px;
  `}
`

const MobileBodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  height: 100%;
`

function App() {
  useChangeHtmlBg()
  useKlineSubscription()
  useInsightsSubscription()
  const [authToken] = useAuthToken()
  const isMobile = useIsMobile()
  const isLogin = useIsLogin()
  const { pathname } = useLocation()
  const [, setLoginStatus] = useLoginStatus()
  const getRouteByPathname = useGetRouteByPathname()
  const triggerGetUserInfo = useGetUserInfo()
  const [, setCurrentRouter] = useCurrentRouter(false)
  useEffect(() => {
    const route = getRouteByPathname(pathname)
    setCurrentRouter(route)
  }, [pathname, getRouteByPathname, setCurrentRouter])

  useEffect(() => {
    if (authToken) {
      setLoginStatus(LOGIN_STATUS.LOGGED)
    } else {
      setLoginStatus(LOGIN_STATUS.NO_LOGIN)
    }
  }, [authToken, setLoginStatus])

  useEffect(() => {
    if (isLogin) {
      triggerGetUserInfo()
    }
  }, [triggerGetUserInfo, isLogin])
  
  return (
    <ThemeProvider>
      {isMobile
        ? <AppWrapper key="mobile" id="appRoot">
          <MobileBodyWrapper>
            <Suspense fallback={<RouteLoading />}>
              <Mobile />
            </Suspense>
          </MobileBodyWrapper>
        </AppWrapper>
        : <AppWrapper key="pc" id="appRoot">
          <Header />
          <BodyWrapper>
            <InnerWrapper>
              <Suspense fallback={<RouteLoading />}>
                <Routes>
                  <Route path={ROUTER.TRADE_AI} element={<TradeAi />} />
                  <Route path={ROUTER.INSIGHTS} element={<Insights />} />
                  <Route path={ROUTER.PORTFOLIO} element={<Portfolio />} />
                  <Route path={ROUTER.CONNECT} element={<Connect />} />
                  <Route path="*" element={<Navigate to={ROUTER.INSIGHTS} replace />} />
                </Routes>
              </Suspense>
              {/* <Footer /> */}
            </InnerWrapper>
          </BodyWrapper>
        </AppWrapper>}
        <StyledToastContent newestOnTop />
        <img src={suggestImg} style={{ display: 'none' }} alt="" />
    </ThemeProvider>
  )
}

export default App

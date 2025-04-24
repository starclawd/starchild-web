import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { ThemeProvider } from 'theme/ThemeProvider'
import { Header } from 'components/Header'
import { Insights, Portfolio, ROUTER, TradeAi } from 'pages/router'
import { useCurrentRouter, useGetRouteByPathname, useIsMobile } from 'store/application/hooks'
import { Suspense, useEffect } from 'react'
import Mobile from './Mobile'
import RouteLoading from 'components/RouteLoading'
import { useAuthToken } from 'store/logincache/hooks'
import { useLoginStatus } from 'store/login/hooks'
import { LOGIN_STATUS } from 'store/login/login.d'
import Footer from 'components/Footer'
import { ANI_DURATION } from 'constants/index'

dayjs.extend(utc)
dayjs.extend(timezone)

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  background-color: ${({ theme }) => theme.bgL0};
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  &::-webkit-scrollbar-thumb {
    background: transparent;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
`

const BodyWrapper = styled.div<{ isTradeAiPage?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  height: calc(100% - 68px);
`

const InnerWrapper = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  ${({ theme }) => theme.mediaMinWidth.minWidth1024`
    width: 944px;
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1280`
    width: 1160px;
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1440`
    width: 1310px;
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1920`
    width: 1760px;
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
  const [, setLoginStatus] = useLoginStatus()
  const [authToken] = useAuthToken()
  const isMobile = useIsMobile()
  const { pathname } = useLocation()
  const getRouteByPathname = useGetRouteByPathname()
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
  
  return (
    <ThemeProvider>
      {isMobile
        ? <AppWrapper id="appRoot">
          <MobileBodyWrapper>
            <Suspense fallback={<RouteLoading />}>
              <Mobile />
            </Suspense>
          </MobileBodyWrapper>
        </AppWrapper>
        : <AppWrapper id="appRoot">
          <Header />
          <BodyWrapper>
            <InnerWrapper>
              <Suspense fallback={<RouteLoading />}>
                <Routes>
                  <Route path={ROUTER.TRADE_AI} element={<TradeAi />} />
                  <Route path={ROUTER.INSIGHTS} element={<Insights />} />
                  <Route path={ROUTER.PORTFOLIO} element={<Portfolio />} />
                  <Route path="*" element={<Navigate to={ROUTER.INSIGHTS} replace />} />
                </Routes>
              </Suspense>
              <Footer />
            </InnerWrapper>
          </BodyWrapper>
        </AppWrapper>}
    </ThemeProvider>
  )
}

export default App

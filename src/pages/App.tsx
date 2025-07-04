import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import suggestImg from 'assets/tradeai/suggest.png'
import homepageImg from 'assets/png/homepage.png'
import walletImg from 'assets/png/wallet.png'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { ThemeProvider } from 'theme/ThemeProvider'
import { Header } from 'components/Header'
import { ROUTER } from 'pages/router'
import { useCurrentRouter, useGetCoinId, useGetRouteByPathname, useIsMobile, useModalOpen } from 'store/application/hooks'
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
import BackTest from './BackTest'
import { StyledToastContent } from 'components/Toast'
import Connect from './Connect'
import { useGetCoingeckoCoinIdMap, useGetExchangeInfo, useInsightsSubscription, useKlineSubscription } from 'store/insights/hooks'
import { useListenInsightsNotification } from 'store/insightscache/hooks'
import { isMatchCurrentRouter } from 'utils'
import ErrorBoundary from 'components/ErrorBoundary'
import Tasks from './Tasks'
import { CreateTaskModal } from './Tasks/components/CreateModal'
import { useCurrentTaskData } from 'store/setting/hooks'
import { ApplicationModal } from 'store/application/application'
import TaskDetail from './TaskDetail'
import { useIsOpenFullScreen } from 'store/tradeai/hooks'
import { useIsFixMenu } from 'store/headercache/hooks'
import useWindowVisible from 'hooks/useWindowVisible'
import DemoPage from './DemoPage'
import { isLocalEnv } from 'utils/url'

dayjs.extend(utc)
dayjs.extend(timezone)

const AppWrapper = styled.div`
  display: flex;
  height: 100%;
  background-color: ${({ theme }) => theme.bgL0};
`

const BodyWrapper = styled.div<{ $isFixMenu: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: padding-left ${ANI_DURATION}s;
  ${({ $isFixMenu }) => $isFixMenu && css`
    padding-left: 240px;
  `}
`

const InnerWrapper = styled.div<{
  $isAgentPage?: boolean
  $isInsightsPage?: boolean
  $isBackTestPage?: boolean
  $isTaskDetailPage?: boolean
  $isOpenFullScreen?: boolean
}>`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  ${({ $isBackTestPage }) => $isBackTestPage && css`
    width: 100% !important;
    padding: 20px !important;
  `}
  ${({ $isTaskDetailPage }) => $isTaskDetailPage && css`
    padding: 0 !important;
  `}
  ${({ $isOpenFullScreen, $isAgentPage }) => $isOpenFullScreen && $isAgentPage && css`
    padding: 0 20px !important;
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
  useListenInsightsNotification()
  useChangeHtmlBg()
  useKlineSubscription()
  useInsightsSubscription()
  useWindowVisible()
  const [authToken] = useAuthToken()
  const isMobile = useIsMobile()
  const isLogin = useIsLogin()
  const [isFixMenu] = useIsFixMenu()
  const { pathname } = useLocation()
  const triggerGetCoinId = useGetCoinId()
  const [, setLoginStatus] = useLoginStatus()
  const getRouteByPathname = useGetRouteByPathname()
  const triggerGetUserInfo = useGetUserInfo()
  const [currentTaskData] = useCurrentTaskData()
  const triggerGetExchangeInfo = useGetExchangeInfo()
  const triggerGetCoingeckoCoinIdMap = useGetCoingeckoCoinIdMap()
  const [isOpenFullScreen] = useIsOpenFullScreen()
  const createTaskModalOpen = useModalOpen(ApplicationModal.CREATE_TASK_MODAL)
  const [currentRouter, setCurrentRouter] = useCurrentRouter(false)
  const isAgentPage = isMatchCurrentRouter(currentRouter, ROUTER.TRADE_AI)
  const isInsightsPage = isMatchCurrentRouter(currentRouter, ROUTER.INSIGHTS)
  const isBackTestPage = isMatchCurrentRouter(currentRouter, ROUTER.BACK_TEST)
  const isTaskDetailPage = isMatchCurrentRouter(currentRouter, ROUTER.TASK_DETAIL)
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

  useEffect(() => {
    triggerGetCoinId()
  }, [triggerGetCoinId])

  useEffect(() => {
    if (isLogin) {
      triggerGetCoinId()
    }
  }, [triggerGetCoinId, isLogin])

  useEffect(() => {
    if (isLogin) {
      triggerGetCoingeckoCoinIdMap()
    }
  }, [isLogin, triggerGetCoingeckoCoinIdMap])

  useEffect(() => {
    triggerGetExchangeInfo()
  }, [triggerGetExchangeInfo])
  
  
  return (
    <ErrorBoundary>
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
            {!isBackTestPage && !isTaskDetailPage && <Header />}
            <BodyWrapper $isFixMenu={isFixMenu}>
              <InnerWrapper
                $isOpenFullScreen={isOpenFullScreen}
                $isBackTestPage={isBackTestPage}
                $isTaskDetailPage={isTaskDetailPage}
                $isAgentPage={isAgentPage}
                $isInsightsPage={isInsightsPage}
              >
                <Suspense fallback={<RouteLoading />}>
                  <Routes>
                    <Route path={ROUTER.TRADE_AI} element={<TradeAi />} />
                    <Route path={ROUTER.INSIGHTS} element={<Insights />} />
                    <Route path={ROUTER.PORTFOLIO} element={<Portfolio />} />
                    <Route path={ROUTER.CONNECT} element={<Connect />} />
                    <Route path={ROUTER.TASKS} element={<Tasks />} />
                    <Route path={ROUTER.BACK_TEST} element={<BackTest />} />
                    <Route path={ROUTER.TASK_DETAIL} element={<TaskDetail />} />
                    {isLocalEnv && <Route path={ROUTER.DEMO} element={<DemoPage />} />}
                    <Route path="*" element={<Navigate to={ROUTER.INSIGHTS} replace />} />
                  </Routes>
                </Suspense>
                {/* <Footer /> */}
              </InnerWrapper>
            </BodyWrapper>
          </AppWrapper>}
          <StyledToastContent newestOnTop />
          {createTaskModalOpen && <CreateTaskModal currentTaskData={currentTaskData} />}
          <img src={suggestImg} style={{ display: 'none' }} alt="" />
          <img src={homepageImg} style={{ display: 'none' }} alt="" />
          <img src={walletImg} style={{ display: 'none' }} alt="" />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { ThemeProvider } from 'theme/ThemeProvider'
import { Header } from 'components/Header'
import stone1Img from 'assets/chat/stone1.png'
import stone2Img from 'assets/chat/stone2.png'
import {
  ROUTER,
  Mobile,
  Home,
  Chat,
  Portfolio,
  Connect,
  MyAgent,
  AgentDetail,
  DemoPage,
  AgentRoutes,
} from 'pages/router'
import {
  useCurrentRouter,
  useGetCoinId,
  useGetRouteByPathname,
  useIsMobile,
  useModalOpen,
} from 'store/application/hooks'
import { Suspense, useCallback, useEffect, useMemo } from 'react'
// import Mobile from './Mobile' // 改为从 router.ts 导入
import RouteLoading from 'components/RouteLoading'
import { useAuthToken } from 'store/logincache/hooks'
import { useGetAuthToken, useGetUserInfo, useIsLogin, useLoginStatus, useUserInfo } from 'store/login/hooks'
import { LOGIN_STATUS, TelegramUser } from 'store/login/login.d'
import { useInitializeLanguage } from 'store/language/hooks'
// import Footer from 'components/Footer'
import { ANI_DURATION } from 'constants/index'
import { useChangeHtmlBg, useTheme } from 'store/themecache/hooks'
// import Chat from './Chat' // 改为从 router.ts 导入
// import Insights from './Insights'
// import Portfolio from './Portfolio' // 改为从 router.ts 导入
import useToast, { StyledToastContent, TOAST_STATUS } from 'components/Toast'
// import Connect from './Connect' // 改为从 router.ts 导入
import { useGetExchangeInfo, useKlineSubscription } from 'store/insights/hooks'
import { useListenInsightsNotification } from 'store/insightscache/hooks'
import { isMatchCurrentRouter, isMatchFatherRouter } from 'utils'
import ErrorBoundary from 'components/ErrorBoundary'
// import MyAgent from './MyAgent' // 改为从 router.ts 导入
// import AgentDetail from './AgentDetail' // 改为从 router.ts 导入
import { useIsAiContentEmpty, useIsOpenFullScreen } from 'store/chat/hooks'
import { useIsFixMenu } from 'store/headercache/hooks'
import useWindowVisible from 'hooks/useWindowVisible'
// import DemoPage from './DemoPage' // 改为从 router.ts 导入
import { isLocalEnv } from 'utils/url'
// import AgentRoutes from './AgentRoutes' // 改为从 router.ts 导入
import { useGetSubscribedAgents } from 'store/agenthub/hooks'
import { parsedQueryString } from 'hooks/useParsedQueryString'
import { CreateAgentModal } from './MyAgent/components/CreateModal'
import { ApplicationModal } from 'store/application/application'
// import Home from './Home' // 改为从 router.ts 导入
import { TgLogin } from 'components/Header/components/TgLogin'
import { Trans } from '@lingui/react/macro'
import { useGetCandidateStatus } from 'store/home/hooks'
import { useAppKitAccount } from '@reown/appkit/react'
import { useTelegramWebAppLogin } from 'hooks/useTelegramWebAppLogin'
import { isTelegramWebApp } from 'utils/telegramWebApp'
import { IconShadow1, IconShadow2 } from 'components/Icons'

dayjs.extend(utc)
dayjs.extend(timezone)

const AppWrapper = styled.div<{ $scaleRate?: number }>`
  position: relative;
  display: flex;
  height: 100%;
  background-color: ${({ theme }) => theme.black900};
`

const BodyWrapper = styled.div<{ $isFixMenu: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: padding-left ${ANI_DURATION}s;
  .chat-shadow1 {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 560px;
    height: 182px;
    z-index: 1;
    overflow: visible;
    path {
      filter: drop-shadow(0 -50px 200px #2a1f1d);
    }
  }
  .chat-shadow2 {
    position: absolute;
    bottom: 0;
    right: 0;
    /* width: 519px;
    height: 347px; */
    z-index: 1;
    overflow: visible;
    path {
      filter: drop-shadow(0 -50px 200px #2a1f1d);
    }
  }
  .stone1 {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 583px;
    height: 255px;
    z-index: 2;
  }
  .stone2 {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 619px;
    height: 391px;
    z-index: 2;
  }
  ${({ $isFixMenu }) =>
    $isFixMenu &&
    css`
      padding-left: 240px;
    `}
`

const InnerWrapper = styled.div<{
  $isAgentPage?: boolean
  $isInsightsPage?: boolean
  $isBackTestPage?: boolean
  $isAgentDetailPage?: boolean
  $isOpenFullScreen?: boolean
}>`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 3;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  ${({ $isBackTestPage }) =>
    $isBackTestPage &&
    css`
      width: 100% !important;
      padding: 20px !important;
    `}
  ${({ $isAgentDetailPage }) =>
    $isAgentDetailPage &&
    css`
      padding: 0 !important;
    `}
  ${({ $isOpenFullScreen, $isAgentPage }) =>
    $isOpenFullScreen &&
    $isAgentPage &&
    css`
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
  useInitializeLanguage()
  useListenInsightsNotification()
  useChangeHtmlBg()
  useKlineSubscription()
  // useInsightsSubscription()
  useWindowVisible()
  const toast = useToast()
  const theme = useTheme()
  const [authToken] = useAuthToken()
  const isMobile = useIsMobile()
  const isLogin = useIsLogin()
  const [isFixMenu] = useIsFixMenu()
  const { pathname } = useLocation()
  const isEmpty = useIsAiContentEmpty()
  const triggerGetCoinId = useGetCoinId()
  const [loginStatus, setLoginStatus] = useLoginStatus()
  const triggerGetAuthToken = useGetAuthToken()
  const getRouteByPathname = useGetRouteByPathname()
  const triggerGetUserInfo = useGetUserInfo()
  const triggerGetExchangeInfo = useGetExchangeInfo()
  const [isOpenFullScreen] = useIsOpenFullScreen()
  const [currentRouter, setCurrentRouter] = useCurrentRouter(false)
  const { address } = useAppKitAccount({ namespace: 'eip155' })
  const [, setCurrentRouter2] = useCurrentRouter()
  const triggerGetSubscribedAgents = useGetSubscribedAgents()
  const triggerGetCandidateStatus = useGetCandidateStatus()
  const isAgentPage = isMatchCurrentRouter(currentRouter, ROUTER.CHAT)
  const createAgentModalOpen = useModalOpen(ApplicationModal.CREATE_AGENT_MODAL)
  // const isInsightsPage = isMatchCurrentRouter(currentRouter, ROUTER.INSIGHTS)
  const isBackTestPage = isMatchCurrentRouter(currentRouter, ROUTER.BACK_TEST)
  const isHomePage = isMatchCurrentRouter(currentRouter, ROUTER.HOME)
  const isMyAgentPage = isMatchCurrentRouter(currentRouter, ROUTER.MY_AGENT)
  const isAgentHubPage =
    isMatchCurrentRouter(currentRouter, ROUTER.AGENT_HUB) || isMatchFatherRouter(currentRouter, ROUTER.AGENT_HUB)
  const isAgentDetailPage =
    isMatchCurrentRouter(currentRouter, ROUTER.TASK_DETAIL) || isMatchCurrentRouter(currentRouter, ROUTER.AGENT_DETAIL)
  const [{ telegramUserId }] = useUserInfo()
  const hideMenuPage = useMemo(() => {
    const from = parsedQueryString(location.search).from
    return (!from && (isAgentDetailPage || isBackTestPage)) || isHomePage
  }, [isAgentDetailPage, isBackTestPage, isHomePage])

  useTelegramWebAppLogin({
    autoLogin: true,
    onlyFromInlineKeyboard: true,
    onLoginSuccess: () => {
      setLoginStatus(LOGIN_STATUS.LOGGED)
    },
    onLoginError: (error) => {
      setLoginStatus(LOGIN_STATUS.NO_LOGIN)
    },
  })

  const handleLogin = useCallback(
    async (user: TelegramUser) => {
      try {
        await triggerGetAuthToken(user)
      } catch (error) {
        console.log(error)
      }
    },
    [triggerGetAuthToken],
  )

  useEffect(() => {
    const route = getRouteByPathname(pathname)
    setCurrentRouter(route)
  }, [pathname, getRouteByPathname, setCurrentRouter])

  useEffect(() => {
    if (!isTelegramWebApp()) {
      if (authToken) {
        setLoginStatus(LOGIN_STATUS.LOGGED)
      } else {
        setLoginStatus(LOGIN_STATUS.NO_LOGIN)
      }
    }
  }, [authToken, setLoginStatus])

  useEffect(() => {
    if (isLogin) {
      triggerGetUserInfo()
    }
  }, [triggerGetUserInfo, isLogin])

  useEffect(() => {
    if (telegramUserId) {
      triggerGetSubscribedAgents()
    }
  }, [telegramUserId, triggerGetSubscribedAgents])

  useEffect(() => {
    triggerGetCoinId()
  }, [triggerGetCoinId])

  useEffect(() => {
    if (isLogin) {
      triggerGetCoinId()
    }
  }, [triggerGetCoinId, isLogin])

  useEffect(() => {
    triggerGetExchangeInfo()
  }, [triggerGetExchangeInfo])
  useEffect(() => {
    if (isLogin && address) {
      triggerGetCandidateStatus(address)
    }
  }, [isLogin, address, triggerGetCandidateStatus])
  useEffect(() => {
    // 权限配置标记点（权限调整后，全局查询锚点）
    if (loginStatus === LOGIN_STATUS.NO_LOGIN && (isAgentHubPage || isAgentPage || isMyAgentPage)) {
      toast({
        title: <Trans>You do not have permission to access, please login first</Trans>,
        description: '',
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-chat-rubbish',
        iconTheme: theme.ruby50,
        autoClose: 2000,
      })
      setCurrentRouter2(ROUTER.HOME)
    }
  }, [loginStatus, isAgentHubPage, theme.ruby50, isAgentPage, isMyAgentPage, toast, setCurrentRouter2])

  return (
    <ErrorBoundary>
      <ThemeProvider>
        {isMobile ? (
          <AppWrapper key='mobile' id='appRoot'>
            <MobileBodyWrapper>
              <Suspense fallback={<RouteLoading />}>
                <Mobile />
              </Suspense>
            </MobileBodyWrapper>
          </AppWrapper>
        ) : (
          <AppWrapper key='pc' id='appRoot'>
            {!hideMenuPage && <Header />}
            <BodyWrapper $isFixMenu={isFixMenu && !hideMenuPage}>
              <InnerWrapper
                $isOpenFullScreen={isOpenFullScreen}
                $isBackTestPage={isBackTestPage}
                $isAgentDetailPage={isAgentDetailPage}
                $isAgentPage={isAgentPage}
                // $isInsightsPage={isInsightsPage}
              >
                <Suspense fallback={<RouteLoading />}>
                  <Routes>
                    <Route path={ROUTER.HOME} element={<Home />} />
                    <Route path={ROUTER.CHAT} element={<Chat />} />
                    {/* <Route path={ROUTER.INSIGHTS} element={<Insights />} /> */}
                    <Route path='/agenthub/*' element={<AgentRoutes />} />
                    <Route path={ROUTER.MY_AGENT} element={<MyAgent />} />
                    <Route path={ROUTER.PORTFOLIO} element={<Portfolio />} />
                    <Route path={ROUTER.CONNECT} element={<Connect />} />
                    <Route path={ROUTER.BACK_TEST} element={<AgentDetail />} />
                    <Route path={ROUTER.TASK_DETAIL} element={<AgentDetail />} />
                    <Route path={ROUTER.AGENT_DETAIL} element={<AgentDetail />} />
                    {isLocalEnv && <Route path={ROUTER.DEMO} element={<DemoPage />} />}
                    <Route path='*' element={<Navigate to={isLogin ? ROUTER.AGENT_HUB : ROUTER.HOME} replace />} />
                  </Routes>
                </Suspense>
                {/* <Footer /> */}
              </InnerWrapper>
              {isAgentPage && isEmpty && (
                <>
                  <img src={stone1Img} alt='' className='stone1' />
                  <img src={stone2Img} alt='' className='stone2' />
                  {/* <IconShadow1 />
                  <IconShadow2 /> */}
                </>
              )}
            </BodyWrapper>
          </AppWrapper>
        )}
        <StyledToastContent newestOnTop />
        {createAgentModalOpen && <CreateAgentModal />}
        <TgLogin onAuth={handleLogin}></TgLogin>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App

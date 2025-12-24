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
  MyVault,
  Connect,
  MyAgent,
  AgentDetail,
  DemoPage,
  AgentRoutes,
  UseCases,
  Documents,
  Vaults,
  VaultDetail,
  MyStrategy,
  CreateStrategy,
  LiveChat,
  Signals,
} from 'pages/router'
import {
  useCurrentRouter,
  useGetCoinId,
  useGetRouteByPathname,
  useIsMobile,
  useModalOpen,
} from 'store/application/hooks'
import { Suspense, useEffect, useMemo } from 'react'
// import Mobile from './Mobile' // 改为从 router.ts 导入
import RouteLoading from 'components/RouteLoading'
import { useAuthToken } from 'store/logincache/hooks'
import { useGetUserInfo, useIsLogin, useLoginStatus, useUserInfo } from 'store/login/hooks'
import { LOGIN_STATUS } from 'store/login/login.d'
import { useInitializeLanguage } from 'store/language/hooks'
// import Footer from 'components/Footer'
import { ANI_DURATION } from 'constants/index'
import { useChangeHtmlBg, useTheme } from 'store/themecache/hooks'
// import Chat from './Chat' // 改为从 router.ts 导入
// import Signals from './Signals'
// import LiveChatPage from './LiveChatPage'
// import Portfolio from './Portfolio' // 改为从 router.ts 导入
import useToast, { StyledToastContent, TOAST_STATUS } from 'components/Toast'
// import Connect from './Connect' // 改为从 router.ts 导入
import { useGetExchangeInfo, useInsightsSubscription } from 'store/insights/hooks'
import { isMatchCurrentRouter, isMatchFatherRouter } from 'utils'
import ErrorBoundary from 'components/ErrorBoundary'
// import MyAgent from './MyAgent' // 改为从 router.ts 导入
// import AgentDetail from './AgentDetail' // 改为从 router.ts 导入
import { useIsAiContentEmpty, useIsOpenFullScreen } from 'store/chat/hooks'
import { trackEvent } from 'utils/common'
import { useIsFixMenu } from 'store/headercache/hooks'
import useWindowVisible from 'hooks/useWindowVisible'
// import DemoPage from './DemoPage' // 改为从 router.ts 导入
import { isLocalEnv } from 'utils/url'
// import AgentRoutes from './AgentRoutes' // 改为从 router.ts 导入
import { useGetSubscribedAgents } from 'store/agenthub/hooks'
import { CreateAgentModal } from './MyAgent/components/CreateModal'
import { ApplicationModal } from 'store/application/application'
// import Home from './Home' // 改为从 router.ts 导入
import { TgLogin } from 'components/Header/components/TgLogin'
import { Trans } from '@lingui/react/macro'
import { useTelegramWebAppLogin } from 'hooks/useTelegramWebAppLogin'
import { isTelegramWebApp } from 'utils/telegramWebApp'
import DeleteMyAgentModal from './MyAgent/components/DeleteMyAgentModal'
import Preference from 'components/Header/components/Preference'
import { useGetPreference } from 'store/perference/hooks'
import { AccountManegeModal } from 'components/Header/components/AccountManege'
import SocialLoginModal from 'pages/Home/components/HomeContent/components/SocialLoginModal'
import { EditNicknameModal } from 'components/Header/components/AccountManege/components/EditNicknameModal'
import BindWalletModal from 'components/Header/components/AccountManege/components/BindWalletModal'
import { useGetSystemSignalAgents } from 'store/insights/hooks/useSystemSignalHooks'
import DepositAndWithdraw from './VaultDetail/components/DepositAndWithdraw'
import { useAppKitEventHandler } from 'hooks/useAppKitEventHandler'
import { useFetchAllStrategiesOverviewData, useLeaderboardWebSocketSubscription } from 'store/vaults/hooks'
import ConnectWalletModal from 'components/ConnectWalletModal'
import SwitchChainModal from 'components/SwitchChainModal'
import DeployModal from 'pages/CreateStrategy/components/StrategyInfo/components/DeployModal'
import {
  STRATEGY_BALANCE_UPDATE_SUB_ID,
  STRATEGY_BALANCE_UPDATE_UNSUB_ID,
  STRATEGY_SIGNAL_SUB_ID,
  STRATEGY_SIGNAL_UNSUB_ID,
} from 'store/websocket/websocket'
import PromptModal from './CreateStrategy/components/Chat/components/PromptModal'

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
  useChangeHtmlBg()
  const { subscribe, unsubscribe, isOpen } = useInsightsSubscription() // 只建立连接，不处理消息
  useWindowVisible()
  useAppKitEventHandler()
  const toast = useToast()
  const theme = useTheme()
  const [authToken] = useAuthToken()
  const isMobile = useIsMobile()
  const isLogin = useIsLogin()
  const [{ userInfoId }] = useUserInfo()
  const [isFixMenu] = useIsFixMenu()
  const { pathname } = useLocation()
  const isEmpty = useIsAiContentEmpty()
  const triggerGetCoinId = useGetCoinId()
  const [loginStatus, setLoginStatus] = useLoginStatus()
  const getRouteByPathname = useGetRouteByPathname()
  const triggerGetUserInfo = useGetUserInfo()
  const triggerGetExchangeInfo = useGetExchangeInfo()
  const [isOpenFullScreen] = useIsOpenFullScreen()
  const [currentRouter, setCurrentRouter] = useCurrentRouter(false)
  const [, setCurrentRouter2] = useCurrentRouter()
  const triggerGetSubscribedAgents = useGetSubscribedAgents()
  const triggerGetSystemSignalAgents = useGetSystemSignalAgents()
  const triggerGetPreference = useGetPreference()
  const isAgentPage = isMatchCurrentRouter(currentRouter, ROUTER.CHAT)
  const createAgentModalOpen = useModalOpen(ApplicationModal.CREATE_AGENT_MODAL)
  const deleteAgentModalOpen = useModalOpen(ApplicationModal.DELETE_MY_AGENT_MODAL)
  const preferenceModalOpen = useModalOpen(ApplicationModal.PREFERENCE_MODAL)
  const accountManegeModalOpen = useModalOpen(ApplicationModal.ACCOUNT_MANEGE_MODAL)
  const socialLoginModalOpen = useModalOpen(ApplicationModal.SOCIAL_LOGIN_MODAL)
  const editNicknameModalOpen = useModalOpen(ApplicationModal.EDIT_NICKNAME_MODAL)
  const bindWalletModalOpen = useModalOpen(ApplicationModal.BIND_WALLET_MODAL)
  const depositAndWithdrawModalOpen = useModalOpen(ApplicationModal.DEPOSIT_AND_WITHDRAW_MODAL)
  const connectWalletModalOpen = useModalOpen(ApplicationModal.CONNECT_WALLET_MODAL)
  const switchChainModalOpen = useModalOpen(ApplicationModal.SWITCH_CHAIN_MODAL)
  const deployModalOpen = useModalOpen(ApplicationModal.DEPLOY_MODAL)
  const promptModalOpen = useModalOpen(ApplicationModal.PROMPT_MODAL)
  // const isSignalsPage = isMatchCurrentRouter(currentRouter, ROUTER.SIGNALS)
  const isBackTestPage = isMatchCurrentRouter(currentRouter, ROUTER.BACK_TEST)
  const isHomePage = isMatchCurrentRouter(currentRouter, ROUTER.HOME)
  const isMyAgentPage = isMatchCurrentRouter(currentRouter, ROUTER.MY_SIGNALS)
  const hideMenuPage = useMemo(() => {
    return isHomePage
  }, [isHomePage])
  const { fetchAllStrategiesOverview } = useFetchAllStrategiesOverviewData()

  // WebSocket 订阅 leaderboard-balances频道
  useLeaderboardWebSocketSubscription()

  useTelegramWebAppLogin({
    autoLogin: true,
    onlyFromInlineKeyboard: true,
    onLoginSuccess: () => {
      setLoginStatus(LOGIN_STATUS.LOGGED)
      // Google Analytics 埋点：登录成功
      trackEvent('login_success', {
        event_category: 'authentication',
        event_label: 'mini_app_login',
      })
    },
    onLoginError: (error) => {
      setLoginStatus(LOGIN_STATUS.NO_LOGIN)
    },
  })

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
    if (userInfoId) {
      triggerGetSubscribedAgents()
    }
  }, [userInfoId, triggerGetSubscribedAgents])

  useEffect(() => {
    triggerGetSystemSignalAgents()
  }, [triggerGetSystemSignalAgents])

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
    if (userInfoId) {
      triggerGetPreference()
    }
  }, [userInfoId, triggerGetPreference])

  useEffect(() => {
    fetchAllStrategiesOverview()
  }, [fetchAllStrategiesOverview])

  useEffect(() => {
    if (isOpen) {
      subscribe('strategy-signal-notification', STRATEGY_SIGNAL_SUB_ID)
    }
    return () => {
      unsubscribe('strategy-signal-notification', STRATEGY_SIGNAL_UNSUB_ID)
    }
  }, [subscribe, unsubscribe, isOpen])

  useEffect(() => {
    // 权限配置标记点（权限调整后，全局查询锚点）
    if (loginStatus === LOGIN_STATUS.NO_LOGIN && (isAgentPage || isMyAgentPage)) {
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
  }, [loginStatus, theme.ruby50, isAgentPage, isMyAgentPage, toast, setCurrentRouter2])

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
                $isAgentPage={isAgentPage}
                // $isInsightsPage={isInsightsPage}
              >
                <Suspense fallback={<RouteLoading />}>
                  <Routes>
                    <Route path={ROUTER.HOME} element={<Home />} />
                    <Route path={ROUTER.CHAT} element={<Chat />} />
                    <Route path={ROUTER.SIGNALS} element={<Signals />} />
                    <Route path={ROUTER.LIVECHAT} element={<LiveChat />} />
                    <Route path='/agentmarket/*' element={<AgentRoutes />} />
                    {/* Redirect /agenthub/* to /agentmarket/* */}
                    <Route
                      path='/agenthub/*'
                      element={<Navigate to={pathname.replace('/agenthub', '/agentmarket')} replace />}
                    />
                    <Route path={ROUTER.MY_SIGNALS} element={<MyAgent />} />
                    <Route
                      path='/myagent'
                      element={<Navigate to={pathname.replace('/myagent', '/myagents')} replace />}
                    />
                    <Route path={ROUTER.MY_VAULT} element={<MyVault />} />
                    <Route path={ROUTER.CONNECT} element={<Connect />} />
                    <Route path={ROUTER.USE_CASES} element={<UseCases />} />
                    <Route path={ROUTER.DOCUMENTS} element={<Documents />} />
                    <Route path={ROUTER.VAULTS} element={<Vaults />} />
                    <Route path={ROUTER.VAULT_DETAIL} element={<VaultDetail />} />
                    <Route path={ROUTER.BACK_TEST} element={<AgentDetail />} />
                    <Route path={ROUTER.TASK_DETAIL} element={<AgentDetail />} />
                    <Route path={ROUTER.AGENT_DETAIL} element={<AgentDetail />} />
                    <Route path={ROUTER.CREATE_STRATEGY} element={<CreateStrategy />} />
                    <Route path={ROUTER.MY_STRATEGY} element={<MyStrategy />} />
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
        {deleteAgentModalOpen && <DeleteMyAgentModal />}
        {preferenceModalOpen && <Preference />}
        {accountManegeModalOpen && <AccountManegeModal />}
        {socialLoginModalOpen && <SocialLoginModal />}
        {editNicknameModalOpen && <EditNicknameModal />}
        {bindWalletModalOpen && <BindWalletModal />}
        {depositAndWithdrawModalOpen && <DepositAndWithdraw />}
        {connectWalletModalOpen && <ConnectWalletModal />}
        {switchChainModalOpen && <SwitchChainModal />}
        {deployModalOpen && <DeployModal />}
        {promptModalOpen && <PromptModal />}
        <TgLogin />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App

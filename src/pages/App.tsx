import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { ThemeProvider } from 'theme/ThemeProvider'
import { Header } from 'components/Header'
import { ROUTER, Mobile, Chat, DemoPage, Vaults, VaultDetail, CreateStrategy, MyPortfolio } from 'pages/router'
import {
  useCurrentRouter,
  useSetCurrentRouter,
  useGetCoinId,
  useGetRouteByPathname,
  useIsMobile,
  useModalOpen,
} from 'store/application/hooks'
import { Suspense, useEffect } from 'react'
// import Mobile from './Mobile' // 改为从 router.ts 导入
import RouteLoading from 'components/RouteLoading'
import { useAuthToken, useGuestUser } from 'store/logincache/hooks'
import usePrevious from 'hooks/usePrevious'
import { useResetAllState as useResetCreateStrategyState } from 'store/createstrategy/hooks/useResetAllState'
import { useResetAllState as useResetVaultDetailState } from 'store/vaultsdetail/hooks/useResetAllState'
import { useGetUserInfo, useIsLogin, useIsLogout, useLoginStatus, useUserInfo } from 'store/login/hooks'
import { LOGIN_STATUS } from 'store/login/login.d'
import { useInitializeLanguage } from 'store/language/hooks'
// import Footer from 'components/Footer'
import { ANI_DURATION } from 'constants/index'
import { useChangeHtmlBg } from 'store/themecache/hooks'
import { StyledToastContent } from 'components/Toast'
import { useGetExchangeInfo, useInsightsSubscription } from 'store/insights/hooks'
import { isMatchCurrentRouter } from 'utils'
import ErrorBoundary from 'components/ErrorBoundary'
import { useIsOpenFullScreen } from 'store/chat/hooks'
import { trackEvent } from 'utils/common'
import { useIsFixMenu } from 'store/headercache/hooks'
import useWindowVisible from 'hooks/useWindowVisible'
import { isLocalEnv, isPro } from 'utils/url'
import { ApplicationModal } from 'store/application/application'
import { TgLogin } from 'components/Header/components/TgLogin'
import { useTelegramWebAppLogin } from 'hooks/useTelegramWebAppLogin'
import { isTelegramWebApp } from 'utils/telegramWebApp'
import DeleteMyAgentModal from './MyAgent/components/DeleteMyAgentModal'
import Preference from 'components/Header/components/Preference'
import { useGetPreference } from 'store/perference/hooks'
import { AccountManegeModal } from 'components/Header/components/AccountManege'
import { EditNicknameModal } from 'components/Header/components/AccountManege/components/EditNicknameModal'
import DepositAndWithdraw from './VaultDetail/components/DepositAndWithdraw'
import { useAppKitEventHandler } from 'hooks/useAppKitEventHandler'
import { useLeaderboardWebSocketSubscription, useOnchainBalance } from 'store/vaults/hooks'
import ConnectWalletModal from 'components/ConnectWalletModal'
import SwitchChainModal from 'components/SwitchChainModal'
import DeployModal from 'pages/CreateStrategy/components/StrategyInfo/components/DeployModal'
import { STRATEGY_SIGNAL_SUB_ID, STRATEGY_SIGNAL_UNSUB_ID } from 'store/websocket/websocket'
import PromptModal from './CreateStrategy/components/Chat/components/PromptModal'
import ShareModal from 'components/ShareModal'
import { useGenerateGuestUser } from 'store/login/hooks/useGenerateGuestUser'
import PauseStrategyModal from './MyPortfolio/components/MyStrategies/components/PauseStrategyModal'
import DelistStrategyModal from './MyPortfolio/components/MyStrategies/components/DelistStrategyModal'
import DeleteStrategyModal from './MyPortfolio/components/MyStrategies/components/DeleteStrategyModal'

dayjs.extend(utc)
dayjs.extend(timezone)

const AppWrapper = styled.div<{ $scaleRate?: number }>`
  position: relative;
  display: flex;
  height: 100%;
  background-color: ${({ theme }) => theme.black1000};
`

const BodyWrapper = styled.div<{ $isFixMenu: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  width: calc(100% - 60px);
  height: 100%;
  overflow: hidden;
  transition: padding-left ${ANI_DURATION}s;
  ${({ $isFixMenu }) =>
    $isFixMenu &&
    css`
      padding-left: 240px;
    `}
`

const InnerWrapper = styled.div<{
  $isChatPage?: boolean
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
  ${({ $isOpenFullScreen, $isChatPage }) =>
    $isOpenFullScreen &&
    $isChatPage &&
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
  useWindowVisible()
  useAppKitEventHandler()
  useOnchainBalance()
  const { subscribe, unsubscribe, isOpen } = useInsightsSubscription() // 只建立连接，不处理消息
  const [authToken] = useAuthToken()
  const isMobile = useIsMobile()
  const isLogin = useIsLogin()
  const isLoginOut = useIsLogout()
  const [userInfo, setUserInfo] = useUserInfo()
  const [guestUser] = useGuestUser()
  const [isFixMenu] = useIsFixMenu()
  const { pathname } = useLocation()
  const triggerGetCoinId = useGetCoinId()
  const [, setLoginStatus] = useLoginStatus()
  const getRouteByPathname = useGetRouteByPathname()
  const triggerGetUserInfo = useGetUserInfo()
  const triggerGetExchangeInfo = useGetExchangeInfo()
  const [isOpenFullScreen] = useIsOpenFullScreen()
  const currentRouter = useCurrentRouter()
  const previousRouter = usePrevious(currentRouter)
  const resetCreateStrategyState = useResetCreateStrategyState()
  const resetVaultDetailState = useResetVaultDetailState()
  const setCurrentRouter = useSetCurrentRouter(false)
  const triggerGetPreference = useGetPreference()
  const generateGuestUser = useGenerateGuestUser()
  const isChatPage = isMatchCurrentRouter(currentRouter, ROUTER.CHAT)
  const deleteAgentModalOpen = useModalOpen(ApplicationModal.DELETE_MY_AGENT_MODAL)
  const preferenceModalOpen = useModalOpen(ApplicationModal.PREFERENCE_MODAL)
  const accountManegeModalOpen = useModalOpen(ApplicationModal.ACCOUNT_MANEGE_MODAL)
  const editNicknameModalOpen = useModalOpen(ApplicationModal.EDIT_NICKNAME_MODAL)
  const depositAndWithdrawModalOpen = useModalOpen(ApplicationModal.DEPOSIT_AND_WITHDRAW_MODAL)
  const connectWalletModalOpen = useModalOpen(ApplicationModal.CONNECT_WALLET_MODAL)
  const switchChainModalOpen = useModalOpen(ApplicationModal.SWITCH_CHAIN_MODAL)
  const deployModalOpen = useModalOpen(ApplicationModal.DEPLOY_MODAL)
  const promptModalOpen = useModalOpen(ApplicationModal.PROMPT_MODAL)
  const shareStrategyModalOpen = useModalOpen(ApplicationModal.SHARE_STRATEGY_MODAL)
  const pauseStrategyModalOpen = useModalOpen(ApplicationModal.PAUSE_STRATEGY_MODAL)
  const delistStrategyModalOpen = useModalOpen(ApplicationModal.DELIST_STRATEGY_MODAL)
  const deleteStrategyModalOpen = useModalOpen(ApplicationModal.DELETE_STRATEGY_MODAL)
  // const isSignalsPage = isMatchCurrentRouter(currentRouter, ROUTER.SIGNALS)
  const isBackTestPage = isMatchCurrentRouter(currentRouter, ROUTER.BACK_TEST)
  const { userInfoId } = userInfo
  const { account_api_key, user_info_id } = guestUser || {
    account_api_key: '',
    user_info_id: 0,
  }

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

  // 当从 CREATE_STRATEGY 或 VAULT_DETAIL 切换到其他路由时，重置对应的状态
  useEffect(() => {
    if (previousRouter && previousRouter !== currentRouter) {
      // 从 CREATE_STRATEGY 切换走时，重置 createstrategy 状态
      if (isMatchCurrentRouter(previousRouter, ROUTER.CREATE_STRATEGY)) {
        resetCreateStrategyState()
      }
      // 从 VAULT_DETAIL 切换走时，重置 vaultsdetail 状态
      if (isMatchCurrentRouter(previousRouter, ROUTER.VAULT_DETAIL)) {
        resetVaultDetailState()
      }
    }
  }, [currentRouter, previousRouter, resetCreateStrategyState, resetVaultDetailState])

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

  // useEffect(() => {
  //   if (userInfoId) {
  //     triggerGetSubscribedAgents()
  //   }
  // }, [userInfoId, triggerGetSubscribedAgents])

  // useEffect(() => {
  //   triggerGetSystemSignalAgents()
  // }, [triggerGetSystemSignalAgents])

  useEffect(() => {
    triggerGetCoinId()
  }, [triggerGetCoinId])

  useEffect(() => {
    triggerGetExchangeInfo()
  }, [triggerGetExchangeInfo])

  useEffect(() => {
    if (userInfoId && isLogin) {
      triggerGetPreference()
    }
  }, [userInfoId, triggerGetPreference, isLogin])

  useEffect(() => {
    if (isOpen) {
      subscribe('strategy-signal-notification', STRATEGY_SIGNAL_SUB_ID)
    }
    return () => {
      unsubscribe('strategy-signal-notification', STRATEGY_SIGNAL_UNSUB_ID)
    }
  }, [subscribe, unsubscribe, isOpen])

  // 初始化时，如果是未登录状态且没有访客信息，调用 generateGuestUser
  useEffect(() => {
    if (isLoginOut && !guestUser) {
      generateGuestUser()
    }
  }, [generateGuestUser, isLoginOut, guestUser])

  useEffect(() => {
    if (isLoginOut && !userInfoId && account_api_key && user_info_id) {
      setUserInfo({
        ...userInfo,
        aiChatKey: account_api_key,
        userInfoId: user_info_id.toString(),
      })
    }
  }, [isLoginOut, userInfoId, userInfo, account_api_key, user_info_id, setUserInfo])

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
            <Header />
            <BodyWrapper $isFixMenu={isFixMenu}>
              <InnerWrapper
                $isOpenFullScreen={isOpenFullScreen}
                $isBackTestPage={isBackTestPage}
                $isChatPage={isChatPage}
                // $isInsightsPage={isInsightsPage}
              >
                <Suspense fallback={<RouteLoading />}>
                  <Routes>
                    <Route path={ROUTER.CHAT} element={<Chat />} />
                    <Route path={ROUTER.VAULTS} element={<Vaults />} />
                    <Route path={ROUTER.VAULT_DETAIL} element={<VaultDetail />} />
                    <Route path={ROUTER.CREATE_STRATEGY} element={<CreateStrategy />} />
                    {/* mainnet limited */}
                    {!isPro && <Route path={ROUTER.MY_PORTFOLIO} element={<MyPortfolio />} />}
                    {isLocalEnv && <Route path={ROUTER.DEMO} element={<DemoPage />} />}
                    <Route path='*' element={<Navigate to={ROUTER.CHAT} replace />} />
                  </Routes>
                </Suspense>
                {/* <Footer /> */}
              </InnerWrapper>
            </BodyWrapper>
          </AppWrapper>
        )}
        <StyledToastContent newestOnTop />
        {deleteAgentModalOpen && <DeleteMyAgentModal />}
        {preferenceModalOpen && <Preference />}
        {accountManegeModalOpen && <AccountManegeModal />}
        {editNicknameModalOpen && <EditNicknameModal />}
        {depositAndWithdrawModalOpen && <DepositAndWithdraw />}
        {connectWalletModalOpen && <ConnectWalletModal />}
        {switchChainModalOpen && <SwitchChainModal />}
        {deployModalOpen && <DeployModal />}
        {promptModalOpen && <PromptModal />}
        {shareStrategyModalOpen && <ShareModal />}
        {pauseStrategyModalOpen && <PauseStrategyModal />}
        {delistStrategyModalOpen && <DelistStrategyModal />}
        {deleteStrategyModalOpen && <DeleteStrategyModal />}
        <TgLogin />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App

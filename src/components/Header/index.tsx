import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { ROUTER } from 'pages/router'
import { isMatchCurrentRouter } from 'utils'
import {
  useCurrentRouter,
  useModalOpen,
  useSettingModalToggle,
  useWalletAddressModalToggle,
} from 'store/application/hooks'
import { IconBase } from 'components/Icons'
import { useGetAuthToken, useIsLogin, useUserInfo } from 'store/login/hooks'
import { WalletAddressModal } from './components/WalletAdressModal'
import { ANI_DURATION } from 'constants/index'
import Avatar from 'boring-avatars'
import { useGetAllInsights, useInsightsList } from 'store/insights/hooks'
import { Setting } from './components/Setting'
import { ApplicationModal } from 'store/application/application'
import { useGetWatchlist } from 'store/setting/hooks'
import logoImg from 'assets/png/logo.png'
import MenuContent from './components/MenuContent'
import { useAddNewThread, useGetThreadsList } from 'store/tradeai/hooks'
import { useIsFixMenu } from 'store/headercache/hooks'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { LoginButton } from './components/LoginButton'
import { TelegramUser } from 'store/login/login.d'
import { getTgLoginUrl } from 'store/login/utils'

const HeaderWrapper = styled.header<{ $isFixMenu: boolean }>`
  position: relative;
  display: flex;
  width: 80px;
  height: 100%;
  flex-shrink: 0;
  z-index: 10;
  background-color: ${({ theme }) => theme.black800};
  &:hover {
    .menu-content {
      transform: translateX(0);
    }
  }
  ${({ $isFixMenu }) =>
    $isFixMenu &&
    css`
      .menu-content {
        transform: translateX(0);
      }
    `}
`

const Menu = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  padding: 20px 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background-color: ${({ theme }) => theme.black800};
  margin-right: 0 !important;
  padding-right: 0 !important;
`

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: #000;
  img {
    width: 28px;
  }
`

const NewThreads = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.text10};
  cursor: pointer;
  .icon-chat-upload {
    font-size: 24px;
    color: ${({ theme }) => theme.textDark54};
  }
`

const NavTabs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

const NavTab = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.textL2};
  cursor: pointer;
  ${({ $active, theme }) =>
    $active &&
    css`
      color: ${theme.textL1};
    `}
  &:hover {
    .icon-wrapper {
      background-color: ${({ theme }) => theme.bgT20};
      i {
        color: ${({ theme }) => theme.textL1};
      }
    }
  }
`

const IconWrapper = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: transparent;
  i {
    font-size: 24px;
    color: ${({ theme }) => theme.textL3};
    transition: all ${ANI_DURATION}s;
  }
  transition: all ${ANI_DURATION}s;
  ${({ $active, theme }) =>
    $active &&
    css`
      background-color: ${theme.bgT20};
      i {
        color: ${theme.textL1};
      }
    `}
`

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Language = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  .icon-language {
    font-size: 24px;
    color: ${({ theme }) => theme.textL3};
  }
`

const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: ${({ theme }) => theme.textL1};
  cursor: pointer;
`

{
  /* <Avatar name={evmAddress} size={32} /> */
}
export const Header = () => {
  const isLogin = useIsLogin()
  const [{ evmAddress }] = useUserInfo()
  const getWatchlist = useGetWatchlist()
  const [insightsList] = useInsightsList()
  const addNewThread = useAddNewThread()
  const [isFixMenu] = useIsFixMenu()
  const isInNavTabRef = useRef(false)
  const scrollRef = useScrollbarClass<HTMLDivElement>()
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const [currentRouter, setCurrentRouter] = useCurrentRouter()
  const [currentHoverMenuKey, setCurrentHoverMenuKey] = useState<string>(currentRouter)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const settingModalOpen = useModalOpen(ApplicationModal.SETTING_MODAL)
  const walletAddressModalOpen = useModalOpen(ApplicationModal.WALLET_ADDRESS_MODAL)
  const triggerGetAuthToken = useGetAuthToken()
  const toggleSettingModal = useSettingModalToggle()
  const triggerGetAllInsights = useGetAllInsights()
  const toggleWalletAddressModal = useWalletAddressModalToggle()
  const goOtherPage = useCallback(
    (value: string) => {
      if (isMatchCurrentRouter(currentRouter, value)) return
      setCurrentRouter(value)
    },
    [currentRouter, setCurrentRouter],
  )

  const handleNavTabHover = useCallback((key: string) => {
    isInNavTabRef.current = true
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setCurrentHoverMenuKey(key)
  }, [])

  const handleMenuHover = useCallback(() => {
    if (isInNavTabRef.current) return
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setCurrentHoverMenuKey(currentRouter)
    }, 500)
  }, [currentRouter])

  const handleMenuContentHover = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // const isInsightsPage = useMemo(() => {
  //   return isMatchCurrentRouter(currentRouter, ROUTER.INSIGHTS)
  // }, [currentRouter])

  const unReadCount = useMemo(() => {
    return insightsList.filter((insight) => !insight.isRead).length
  }, [insightsList])

  const menuList = useMemo(() => {
    return [
      {
        key: ROUTER.TRADE_AI,
        text: <Trans>Home</Trans>,
        icon: <IconBase className='icon-home' />,
        value: ROUTER.TRADE_AI,
        clickCallback: goOtherPage,
      },
      // {
      //   key: ROUTER.INSIGHTS,
      //   text: <Trans>Insights</Trans>,
      //   icon: <IconBase className="icon-insights" />,
      //   value: ROUTER.INSIGHTS,
      //   clickCallback: goOtherPage,
      // },
      {
        key: ROUTER.AGENT_HUB,
        text: <Trans>Agent Hub</Trans>,
        icon: <IconBase className='icon-agent' />,
        value: ROUTER.AGENT_HUB,
        clickCallback: goOtherPage,
      },
      {
        key: ROUTER.MY_AGENT,
        text: <Trans>My agent</Trans>,
        icon: <IconBase className='icon-task' />,
        value: ROUTER.MY_AGENT,
        clickCallback: goOtherPage,
      },
      {
        key: ROUTER.PORTFOLIO,
        text: <Trans>Portfolio</Trans>,
        icon: <IconBase className='icon-portfolio' />,
        value: ROUTER.PORTFOLIO,
        clickCallback: goOtherPage,
      },
    ]
  }, [goOtherPage])

  const goConnectPage = useCallback(() => {
    setCurrentRouter(ROUTER.CONNECT)
  }, [setCurrentRouter])

  const getThreadsList = useCallback(async () => {
    try {
      if (!evmAddress) return
      await triggerGetAiBotChatThreads({
        evmAddress,
      })
    } catch (error) {
      console.log(error)
    }
  }, [triggerGetAiBotChatThreads, evmAddress])

  const handleLogin = useCallback(
    async (user: TelegramUser) => {
      console.log(user)
      try {
        await triggerGetAuthToken(user)
      } catch (error) {
        console.log(error)
      }
    },
    [triggerGetAuthToken],
  )

  const loginDirect = useCallback(() => {
    window.location.href = getTgLoginUrl()
  }, [])

  // useEffect(() => {
  //   if (isLogin && insightsList.length === 0 && !isInsightsPage) {
  //     triggerGetAllInsights({ pageIndex: 1 })
  //   }
  // }, [isLogin, insightsList.length, isInsightsPage, triggerGetAllInsights])

  useEffect(() => {
    if (evmAddress) {
      getWatchlist()
    }
  }, [evmAddress, getWatchlist])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    getThreadsList()
  }, [getThreadsList])

  return (
    <HeaderWrapper $isFixMenu={isFixMenu}>
      <Menu ref={scrollRef} className='scroll-style' onMouseMove={handleMenuHover}>
        <TopSection>
          <LogoWrapper>
            <img src={logoImg} alt='' />
          </LogoWrapper>
          <NewThreads onClick={addNewThread}>
            <IconBase className='icon-chat-upload' />
          </NewThreads>
          <NavTabs>
            {menuList.map((tab) => {
              const { key, text, value, clickCallback, icon } = tab
              const isActive = isMatchCurrentRouter(currentRouter, value)
              return (
                <NavTab
                  key={key}
                  $active={isActive}
                  onClick={() => clickCallback(value)}
                  onMouseEnter={() => handleNavTabHover(key)}
                  onMouseLeave={() => (isInNavTabRef.current = false)}
                >
                  <IconWrapper $active={isActive} className='icon-wrapper'>
                    {icon}
                  </IconWrapper>
                  <span>{text}</span>
                </NavTab>
              )
            })}
          </NavTabs>
        </TopSection>
        <BottomSection>
          <Language>
            <IconBase className='icon-language' />
          </Language>
          <LoginButton onAuth={handleLogin}></LoginButton>
          <AvatarWrapper onClick={loginDirect}>
            {isLogin ? <Avatar name={evmAddress} size={40} /> : <Trans>Log In</Trans>}
          </AvatarWrapper>
        </BottomSection>
      </Menu>
      <MenuContent
        currentHoverMenuKey={currentHoverMenuKey}
        onMouseEnter={handleMenuContentHover}
        onMouseLeave={handleMenuHover}
      />
      {walletAddressModalOpen && <WalletAddressModal />}
      {settingModalOpen && <Setting />}
    </HeaderWrapper>
  )
}

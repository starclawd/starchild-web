import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { ROUTER } from 'pages/router'
import { isMatchCurrentRouter, isMatchFatherRouter } from 'utils'
import { useCurrentRouter, useModalOpen } from 'store/application/hooks'
import { IconBase } from 'components/Icons'
import { useUserInfo } from 'store/login/hooks'
import { WalletAddressModal } from './components/WalletAdressModal'
import { ANI_DURATION } from 'constants/index'
import { Setting } from './components/Setting'
import { ApplicationModal } from 'store/application/application'
import logoImg from 'assets/png/logo.png'
import MenuContent from './components/MenuContent'
import { useAddNewThread, useGetThreadsList } from 'store/chat/hooks'
import { useIsFixMenu } from 'store/headercache/hooks'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import LoginButton from './components/LoginButton'
import Language from './components/Language'

const HeaderWrapper = styled.header<{ $isFixMenu: boolean; $isHoverBottomSection: boolean }>`
  position: relative;
  display: flex;
  width: 80px;
  height: 100%;
  flex-shrink: 0;
  z-index: 101;
  background-color: ${({ theme }) => theme.black800};
  &:hover {
    ${({ $isHoverBottomSection }) =>
      !$isHoverBottomSection &&
      css`
        .menu-content {
          transform: translateX(0);
        }
      `}
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
  flex-grow: 1;
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
  text-transform: capitalize;
  text-align: center;
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

{
  /* <Avatar name={telegramUserId} size={32} /> */
}
export const Header = () => {
  const [{ telegramUserId }] = useUserInfo()
  const addNewThread = useAddNewThread()
  const [isFixMenu] = useIsFixMenu()
  const isInNavTabRef = useRef(false)
  const scrollRef = useScrollbarClass<HTMLDivElement>()
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const [currentRouter, setCurrentRouter] = useCurrentRouter()
  const [currentHoverMenuKey, setCurrentHoverMenuKey] = useState<string>(currentRouter)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isHoverBottomSection, setIsHoverBottomSection] = useState(false)
  const settingModalOpen = useModalOpen(ApplicationModal.SETTING_MODAL)
  const walletAddressModalOpen = useModalOpen(ApplicationModal.WALLET_ADDRESS_MODAL)
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

  const menuList = useMemo(() => {
    return [
      {
        key: ROUTER.CHAT,
        text: <Trans>Home</Trans>,
        icon: <IconBase className='icon-home' />,
        value: ROUTER.CHAT,
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
        text: <Trans>Agent market</Trans>,
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
      // {
      //   key: ROUTER.PORTFOLIO,
      //   text: <Trans>Portfolio</Trans>,
      //   icon: <IconBase className='icon-portfolio' />,
      //   value: ROUTER.PORTFOLIO,
      //   clickCallback: goOtherPage,
      // },
    ]
  }, [goOtherPage])

  const getThreadsList = useCallback(async () => {
    try {
      if (!telegramUserId) return
      await triggerGetAiBotChatThreads({
        telegramUserId,
      })
    } catch (error) {
      console.log(error)
    }
  }, [triggerGetAiBotChatThreads, telegramUserId])

  // useEffect(() => {
  //   if (isLogin && insightsList.length === 0 && !isInsightsPage) {
  //     triggerGetAllInsights({ pageIndex: 1 })
  //   }
  // }, [isLogin, insightsList.length, isInsightsPage, triggerGetAllInsights])

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

  useEffect(() => {
    setCurrentHoverMenuKey(currentRouter)
  }, [currentRouter])

  return (
    <HeaderWrapper $isFixMenu={isFixMenu} $isHoverBottomSection={isHoverBottomSection}>
      <Menu ref={scrollRef} className='scroll-style' onMouseMove={handleMenuHover}>
        <TopSection onMouseEnter={() => setIsHoverBottomSection(false)}>
          <LogoWrapper>
            <img src={logoImg} alt='' />
          </LogoWrapper>
          <NewThreads onClick={addNewThread}>
            <IconBase className='icon-chat-upload' />
          </NewThreads>
          <NavTabs>
            {menuList.map((tab) => {
              const { key, text, value, clickCallback, icon } = tab
              const isActive = isMatchFatherRouter(currentRouter, value) || isMatchCurrentRouter(currentRouter, value)
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
        <BottomSection
          onMouseEnter={() => setIsHoverBottomSection(true)}
          onMouseLeave={() => setIsHoverBottomSection(false)}
        >
          <Language />
          <LoginButton />
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

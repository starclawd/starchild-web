import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { ROUTER } from 'pages/router'
import { isMatchCurrentRouter, isMatchFatherRouter } from 'utils'
import { useCurrentRouter, useIsPopoverOpen } from 'store/application/hooks'
import { IconBase } from 'components/Icons'
import { useUserInfo, useIsLogin } from 'store/login/hooks'
import { ANI_DURATION } from 'constants/index'
import logoImg from 'assets/png/logo.png'
import MenuContent from './components/MenuContent'
import { useAddNewThread, useGetThreadsList } from 'store/chat/hooks'
import { useIsFixMenu } from 'store/headercache/hooks'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import LoginButton from './components/LoginButton'
import Language from './components/Language'
import Tooltip from 'components/Tooltip'

const HeaderWrapper = styled.header<{ $isFixMenu: boolean; $isHoverNavTabs: boolean; $isPopoverOpen: boolean }>`
  position: relative;
  display: flex;
  width: 80px;
  height: 100%;
  flex-shrink: 0;
  z-index: 101;
  background-color: ${({ theme }) => theme.black800};
  ${({ $isHoverNavTabs }) =>
    $isHoverNavTabs &&
    css`
      .menu-content {
        transform: translateX(0);
      }
    `}
  ${({ $isFixMenu }) =>
    $isFixMenu &&
    css`
      .menu-content {
        transform: translateX(0);
      }
    `}
  ${({ $isPopoverOpen }) =>
    $isPopoverOpen &&
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
  .popover-wrapper {
    height: auto;
  }
`

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
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
  transition: all ${ANI_DURATION}s;
  .icon-chat-upload {
    font-size: 24px;
    color: ${({ theme }) => theme.textDark54};
  }
  &:hover {
    opacity: 0.7;
  }
`

const NavTabs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

const NavTab = styled.div<{ $active: boolean; $key: string }>`
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
  text-align: center;
  &:hover {
    .icon-wrapper {
      background-color: ${({ theme }) => theme.bgT20};
      i {
        color: ${({ theme }) => theme.textL1};
      }
    }
  }
  ${({ $active, theme }) =>
    $active &&
    css`
      color: ${theme.textL1};
    `}
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

export const Header = () => {
  const [{ userInfoId }] = useUserInfo()
  const addNewThread = useAddNewThread()
  const [isFixMenu] = useIsFixMenu()
  const isInNavTabRef = useRef(false)
  const scrollRef = useScrollbarClass<HTMLDivElement>()
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const [currentRouter, setCurrentRouter] = useCurrentRouter()
  const [currentHoverMenuKey, setCurrentHoverMenuKey] = useState<string>(currentRouter)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isHoverNavTabs, setIsHoverNavTabs] = useState(false)
  const [isPopoverOpen] = useIsPopoverOpen()

  const goOtherPage = useCallback(
    (value: string) => {
      if (value === ROUTER.CHAT) {
        addNewThread()
      }
      if (isMatchCurrentRouter(currentRouter, value)) return
      setCurrentRouter(value)
    },
    [currentRouter, addNewThread, setCurrentRouter],
  )

  const handleNavTabHover = useCallback(
    (key: string) => {
      isInNavTabRef.current = true
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      // 当 isFixMenu 为 true 时，不改变 hover 的菜单
      if (!isFixMenu) {
        setCurrentHoverMenuKey(key)
      }
    },
    [isFixMenu],
  )

  const handleMenuHover = useCallback(() => {
    if (isInNavTabRef.current) return
    // 当 isFixMenu 为 true 时，不需要恢复到当前路由的菜单
    if (isFixMenu) return
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setCurrentHoverMenuKey(currentRouter)
    }, 500)
  }, [currentRouter, isFixMenu])

  const handleMenuContentHover = useCallback(() => {
    // 鼠标进入 MenuContent 时，保持显示状态
    setIsHoverNavTabs(true)
    // 清除恢复菜单内容的延时器，防止在MenuContent中切换回原来的菜单
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const handleMenuContentLeave = useCallback(() => {
    // 当 isFixMenu 为 true 时，不隐藏菜单，也不恢复到当前路由的菜单
    if (isFixMenu) return

    // 鼠标离开 MenuContent 时，隐藏菜单
    setIsHoverNavTabs(false)

    // 设置延时，2秒后恢复到当前路由对应的菜单内容
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setCurrentHoverMenuKey(currentRouter)
    }, 2000)
  }, [currentRouter, isFixMenu])

  const handleNavTabsLeave = useCallback(() => {
    // 当 isFixMenu 为 true 时，不隐藏菜单，也不恢复到当前路由的菜单
    if (isFixMenu) {
      isInNavTabRef.current = false
      return
    }

    // 离开 NavTabs 区域时的处理
    setIsHoverNavTabs(false)
    isInNavTabRef.current = false

    // 设置延时，2秒后恢复到当前路由对应的菜单内容
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setCurrentHoverMenuKey(currentRouter)
    }, 2000)
  }, [currentRouter, isFixMenu])
  // const isInsightsPage = useMemo(() => {
  //   return isMatchCurrentRouter(currentRouter, ROUTER.SIGNALS)
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
      {
        key: ROUTER.VAULTS,
        text: <Trans>Vibe trading</Trans>,
        icon: <IconBase className='icon-vibe-trading' />,
        value: ROUTER.VAULTS,
        clickCallback: goOtherPage,
      },
      // {
      //   key: ROUTER.AGENT_HUB,
      //   text: <Trans>Marketplace</Trans>,
      //   icon: <IconBase className='icon-agent' />,
      //   value: ROUTER.AGENT_HUB,
      //   clickCallback: goOtherPage,
      // },
      {
        key: ROUTER.SIGNALS,
        text: <Trans>Insights</Trans>,
        icon: <IconBase className='icon-insights' />,
        value: ROUTER.SIGNALS,
        clickCallback: goOtherPage,
      },
      // {
      //   key: ROUTER.MY_AGENTS,
      //   text: <Trans>My Agents</Trans>,
      //   icon: <IconBase className='icon-task' />,
      //   value: ROUTER.MY_AGENTS,
      //   clickCallback: goOtherPage,
      // },
      {
        key: ROUTER.MY_VAULT,
        text: <Trans>My</Trans>,
        icon: <IconBase className='icon-customize-avatar' />,
        value: ROUTER.MY_VAULT,
        clickCallback: goOtherPage,
      },
    ]
  }, [goOtherPage])

  const getThreadsList = useCallback(async () => {
    try {
      if (!userInfoId) return
      await triggerGetAiBotChatThreads()
    } catch (error) {
      console.log(error)
    }
  }, [triggerGetAiBotChatThreads, userInfoId])

  const goHomePage = useCallback(() => {
    setCurrentRouter(ROUTER.HOME)
  }, [setCurrentRouter])

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

  // 当 isFixMenu 变为 false 时，立即隐藏menu
  useEffect(() => {
    if (!isFixMenu) {
      setIsHoverNavTabs(false)
      // 清除所有延时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      // 重置为当前路由
      setCurrentHoverMenuKey(currentRouter)
    }
  }, [isFixMenu, currentRouter])

  return (
    <HeaderWrapper $isFixMenu={isFixMenu} $isHoverNavTabs={isHoverNavTabs} $isPopoverOpen={isPopoverOpen}>
      <Menu ref={scrollRef} className='scroll-style'>
        <TopSection>
          <LogoWrapper onClick={goHomePage}>
            <img src={logoImg} alt='' />
          </LogoWrapper>
          <Tooltip placement='right' content={<Trans>New Chat</Trans>}>
            <NewThreads onClick={() => goOtherPage(ROUTER.CHAT)}>
              <IconBase className='icon-chat-upload' />
            </NewThreads>
          </Tooltip>
          <NavTabs onMouseEnter={() => setIsHoverNavTabs(true)} onMouseLeave={handleNavTabsLeave}>
            {menuList.map((tab) => {
              const { key, text, value, clickCallback, icon } = tab
              const isActive = isMatchFatherRouter(currentRouter, value) || isMatchCurrentRouter(currentRouter, value)
              return (
                <NavTab
                  key={key}
                  $key={key}
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
          <Language />
          <LoginButton />
        </BottomSection>
      </Menu>
      {/* vibe trading不展示二级菜单 */}
      {!isMatchCurrentRouter(currentHoverMenuKey, ROUTER.VAULTS) && (
        <MenuContent
          currentHoverMenuKey={currentHoverMenuKey}
          onMouseEnter={handleMenuContentHover}
          onMouseLeave={handleMenuContentLeave}
        />
      )}
    </HeaderWrapper>
  )
}

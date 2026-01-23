import { Trans } from '@lingui/react/macro'
import Language from 'pages/components/Header/components/Language'
import LoginButton from 'pages/components/Header/components/LoginButton'
import ThreadList from 'pages/components/Header/components/MenuContent/components/ThreadList'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import logoImg from 'assets/png/logo.png'
import { vm } from 'pages/helper'
import { ROUTER } from 'pages/router'
import { useCallback, useState, useRef, useMemo, useEffect } from 'react'
import { useCurrentRouter, useIsShowMobileMenu, useSetCurrentRouter } from 'store/application/hooks'
import { useAddNewThread, useGetThreadsList } from 'store/chat/hooks'
import { useCurrentActiveNavKey } from 'store/headercache/hooks'
import styled, { css } from 'styled-components'
import { isMatchCurrentRouter, isMatchFatherRouter } from 'utils'
import { useUserInfo } from 'store/login/hooks'

const MobileMenuWrapper = styled.div<{
  $isShowMobileMenu: boolean
  $isDragging: boolean
  $dragOffset: number
}>`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  width: 73.6vw;
  height: 100dvh;
  z-index: 20;
  transform: translateX(-100%);
  transition: ${({ $isDragging }) => ($isDragging ? 'none' : `transform ${ANI_DURATION}s`)};
  ${({ $isShowMobileMenu, $dragOffset }) => {
    if ($isShowMobileMenu) {
      return css`
        transform: translateX(${$dragOffset}px);
      `
    }
    return css`
      transform: translateX(-100%);
    `
  }}
`

const MenuMask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  z-index: 1;
  background-color: transparent;
`

const MenuContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${vm(16)};
  z-index: 20;
  width: 100%;
  height: 100%;
  padding: 0 ${vm(16)} ${vm(24)};
  background-color: ${({ theme }) => theme.black800};
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  height: ${vm(44)};
  span {
    display: flex;
    align-items: center;
    width: auto;
    height: 100%;
  }
  .icon-chat-delete {
    font-size: 0.24rem;
    color: ${({ theme }) => theme.black200};
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - ${vm(116)});
  gap: ${vm(16)};
  overflow-y: auto;
  overflow-x: hidden;
  > .popover-wrapper {
    width: fit-content;
    height: auto;
    .pop-wrapper {
      width: fit-content;
    }
    .pop-children {
      width: fit-content;
      align-items: flex-start;
    }
  }
`

const NewChat = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: ${vm(40)};
  padding: 0 ${vm(8)};
  gap: ${vm(6)};
  font-size: 0.14rem;
  font-weight: 400;
  line-height: 0.2rem;
  color: ${({ theme }) => theme.black100};
  .icon-chat-new {
    font-size: 0.18rem;
  }
`

const NavWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Features = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  height: ${vm(32)};
  padding: ${vm(8)};
  font-size: 0.14rem;
  line-height: 0.2rem;
  color: ${({ theme }) => theme.black200};
`

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  .pop-children {
    width: 100%;
    align-items: flex-start;
  }
`

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const NavTitle = styled.div<{ $active: boolean; $keyActive: boolean; $isSticky: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: ${vm(40)};
  padding: ${vm(8)};
  border-radius: ${vm(8)};
  background-color: transparent;
  .icon-chat-expand-down {
    font-size: 0.14rem;
    color: ${({ theme }) => theme.black200};
    transform: rotate(0);
    transition: transform ${ANI_DURATION}s;
  }
  ${({ $active }) =>
    $active &&
    css`
      background-color: ${({ theme }) => theme.black800};
    `}
  ${({ $keyActive }) =>
    $keyActive &&
    css`
      position: sticky;
      top: 0;
      z-index: 10;
      .icon-chat-expand-down {
        transform: rotate(180deg);
        color: ${({ theme }) => theme.black100};
      }
    `}
  ${({ $isSticky }) =>
    $isSticky &&
    css`
      background-color: ${({ theme }) => theme.black800};
    `}
`

const SubList = styled.div<{ $key: string; $active: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 0;
  padding: 0 0 0 ${vm(24)};
  overflow: hidden;
  transition:
    max-height ${ANI_DURATION}s,
    padding ${ANI_DURATION}s;
  ${({ $active, $key }) =>
    $active &&
    css`
      max-height: ${$key === ROUTER.MY_SIGNALS || $key === ROUTER.SIGNALS ? vm(31200) : vm(304)};
      padding: ${vm(8)} 0 ${vm(8)} ${vm(24)};
    `}
`

const SubItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: ${vm(36)};
  font-size: 0.13rem;
  font-weight: 400;
  line-height: 0.2rem;
  color: ${({ theme }) => theme.black100};
  padding: ${vm(8)};
  border-radius: ${vm(8)};
  ${({ $active }) =>
    $active &&
    css`
      background-color: ${({ theme }) => theme.black900};
    `}
`

const LeftWrapper = styled.div<{ $key: string }>`
  display: flex;
  align-items: center;
  gap: ${vm(6)};
  font-size: 0.14rem;
  font-weight: 400;
  line-height: 0.2rem;
  color: ${({ theme }) => theme.black100};
  i {
    font-size: 0.18rem;
  }
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: ${vm(40)};
`

export default function MobileMenu() {
  const [isShowMobileMenu, setIsShowMobileMenu] = useIsShowMobileMenu()
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const addNewThread = useAddNewThread()
  const currentRouter = useCurrentRouter()
  const setCurrentRouter = useSetCurrentRouter()
  const startX = useRef(0)
  const currentX = useRef(0)
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const [currentActiveNavKey, setCurrentActiveNavKey] = useCurrentActiveNavKey()
  const [{ userInfoId }] = useUserInfo()
  const [isTrulySticky, setIsTrulySticky] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const navTitleRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const subItemClick = useCallback(
    (router: string) => {
      setIsShowMobileMenu(false)
      if (isMatchCurrentRouter(currentRouter, router)) return
      setCurrentRouter(router)
    },
    [currentRouter, setIsShowMobileMenu, setCurrentRouter],
  )

  const changeCurrentActiveNavKey = useCallback(
    (key: string) => {
      return () => {
        if (key === currentActiveNavKey) {
          setCurrentActiveNavKey('')
        } else {
          setCurrentActiveNavKey(key)
        }
      }
    },
    [currentActiveNavKey, setCurrentActiveNavKey],
  )

  const navList = useMemo(() => {
    return [
      // {
      //   key: ROUTER.VAULTS,
      //   title: <Trans>Vibe trading</Trans>,
      //   icon: 'icon-vibe-trading',
      //   value: ROUTER.VAULTS,
      //   clickCallback: changeCurrentActiveNavKey(ROUTER.VAULTS),
      //   hasSubList: false,
      //   subList: [],
      // },
      // {
      //   key: ROUTER.SIGNALS,
      //   title: <Trans>Insights</Trans>,
      //   icon: 'icon-insights',
      //   value: ROUTER.SIGNALS,
      //   clickCallback: changeCurrentActiveNavKey(ROUTER.SIGNALS),
      //   hasSubList: true,
      //   subList: [
      //     { key: ROUTER.AGENT_HUB, title: <Trans>Agent marketplace</Trans>, value: ROUTER.AGENT_HUB },
      //     { key: ROUTER.SIGNALS, title: <Trans>Signals</Trans>, value: ROUTER.SIGNALS },
      //     { key: ROUTER.LIVECHAT, title: <Trans>Live chat</Trans>, value: ROUTER.LIVECHAT },
      //   ],
      // },
      {
        key: ROUTER.MY_SIGNALS,
        title: <Trans>My</Trans>,
        icon: 'icon-menu-login',
        value: ROUTER.MY_SIGNALS,
        clickCallback: () => {
          changeCurrentActiveNavKey(ROUTER.MY_SIGNALS)
          setCurrentRouter(ROUTER.MY_SIGNALS)
          setIsShowMobileMenu(false)
        },
        hasSubList: false,
        subList: [
          // { key: ROUTER.MY_AGENTS, title: <Trans>My agents</Trans>, value: ROUTER.MY_AGENTS },
          // { key: ROUTER.MY_FUND_AGENT, title: <Trans>My strategy</Trans>, value: ROUTER.MY_FUND_AGENT },
          // { key: ROUTER.PORTFOLIO, title: <Trans>My vault</Trans>, value: ROUTER.PORTFOLIO },
        ],
      },
    ]
  }, [changeCurrentActiveNavKey, setCurrentRouter, setIsShowMobileMenu])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    currentX.current = e.touches[0].clientX
    setIsDragging(true)
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return

      currentX.current = e.touches[0].clientX
      const deltaX = currentX.current - startX.current

      // 只允许向左拖动（deltaX < 0）
      if (deltaX < 0) {
        setDragOffset(deltaX)
      }
    },
    [isDragging],
  )

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return

    const deltaX = currentX.current - startX.current

    setIsDragging(false)

    // 如果向左拖动距离大于50px，则关闭菜单
    if (Math.abs(deltaX) > 50 && deltaX < 0) {
      setIsShowMobileMenu(false)
    }

    // 重置拖动偏移量
    setDragOffset(0)
  }, [isDragging, setIsShowMobileMenu])

  const changeIsShowMobileMenu = useCallback(() => {
    setIsShowMobileMenu(false)
  }, [setIsShowMobileMenu])

  const newChatClick = useCallback(() => {
    setCurrentRouter(ROUTER.CHAT)
    addNewThread()
    setIsShowMobileMenu(false)
  }, [addNewThread, setCurrentRouter, setIsShowMobileMenu])

  const closeMenu = useCallback(() => {
    setIsShowMobileMenu(false)
  }, [setIsShowMobileMenu])

  const goHomePage = useCallback(() => {
    setIsShowMobileMenu(false)
  }, [setIsShowMobileMenu])

  const getThreadsList = useCallback(async () => {
    try {
      if (!userInfoId) return
      await triggerGetAiBotChatThreads()
    } catch (error) {
      console.log(error)
    }
  }, [triggerGetAiBotChatThreads, userInfoId])

  // 设置 NavTitle 的 ref
  const setNavTitleRef = useCallback((key: string, element: HTMLDivElement | null) => {
    if (element) {
      navTitleRefs.current.set(key, element)
    } else {
      navTitleRefs.current.delete(key)
    }
  }, [])

  // 监听滚动，检测元素是否真正吸顶
  const handleScroll = useCallback(() => {
    if (!contentRef.current || !currentActiveNavKey) {
      setIsTrulySticky(false)
      return
    }

    const targetElement = navTitleRefs.current.get(currentActiveNavKey)
    if (!targetElement) return

    // 获取元素相对于滚动容器的位置
    const contentRect = contentRef.current.getBoundingClientRect()
    const titleRect = targetElement.getBoundingClientRect()

    // 计算元素相对于容器顶部的距离
    const distanceFromTop = titleRect.top - contentRect.top

    // 当距离为 0（或接近 0）时，说明元素已经吸顶
    // 使用 1px 的容差来避免精度问题
    setIsTrulySticky(distanceFromTop <= 1 && distanceFromTop >= -1)
  }, [currentActiveNavKey])

  // 监听滚动事件
  useEffect(() => {
    const container = contentRef.current
    if (!container || !currentActiveNavKey) {
      setIsTrulySticky(false)
      return
    }

    container.addEventListener('scroll', handleScroll)
    // 初始检查一次
    handleScroll()

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [currentActiveNavKey, handleScroll])

  // 当展开状态变化时，重置状态
  useEffect(() => {
    if (currentActiveNavKey) {
      setIsTrulySticky(false)
      if (contentRef.current) {
        contentRef.current.scrollTop = 0
      }
    }
  }, [currentActiveNavKey])

  useEffect(() => {
    getThreadsList()
  }, [getThreadsList])

  return (
    <MobileMenuWrapper
      $isShowMobileMenu={isShowMobileMenu}
      $isDragging={isDragging}
      $dragOffset={dragOffset}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {isShowMobileMenu && <MenuMask onClick={changeIsShowMobileMenu} />}
      <MenuContent>
        <Header>
          <span onClick={goHomePage}>
            <img src={logoImg} alt='' width={32} height={32} />
          </span>
          <span onClick={changeIsShowMobileMenu}>
            <IconBase className='icon-chat-delete' />
          </span>
        </Header>
        <Content ref={contentRef}>
          <NewChat onClick={newChatClick}>
            <IconBase className='icon-chat-new' />
            <span>
              <Trans>New Chat</Trans>
            </span>
          </NewChat>
          {/* <NavWrapper>
            <Features>
              <Trans>Features</Trans>
            </Features>
            <NavList>
              {navList.map((item) => {
                const { key, title, icon, value, subList, hasSubList, clickCallback } = item
                const isActive = isMatchCurrentRouter(currentRouter, value) || isMatchFatherRouter(currentRouter, value)
                return (
                  <NavItem key={key} onClick={() => clickCallback?.()}>
                    <NavTitle
                      ref={(el) => setNavTitleRef(key, el)}
                      $active={isActive}
                      $keyActive={currentActiveNavKey === key}
                      $isSticky={isTrulySticky && currentActiveNavKey === key}
                    >
                      <LeftWrapper $key={key}>
                        <IconBase className={icon} />
                        <span>{title}</span>
                      </LeftWrapper>
                      {hasSubList && <IconBase className='icon-chat-expand-down' />}
                    </NavTitle>
                    {hasSubList && (
                      <SubList $key={key} $active={currentActiveNavKey === key}>
                        {subList.map((subItem) => {
                          const { key, title, value } = subItem
                          const isActive = isMatchCurrentRouter(currentRouter, value)
                          return (
                            <SubItem
                              key={key}
                              $active={isActive}
                              onClick={(e) => {
                                e.stopPropagation()
                                subItemClick(value)
                              }}
                            >
                              <span>{title}</span>
                            </SubItem>
                          )
                        })}
                      </SubList>
                    )}
                  </NavItem>
                )
              })}
            </NavList>
          </NavWrapper> */}
          <ThreadList isMobileMenu mobileMenuCallback={closeMenu} />
        </Content>
        <Footer>
          <LoginButton />
          <Language />
        </Footer>
      </MenuContent>
    </MobileMenuWrapper>
  )
}

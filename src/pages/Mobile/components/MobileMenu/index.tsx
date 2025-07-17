import { Trans } from '@lingui/react/macro'
import Language from 'components/Header/components/Language'
import LoginButton from 'components/Header/components/LoginButton'
import ThreadList from 'components/Header/components/MenuContent/components/ThreadList'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { ROUTER } from 'pages/router'
import { useCallback, useState, useRef, useMemo } from 'react'
import { useCurrentRouter, useIsShowMobileMenu } from 'store/application/hooks'
import { useAddNewThread } from 'store/tradeai/hooks'
import styled, { css } from 'styled-components'
import { isMatchCurrentRouter, isMatchFatherRouter } from 'utils'

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
  .icon-logo-big {
    font-size: 0.66rem;
    line-height: 0.18rem;
    color: ${({ theme }) => theme.white};
  }
  .icon-chat-delete {
    font-size: 0.24rem;
    color: ${({ theme }) => theme.textDark54};
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
`

const NewChat = styled.div`
  display: flex;
  align-items: center;
  height: ${vm(40)};
  gap: ${vm(6)};
  font-size: 0.14rem;
  font-weight: 400;
  line-height: 0.2rem;
  color: ${({ theme }) => theme.textL2};
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
  color: ${({ theme }) => theme.textL3};
`

const NavList = styled.div`
  display: flex;
  flex-direction: column;
`

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
`

const NavTitle = styled.div<{ $active: boolean; $keyActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: ${vm(40)};
  padding: ${vm(8)};
  border-radius: ${vm(8)};
  .icon-play {
    font-size: 0.14rem;
    color: ${({ theme }) => theme.textDark54};
    transform: rotate(90deg);
    transition: transform ${ANI_DURATION}s;
  }
  ${({ $active }) =>
    $active &&
    css`
      background-color: ${({ theme }) => theme.bgT20};
    `}
  ${({ $keyActive }) =>
    $keyActive &&
    css`
      .icon-play {
        transform: rotate(270deg);
      }
    `}
`

const SubList = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 0;
  padding: 0;
  overflow: hidden;
  transition:
    max-height ${ANI_DURATION}s,
    padding ${ANI_DURATION}s;
  ${({ $active }) =>
    $active &&
    css`
      max-height: ${vm(304)};
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
  color: ${({ theme }) => theme.textL2};
  padding: ${vm(8)};
  border-radius: ${vm(8)};
  ${({ $active }) =>
    $active &&
    css`
      background-color: ${({ theme }) => theme.bgT10};
    `}
`

const LeftWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${vm(6)};
  font-size: 0.14rem;
  font-weight: 400;
  line-height: 0.2rem;
  color: ${({ theme }) => theme.textL2};
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
  const [currentRouter, setCurrentRouter] = useCurrentRouter()
  const startX = useRef(0)
  const currentX = useRef(0)
  const [currentActiveNavKey, setCurrentActiveNavKey] = useState<string>('')
  const goOtherPage = useCallback(
    (value: string) => {
      if (isMatchCurrentRouter(value, ROUTER.TRADE_AI)) {
        setIsShowMobileMenu(false)
      }
      if (isMatchCurrentRouter(currentRouter, value)) return
      setCurrentRouter(value)
    },
    [currentRouter, setIsShowMobileMenu, setCurrentRouter],
  )

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
    [currentActiveNavKey],
  )

  const navList = useMemo(() => {
    return [
      {
        key: ROUTER.TRADE_AI,
        title: <Trans>Home</Trans>,
        icon: 'icon-home',
        value: ROUTER.TRADE_AI,
        clickCallback: goOtherPage,
        hasSubList: false,
        subList: [],
      },
      {
        key: ROUTER.AGENT_HUB,
        title: <Trans>Marketplace</Trans>,
        icon: 'icon-agent',
        value: ROUTER.AGENT_HUB,
        clickCallback: changeCurrentActiveNavKey(ROUTER.AGENT_HUB),
        hasSubList: true,
        subList: [
          {
            key: ROUTER.AGENT_HUB,
            title: <Trans>Discover Agents</Trans>,
            value: ROUTER.AGENT_HUB,
          },
          {
            key: ROUTER.AGENT_HUB_INDICATOR,
            title: <Trans>Indicator Hub</Trans>,
            value: ROUTER.AGENT_HUB_INDICATOR,
          },
          {
            key: ROUTER.AGENT_HUB_STRATEGY,
            title: <Trans>Strategy Hub</Trans>,
            value: ROUTER.AGENT_HUB_STRATEGY,
          },
          {
            key: ROUTER.AGENT_HUB_SIGNAL,
            title: <Trans>Signal Scanner</Trans>,
            value: ROUTER.AGENT_HUB_SIGNAL,
          },
          {
            key: ROUTER.AGENT_HUB_KOL,
            title: <Trans>KOL Radar</Trans>,
            value: ROUTER.AGENT_HUB_KOL,
          },
          {
            key: ROUTER.AGENT_HUB_BRIEFING,
            title: <Trans>Auto Briefing</Trans>,
            value: ROUTER.AGENT_HUB_BRIEFING,
          },
          {
            key: ROUTER.AGENT_HUB_PULSE,
            title: <Trans>Market Pulse</Trans>,
            value: ROUTER.AGENT_HUB_PULSE,
          },
          {
            key: ROUTER.AGENT_HUB_DEEP_DIVE,
            title: <Trans>Token Deep Dive</Trans>,
            value: ROUTER.AGENT_HUB_DEEP_DIVE,
          },
        ],
      },
      {
        key: ROUTER.MY_AGENT,
        title: <Trans>My Agent</Trans>,
        icon: 'icon-task',
        value: ROUTER.MY_AGENT,
        clickCallback: changeCurrentActiveNavKey(ROUTER.MY_AGENT),
        hasSubList: true,
        subList: [],
      },
    ]
  }, [goOtherPage, changeCurrentActiveNavKey])

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
    setCurrentRouter(ROUTER.TRADE_AI)
    addNewThread()
    setIsShowMobileMenu(false)
  }, [addNewThread, setCurrentRouter, setIsShowMobileMenu])

  const closeMenu = useCallback(() => {
    setIsShowMobileMenu(false)
  }, [setIsShowMobileMenu])

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
          <span>
            <IconBase className='icon-logo-big' />
          </span>
          <span onClick={changeIsShowMobileMenu}>
            <IconBase className='icon-chat-delete' />
          </span>
        </Header>
        <Content>
          <NewChat onClick={newChatClick}>
            <IconBase className='icon-chat-new' />
            <span>
              <Trans>New Chat</Trans>
            </span>
          </NewChat>
          <NavWrapper>
            <Features>
              <Trans>Features</Trans>
            </Features>
            <NavList>
              {navList.map((item) => {
                const { key, title, icon, value, subList, hasSubList, clickCallback } = item
                const isActive = isMatchCurrentRouter(currentRouter, value) || isMatchFatherRouter(currentRouter, value)
                return (
                  <NavItem key={key} onClick={() => clickCallback(value)}>
                    <NavTitle $active={isActive} $keyActive={currentActiveNavKey === key}>
                      <LeftWrapper>
                        <IconBase className={icon} />
                        <span>{title}</span>
                      </LeftWrapper>
                      {hasSubList && <IconBase className='icon-play' />}
                    </NavTitle>
                    {hasSubList && (
                      <SubList $active={currentActiveNavKey === key}>
                        {subList.map((subItem) => {
                          const { key, title, value } = subItem
                          const isActive = isMatchCurrentRouter(currentRouter, value)
                          return (
                            <SubItem key={key} $active={isActive} onClick={() => subItemClick(value)}>
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
          </NavWrapper>
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

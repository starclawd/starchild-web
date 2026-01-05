import styled, { css, keyframes } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useCallback, useMemo, useState, useEffect } from 'react'
import { ANI_DURATION } from 'constants/index'
import { IconBase } from 'components/Icons'
import { useCurrentRouter, useIsMobile } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { goOutPageCommon, STARCHILD_BOT, URL, WAIT_TELEGRAM, X } from 'utils/url'

const Header = styled.div`
  position: absolute;
  left: 0;
  top: 72px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 34px;
  ${({ theme }) =>
    theme.isMobile
      ? css`
          top: 65px;
          height: ${vm(30)};
        `
      : css``}
`

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`

const MenuList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  gap: 32px;
  width: fit-content;
  height: 100%;
`

const MenuItem = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-family: 'PowerGrotesk';
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 22px; /* 137.5% */
  letter-spacing: 3.2px;
  text-transform: uppercase;
  transition: opacity ${ANI_DURATION}s;
  ${({ theme }) =>
    theme.isMobile
      ? css`
          font-size: 0.12rem;
          line-height: 0.3rem;
        `
      : css`
          cursor: pointer;
          &:hover {
            opacity: 0.7;
          }
        `}
`

const MobileMenuIcon = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: ${vm(20)};
  left: ${vm(20)};
  z-index: 100;
  width: ${vm(24)};
  height: ${vm(24)};
  .icon-mobile-menu {
    font-size: 0.24rem;
    color: ${({ theme }) => theme.black100};
  }
`

const MobileMenuList = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${vm(32)};
`

const flipInAnimation = keyframes`
  0% {
    opacity: 0;
    transform: rotateY(-90deg) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: rotateY(0deg) translateY(0);
  }
`

const MobileMenuItem = styled.div<{ $isVisible: boolean; delay: number }>`
  position: relative;
  font-size: 0.16rem;
  font-weight: 300;
  line-height: 0.22rem;
  font-family: 'PowerGrotesk';
  text-transform: uppercase;
  color: ${({ theme }) => theme.black0};
  opacity: 0;
  transform: rotateY(-90deg) translateY(20px);
  animation: ${({ $isVisible }) => ($isVisible ? flipInAnimation : 'none')} 0.3s ease-out forwards;
  animation-delay: ${({ delay }) => delay}s;
  .icon-chat-delete {
    position: absolute;
    bottom: ${vm(-84)};
    left: calc(50% - 0.12rem);
    right: 0;
    font-size: 0.24rem;
    color: ${({ theme }) => theme.black100};
  }
`

interface HomeMenuProps {
  opacity: number
}

export default function HomeMenu({ opacity }: HomeMenuProps) {
  const isMobile = useIsMobile()
  const [, setCurrentRouter] = useCurrentRouter()
  const [isShowMobileMenu, setIsShowMobileMenu] = useState(false)
  const [visibleItems, setVisibleItems] = useState<number[]>([])

  const goInnerPage = useCallback(() => {
    setCurrentRouter(ROUTER.CHAT)
  }, [setCurrentRouter])

  const goUseCasesPage = useCallback(() => {
    setCurrentRouter(ROUTER.USE_CASES)
  }, [setCurrentRouter])

  const goDocPage = useCallback(() => {
    setCurrentRouter(ROUTER.DOCUMENTS)
  }, [setCurrentRouter])

  const menuList = useMemo(() => {
    return [
      {
        text: <Trans>WEB APP &gt;</Trans>,
        value: 'CHAT',
        onClick: goInnerPage,
      },
      {
        text: <Trans>Telegram bot &gt;</Trans>,
        value: 'TELEGRAM_BOT',
        onClick: goOutPageCommon(URL[STARCHILD_BOT]),
      },
      {
        text: <Trans>X &gt;</Trans>,
        value: 'X',
        onClick: goOutPageCommon(URL[X]),
      },
      {
        text: <Trans>Community &gt;</Trans>,
        value: 'COMMUNITY',
        onClick: goOutPageCommon(URL[WAIT_TELEGRAM]),
      },
      // {
      //   text: <Trans>Use cases &gt;</Trans>,
      //   value: 'USE_CASES',
      //   onClick: goUseCasesPage,
      // },
      {
        text: <Trans>Documents &gt;</Trans>,
        value: 'DOCUMENTS',
        onClick: goDocPage,
      },
    ]
  }, [goInnerPage, goDocPage])

  const showMobileMenu = useCallback(() => {
    setIsShowMobileMenu(true)
    setVisibleItems([])
  }, [])

  const closeMobileMemu = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsShowMobileMenu(false)
    setVisibleItems([])
  }, [])

  // 控制菜单项依次显示
  useEffect(() => {
    if (isShowMobileMenu) {
      const timer = setTimeout(() => {
        const showItems = () => {
          setVisibleItems((prev) => {
            if (prev.length < menuList.length) {
              return [...prev, prev.length]
            }
            return prev
          })
        }

        // 每60ms显示一个菜单项
        const interval = setInterval(() => {
          showItems()
        }, 300 / menuList.length)

        return () => clearInterval(interval)
      }, 50)

      return () => clearTimeout(timer)
    }
  }, [isShowMobileMenu, menuList.length])

  if (isMobile) {
    return (
      <MobileMenuIcon onClick={showMobileMenu}>
        <IconBase className='icon-mobile-menu' />
        {isShowMobileMenu && (
          <MobileMenuList>
            {menuList.map((item, index) => {
              const { text, value, onClick } = item
              const isLast = index === menuList.length - 1
              const isVisible = visibleItems.includes(index)
              return (
                <MobileMenuItem
                  onClick={(e) => {
                    onClick(e)
                    closeMobileMemu(e)
                  }}
                  key={value}
                  $isVisible={isVisible}
                  delay={index * 0.06}
                >
                  {text}
                  {isLast && <IconBase onClick={closeMobileMemu} className='icon-chat-delete' />}
                </MobileMenuItem>
              )
            })}
          </MobileMenuList>
        )}
      </MobileMenuIcon>
    )
  }
  return (
    <Header>
      <HeaderContent>
        <MenuList>
          {menuList.map((item) => {
            const { text, value, onClick } = item
            return (
              <MenuItem key={value} onClick={onClick}>
                {text}
              </MenuItem>
            )
          })}
        </MenuList>
      </HeaderContent>
    </Header>
  )
}

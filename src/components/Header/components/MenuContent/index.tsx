import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { useCallback, useMemo } from 'react'
import { IconBase } from 'components/Icons'
import { useIsFixMenu } from 'store/headercache/hooks'
import { ROUTER } from 'pages/router'
import { Trans } from '@lingui/react/macro'
import { msg } from '@lingui/core/macro'
import { isMatchCurrentRouter, isMatchFatherRouter } from 'utils'
import ThreadList from './components/ThreadList'
import MyAgent from './components/MyAgent'
import Insights from './components/Insights'
import { useWindowSize } from 'hooks/useWindowSize'
import { MEDIA_WIDTHS } from 'theme/styled'
import useParsedQueryString from 'hooks/useParsedQueryString'
import MenuList, { MenuItem } from './components/MenuList'

const MenuContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: absolute;
  top: 0;
  left: 80px;
  width: 240px;
  height: 100%;
  padding: 20px 12px;
  background-color: ${({ theme }) => theme.black800};
  transform: translateX(-100%);
  z-index: 1;
  transition: all ${ANI_DURATION}s;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  height: 24px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.textL2};
  text-transform: capitalize;
`

// 配置列表
const INSIGHTS_ITEMS: MenuItem[] = [
  {
    id: 'agents-marketplace',
    titleKey: msg`Agents marketplace`,
    icon: 'icon-discover-agents',
    route: ROUTER.AGENT_HUB,
  },
  {
    id: 'signals',
    titleKey: msg`Signals`,
    icon: 'icon-candlestick',
    route: ROUTER.SIGNALS,
  },
  {
    id: 'live-chat',
    titleKey: msg`Live chat`,
    icon: 'icon-live-chat',
    route: ROUTER.LIVECHAT,
  },
]

const MY_ITEMS: MenuItem[] = [
  {
    id: 'my-agent',
    titleKey: msg`My agents`,
    icon: 'icon-my-agent',
    route: ROUTER.MY_AGENTS,
  },
  {
    id: 'my-strategy',
    titleKey: msg`My strategies`,
    icon: 'icon-my-strategy',
    route: ROUTER.MY_FUND_AGENT,
  },
  {
    id: 'my-vault',
    titleKey: msg`My vault portfolio`,
    icon: 'icon-my-vault',
    route: ROUTER.PORTFOLIO,
  },
]

const IconWrapper = styled.div<{ $isFixMenu: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all ${ANI_DURATION}s;
  cursor: pointer;
  .icon-header-pin {
    font-size: 14px;
    color: ${({ theme }) => theme.textDark54};
    transition: all ${ANI_DURATION}s;
  }
  &:hover {
    background-color: ${({ theme }) => theme.bgT20};
    .icon-header-pin {
      color: ${({ theme }) => theme.textL1};
    }
  }
  ${({ $isFixMenu }) =>
    $isFixMenu &&
    css`
      .icon-header-pin {
        color: ${({ theme }) => theme.textL1};
        transform: rotate(-45deg);
      }
    `}
`

const Line = styled.div`
  flex-shrink: 0;
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.lineDark8};
`

export default function MenuContent({
  onMouseEnter,
  onMouseLeave,
  currentHoverMenuKey,
}: {
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  currentHoverMenuKey: string
}) {
  const { width } = useWindowSize()
  const [isFixMenu, setIsFixMenu] = useIsFixMenu()
  const title = useMemo(() => {
    if (isMatchCurrentRouter(currentHoverMenuKey, ROUTER.CHAT)) {
      return <Trans>Home</Trans>
    } else if (
      INSIGHTS_ITEMS.some(
        (item) =>
          isMatchCurrentRouter(currentHoverMenuKey, item.route) || isMatchFatherRouter(currentHoverMenuKey, item.route),
      )
    ) {
      return <Trans>Insights</Trans>
    } else if (
      MY_ITEMS.some(
        (item) =>
          isMatchCurrentRouter(currentHoverMenuKey, item.route) || isMatchFatherRouter(currentHoverMenuKey, item.route),
      )
    ) {
      return <Trans>My</Trans>
    }
    return ''
  }, [currentHoverMenuKey])
  const changeIsFixMenu = useCallback(() => {
    setIsFixMenu(!isFixMenu)
  }, [isFixMenu, setIsFixMenu])
  return (
    <MenuContentWrapper className='menu-content' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Title>
        <span>{title}</span>
        {width && width > MEDIA_WIDTHS.minWidth1440 && (
          <IconWrapper $isFixMenu={isFixMenu} onClick={changeIsFixMenu}>
            <IconBase className='icon-header-pin' />
          </IconWrapper>
        )}
      </Title>
      <Line />
      {isMatchCurrentRouter(currentHoverMenuKey, ROUTER.CHAT) && <ThreadList />}
      {INSIGHTS_ITEMS.some(
        (item) =>
          isMatchCurrentRouter(currentHoverMenuKey, item.route) || isMatchFatherRouter(currentHoverMenuKey, item.route),
      ) && <MenuList items={INSIGHTS_ITEMS} />}
      {MY_ITEMS.some(
        (item) =>
          isMatchCurrentRouter(currentHoverMenuKey, item.route) || isMatchFatherRouter(currentHoverMenuKey, item.route),
      ) && <MenuList items={MY_ITEMS} />}
    </MenuContentWrapper>
  )
}

import styled, { useTheme } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { useMemo } from 'react'
import { ROUTER } from 'pages/router'
import { Trans } from '@lingui/react/macro'
import { msg } from '@lingui/core/macro'
import { isMatchCurrentRouter, isMatchFatherRouter } from 'utils'
import ThreadList from './components/ThreadList'
import MenuList, { MenuItem } from './components/MenuList'
import Divider from 'components/Divider'

const MenuContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: absolute;
  top: 0;
  left: 60px;
  width: 240px;
  height: 100%;
  padding: 20px 12px;
  transform: translateX(-100%);
  visibility: hidden;
  z-index: 1;
  transition: all ${ANI_DURATION}s;
  border-right: 1px solid ${({ theme }) => theme.black800};
  background-color: ${({ theme }) => theme.black1000};
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
  color: ${({ theme }) => theme.black100};
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
  // {
  //   id: 'My Signals',
  //   titleKey: msg`My signals`,
  //   icon: 'icon-my-agent',
  //   route: ROUTER.MY_SIGNALS,
  // },
  {
    id: 'My Strategies',
    titleKey: msg`My strategies`,
    icon: 'icon-my-strategy',
    route: ROUTER.MY_STRATEGY,
  },
  {
    id: 'My Vault Portfolio',
    titleKey: msg`My vault portfolio`,
    icon: 'icon-my-vault',
    route: ROUTER.MY_VAULT,
  },
]

export default function MenuContent({
  onMouseEnter,
  onMouseLeave,
  currentHoverMenuKey,
}: {
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  currentHoverMenuKey: string
}) {
  const theme = useTheme()
  const title = useMemo(() => {
    if (isMatchCurrentRouter(currentHoverMenuKey, ROUTER.CHAT)) {
      return <Trans>Chat history</Trans>
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
  // const changeIsFixMenu = useCallback(() => {
  //   setIsFixMenu(!isFixMenu)
  // }, [isFixMenu, setIsFixMenu])
  return (
    <MenuContentWrapper className='menu-content' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Title>
        <span>{title}</span>
        {/* {width && width > MEDIA_WIDTHS.minWidth1440 && (
          <IconWrapper $isFixMenu={isFixMenu} onClick={changeIsFixMenu}>
            <IconBase className='icon-header-pin' />
          </IconWrapper>
        )} */}
      </Title>
      <Divider color={theme.black800} height={1} />
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

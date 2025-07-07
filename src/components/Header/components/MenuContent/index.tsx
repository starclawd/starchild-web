import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { ReactNode, useCallback, useMemo } from 'react'
import { IconBase } from 'components/Icons'
import { useIsFixMenu } from 'store/headercache/hooks'
import { ROUTER } from 'pages/router'
import { Trans } from '@lingui/react/macro'
import { isMatchCurrentRouter } from 'utils'
import ThreadList from './components/ThreadList'
import InsightsToken from './components/InsightsToken'
import AgentHub from './components/AgentHub'
import Wallet from './components/Wallet'
import MyAgent from './components/MyAgent'

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
  background-color: #1A1C1E;
  transform: translateX(-100%);
  z-index: 1;
  transition: all ${ANI_DURATION}s;
`

const Title = styled.div<{ $isFixMenu: boolean }>`
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
  .icon-header-pin {
    font-size: 14px;
    color: ${({ theme }) => theme.textDark54};
    cursor: pointer;
    transition: all ${ANI_DURATION}s;
  }
  ${({ $isFixMenu }) => $isFixMenu && css`
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
  const [isFixMenu, setIsFixMenu] = useIsFixMenu()
  const title = useMemo(() => {
    if (isMatchCurrentRouter(currentHoverMenuKey, ROUTER.TRADE_AI)) {
      return <Trans>Home</Trans>
    // } else if (isMatchCurrentRouter(currentHoverMenuKey, ROUTER.INSIGHTS)) {
    //   return <Trans>Insights</Trans>
    } else if (isMatchCurrentRouter(currentHoverMenuKey, ROUTER.AGENT_HUB)) {
      return <Trans>Agent Hub</Trans>
    } else if (isMatchCurrentRouter(currentHoverMenuKey, ROUTER.MY_AGENT)) {
      return <Trans>My Agent</Trans>
    } else if (isMatchCurrentRouter(currentHoverMenuKey, ROUTER.PORTFOLIO)) {
      return <Trans>Wallet</Trans>
    }
    return ''
  }, [currentHoverMenuKey])
  const changeIsFixMenu = useCallback(() => {
    setIsFixMenu(!isFixMenu)
  }, [isFixMenu, setIsFixMenu])
  return <MenuContentWrapper className="menu-content" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    <Title $isFixMenu={isFixMenu}>
      <span>{title}</span>
      <IconBase
        className="icon-header-pin"
        onClick={changeIsFixMenu}
      />
    </Title>
    <Line />
    {isMatchCurrentRouter(currentHoverMenuKey, ROUTER.TRADE_AI) && <ThreadList />}
    {/* {isMatchCurrentRouter(currentHoverMenuKey, ROUTER.INSIGHTS) && <InsightsToken />} */}
    {isMatchCurrentRouter(currentHoverMenuKey, ROUTER.AGENT_HUB) && <AgentHub />}
    {isMatchCurrentRouter(currentHoverMenuKey, ROUTER.MY_AGENT) && <MyAgent />}
    {isMatchCurrentRouter(currentHoverMenuKey, ROUTER.PORTFOLIO) && <Wallet />}
  </MenuContentWrapper>
}

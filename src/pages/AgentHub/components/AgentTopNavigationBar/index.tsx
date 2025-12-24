import { memo, useMemo } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import styled from 'styled-components'
import { IconBase } from 'components/Icons'
import { useCurrentRouter, useIsMobile } from 'store/application/hooks'
import { isMatchCurrentRouter } from 'utils'
import { ROUTER } from 'pages/router'
import {
  DISCOVER_AGENTS,
  INDICATOR_HUB,
  STRATEGY_HUB,
  SIGNAL_SCANNER,
  KOL_RADAR,
  AUTO_BRIEFING,
  MARKET_PULSE,
  TOKEN_DEEP_DIVE,
} from 'constants/agentHub'
import { parsedQueryString } from 'hooks/useParsedQueryString'

const AgentTopNavigationBarWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  height: 64px;
  padding: 0 20px;
`

const NavContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  i {
    font-size: 24px;
    color: ${({ theme }) => theme.textL1};
  }
`

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.textL1};
`

export default memo(function AgentTopNavigationBar() {
  const [currentRouter] = useCurrentRouter()
  const isMobile = useIsMobile()
  const { t } = useLingui()

  const navigationInfo = useMemo(() => {
    const from = parsedQueryString(location.search).from
    if (isMatchCurrentRouter(currentRouter, ROUTER.AGENT_HUB) || from === ROUTER.AGENT_HUB) {
      return {
        icon: DISCOVER_AGENTS.icon,
        title: t(DISCOVER_AGENTS.titleKey),
      }
    } else if (isMatchCurrentRouter(currentRouter, ROUTER.AGENT_HUB_INDICATOR) || from === ROUTER.AGENT_HUB_INDICATOR) {
      return {
        icon: INDICATOR_HUB.icon,
        title: t(INDICATOR_HUB.titleKey),
      }
    } else if (isMatchCurrentRouter(currentRouter, ROUTER.AGENT_HUB_STRATEGY) || from === ROUTER.AGENT_HUB_STRATEGY) {
      return {
        icon: STRATEGY_HUB.icon,
        title: t(STRATEGY_HUB.titleKey),
      }
    } else if (isMatchCurrentRouter(currentRouter, ROUTER.AGENT_HUB_SIGNAL) || from === ROUTER.AGENT_HUB_SIGNAL) {
      return {
        icon: SIGNAL_SCANNER.icon,
        title: t(SIGNAL_SCANNER.titleKey),
      }
    } else if (isMatchCurrentRouter(currentRouter, ROUTER.AGENT_HUB_KOL) || from === ROUTER.AGENT_HUB_KOL) {
      return {
        icon: KOL_RADAR.icon,
        title: t(KOL_RADAR.titleKey),
      }
    } else if (isMatchCurrentRouter(currentRouter, ROUTER.AGENT_HUB_BRIEFING) || from === ROUTER.AGENT_HUB_BRIEFING) {
      return {
        icon: AUTO_BRIEFING.icon,
        title: t(AUTO_BRIEFING.titleKey),
      }
    } else if (isMatchCurrentRouter(currentRouter, ROUTER.AGENT_HUB_PULSE) || from === ROUTER.AGENT_HUB_PULSE) {
      return {
        icon: MARKET_PULSE.icon,
        title: t(MARKET_PULSE.titleKey),
      }
    } else if (isMatchCurrentRouter(currentRouter, ROUTER.AGENT_HUB_DEEP_DIVE) || from === ROUTER.AGENT_HUB_DEEP_DIVE) {
      return {
        icon: TOKEN_DEEP_DIVE.icon,
        title: t(TOKEN_DEEP_DIVE.titleKey),
      }
    }

    // 默认显示 Discover agents
    return {
      icon: DISCOVER_AGENTS.icon,
      title: t(DISCOVER_AGENTS.titleKey),
    }
  }, [currentRouter, t])

  return isMobile ? null : (
    <AgentTopNavigationBarWrapper>
      <NavContent>
        <IconWrapper>
          <IconBase className={navigationInfo.icon} />
        </IconWrapper>
        <Title>{navigationInfo.title}</Title>
      </NavContent>
    </AgentTopNavigationBarWrapper>
  )
})

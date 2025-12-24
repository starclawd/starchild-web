import { Trans, useLingui } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { useMemo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { AGENT_CATEGORIES, DISCOVER_AGENTS, AGENT_HUB_TYPE } from 'constants/agentHub'
import { ROUTER } from 'pages/router'
import { type AgentCategory } from 'store/agenthub/agenthub'
import { useCurrentRouter } from 'store/application/hooks'
import { ANI_DURATION } from 'constants/index'
import { isMatchCurrentRouter } from 'utils'
import useParsedQueryString from 'hooks/useParsedQueryString'

const AgentHubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
  width: 100%;
`

const Item = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  gap: 6px;
  width: 100%;
  height: 36px;
  padding: 0 8px;
  border-radius: 6px;
  transition: background-color ${ANI_DURATION}s;

  &:hover {
    background-color: ${({ theme }) => theme.bgT20};
  }

  i {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  span {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL2};
  }
  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      background-color: ${theme.bgT20};
    `}
`

export default function AgentHub() {
  const [currentRouter, setCurrentRouter] = useCurrentRouter()
  const { from } = useParsedQueryString()
  const { t } = useLingui()

  const getRouteByCategory = useCallback((categoryId: string) => {
    const routeMap: Record<string, string> = {
      [DISCOVER_AGENTS.id]: ROUTER.AGENT_HUB,
      [AGENT_HUB_TYPE.INDICATOR]: ROUTER.AGENT_HUB_INDICATOR,
      [AGENT_HUB_TYPE.STRATEGY]: ROUTER.AGENT_HUB_STRATEGY,
      [AGENT_HUB_TYPE.SIGNAL_SCANNER]: ROUTER.AGENT_HUB_SIGNAL,
      [AGENT_HUB_TYPE.KOL_RADAR]: ROUTER.AGENT_HUB_KOL,
      [AGENT_HUB_TYPE.AUTO_BRIEFING]: ROUTER.AGENT_HUB_BRIEFING,
      [AGENT_HUB_TYPE.MARKET_PULSE]: ROUTER.AGENT_HUB_PULSE,
      [AGENT_HUB_TYPE.TOKEN_DEEP_DIVE]: ROUTER.AGENT_HUB_DEEP_DIVE,
    }
    return routeMap[categoryId] || ROUTER.AGENT_HUB
  }, [])

  const handleItemClick = useCallback(
    (categoryId: string) => {
      const route = getRouteByCategory(categoryId)
      setCurrentRouter(route)
    },
    [setCurrentRouter, getRouteByCategory],
  )

  const list = useMemo(() => {
    return [DISCOVER_AGENTS, ...AGENT_CATEGORIES].map((category: AgentCategory) => ({
      key: category.id,
      title: t(category.titleKey),
      icon: category.icon,
    }))
  }, [t])

  return (
    <AgentHubWrapper>
      {list.map((item) => {
        const { key, title, icon } = item
        const route = getRouteByCategory(key)
        const isActive = isMatchCurrentRouter(currentRouter, route) || from === route
        return (
          <Item key={key} onClick={() => handleItemClick(key)} $isActive={isActive}>
            <IconBase className={icon} />
            <span>{title}</span>
          </Item>
        )
      })}
    </AgentHubWrapper>
  )
}

import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { AGENT_CATEGORIES, DISCOVER_AGENTS, type AgentCategory } from 'constants/agentHub'
import { ROUTER } from 'pages/router'

const AgentHubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
  width: 100%;
`

const Item = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  gap: 6px;
  width: 100%;
  height: 36px;
  padding: 0 8px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.bgL1};
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
`

export default function AgentHub()  {
  const navigate = useNavigate()
  
  const getRouteByCategory = useCallback((categoryId: string) => {
    const routeMap: Record<string, string> = {
      'discover-agents': ROUTER.AGENT_HUB,
      'indicator-hub': ROUTER.AGENT_HUB_INDICATOR,
      'strategy-hub': ROUTER.AGENT_HUB_STRATEGY,
      'signal-scanner': ROUTER.AGENT_HUB_SIGNAL,
      'kol-radar': ROUTER.AGENT_HUB_KOL,
      'auto-briefing': ROUTER.AGENT_HUB_BRIEFING,
      'market-pulse': ROUTER.AGENT_HUB_PULSE,
      'token-deep-dive': ROUTER.AGENT_HUB_DEEP_DIVE,
    }
    return routeMap[categoryId] || ROUTER.AGENT_HUB
  }, [])
  
  const handleItemClick = useCallback((categoryId: string) => {
    const route = getRouteByCategory(categoryId)
    navigate(route)
  }, [navigate, getRouteByCategory])

  const list = useMemo(() => {
    return [DISCOVER_AGENTS, ...AGENT_CATEGORIES].map((category: AgentCategory) => ({
      key: category.id,
      title: <Trans>{category.titleKey}</Trans>,
      icon: category.icon,
    }))
  }, [])
  
  return <AgentHubWrapper>
    {
      list.map((item) => {
        const { key, title, icon } = item
        return <Item key={key} onClick={() => handleItemClick(key)}>
          <IconBase className={icon} />
          <span>{title}</span>
        </Item>
      })
    }
  </AgentHubWrapper>
}

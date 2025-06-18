import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { useMemo } from 'react'
import styled from 'styled-components'

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
  const list = useMemo(() => {
    return [
      {
        key: "discover-agents",
        title: <Trans>Discover Agents</Trans>,
        icon: "icon-agent",
      },
      {
        key: "hot-tasks",
        title: <Trans>Hot Tasks</Trans>,
        icon: "icon-chat-thinking",
      },
      {
        key: "strategy-board",
        title: <Trans>Strategy Board</Trans>,
        icon: "icon-backtest",
      },
      {
        key: "Marketplace",
        title: <Trans>Marketplace</Trans>,
        icon: "icon-marketplace",
      },
      {
        key: "Leaderboard",
        title: <Trans>Leaderboard</Trans>,
        icon: "icon-leaderboard",
      },
    ]
  }, [])
  return <AgentHubWrapper>
    {
      list.map((item) => {
        const { key, title, icon } = item
        return <Item key={key}>
          <IconBase className={icon} />
          <span>{title}</span>
        </Item>
      })
    }
  </AgentHubWrapper>
}

import { Trans, useLingui } from '@lingui/react/macro'
import { msg } from '@lingui/core/macro'
import { IconBase } from 'components/Icons'
import { useMemo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { ROUTER } from 'pages/router'
import { useCurrentRouter } from 'store/application/hooks'
import { ANI_DURATION } from 'constants/index'
import { isMatchCurrentRouter } from 'utils'
import useParsedQueryString from 'hooks/useParsedQueryString'

const InsightsMenuWrapper = styled.div`
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

interface InsightItem {
  id: string
  titleKey: any
  icon: string
  route: string
}

const INSIGHT_ITEMS: InsightItem[] = [
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

export default function InsightsMenu() {
  const [currentRouter, setCurrentRouter] = useCurrentRouter()
  const { from } = useParsedQueryString()
  const { t } = useLingui()

  const handleItemClick = useCallback(
    (route: string) => {
      setCurrentRouter(route)
    },
    [setCurrentRouter],
  )

  const list = useMemo(() => {
    return INSIGHT_ITEMS.map((item) => ({
      key: item.id,
      title: t(item.titleKey),
      icon: item.icon,
      route: item.route,
    }))
  }, [t])

  return (
    <InsightsMenuWrapper>
      {list.map((item) => {
        const { key, title, icon, route } = item
        const isActive = isMatchCurrentRouter(currentRouter, route) || from === route
        return (
          <Item key={key} onClick={() => handleItemClick(route)} $isActive={isActive}>
            <IconBase className={icon} />
            <span>{title}</span>
          </Item>
        )
      })}
    </InsightsMenuWrapper>
  )
}

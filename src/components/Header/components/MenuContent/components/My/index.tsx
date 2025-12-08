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

const MyWrapper = styled.div`
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
    text-transform: capitalize;
  }
  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      background-color: ${theme.bgT20};
    `}
`

interface MyItem {
  id: string
  titleKey: any
  icon: string
  route: string
}

const MY_ITEMS: MyItem[] = [
  {
    id: 'my-agent',
    titleKey: msg`My agent`,
    icon: 'icon-my-agent',
    route: ROUTER.MY_AGENTS,
  },
  {
    id: 'my-strategy',
    titleKey: msg`My strategy`,
    icon: 'icon-my-strategy',
    route: ROUTER.MY_FUND_AGENT,
  },
  {
    id: 'my-vault',
    titleKey: msg`My vault`,
    icon: 'icon-my-vault',
    route: ROUTER.PORTFOLIO,
  },
]

export default function My() {
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
    return MY_ITEMS.map((item) => ({
      key: item.id,
      title: t(item.titleKey),
      icon: item.icon,
      route: item.route,
    }))
  }, [t])

  return (
    <MyWrapper>
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
    </MyWrapper>
  )
}

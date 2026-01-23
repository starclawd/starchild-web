import { useLingui } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { useMemo, useCallback, memo } from 'react'
import styled, { css } from 'styled-components'
import { useCurrentRouter, useSetCurrentRouter } from 'store/application/hooks'
import { ANI_DURATION } from 'constants/index'
import { isMatchCurrentRouter } from 'utils'
import useParsedQueryString from 'hooks/useParsedQueryString'

const MenuListWrapper = styled.div`
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
    background-color: ${({ theme }) => theme.black800};
  }

  i {
    font-size: 18px;
    color: ${({ theme }) => theme.black100};
  }
  span {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.black100};
  }
  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      background-color: ${theme.black800};
    `}
`

export interface MenuItem {
  id: string
  titleKey: any
  icon: string
  route: string
}

interface MenuListProps {
  items: MenuItem[]
}

export default memo(function MenuList({ items }: MenuListProps) {
  const currentRouter = useCurrentRouter()
  const setCurrentRouter = useSetCurrentRouter()
  const { from } = useParsedQueryString()
  const { t } = useLingui()

  const handleItemClick = useCallback(
    (route: string) => {
      setCurrentRouter(route)
    },
    [setCurrentRouter],
  )

  const list = useMemo(() => {
    return items.map((item) => ({
      key: item.id,
      title: t(item.titleKey),
      icon: item.icon,
      route: item.route,
    }))
  }, [items, t])

  return (
    <MenuListWrapper>
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
    </MenuListWrapper>
  )
})

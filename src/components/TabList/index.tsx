import { ANI_DURATION } from 'constants/index'
import styled, { css } from 'styled-components'

const TabListWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`

const TabItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  gap: 4px;
  height: 100%;
  padding: 0 12px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme, $active }) => ($active ? theme.textL1 : theme.textL3)};
  background-color: ${({ $active, theme }) => ($active ? theme.black600 : 'transparent')};
  cursor: pointer;
  i {
    transition: all ${ANI_DURATION}s;
    font-size: 18px;
    color: ${({ theme, $active }) => ($active ? theme.textL1 : theme.textL3)};
  }
  ${({ $active, theme }) =>
    !$active &&
    css`
      &:hover {
        opacity: 0.7;
      }
    `}
`

export default function TabList({
  tabKey,
  tabList,
  className,
}: {
  className?: string
  tabKey: string | number
  tabList: {
    key: string | number
    text: React.ReactNode
    icon?: React.ReactNode
    clickCallback: (tabKey: string | number) => void
  }[]
}) {
  return (
    <TabListWrapper className={`tab-list-wrapper ${className}`}>
      {tabList.map((item) => {
        const { key, text, icon, clickCallback } = item
        const isActive = tabKey === key
        return (
          <TabItem
            key={key}
            $active={isActive}
            className={`tab-item ${isActive ? 'active' : ''}`}
            onClick={() => clickCallback(key)}
          >
            {icon}
            <span>{text}</span>
          </TabItem>
        )
      })}
    </TabListWrapper>
  )
}

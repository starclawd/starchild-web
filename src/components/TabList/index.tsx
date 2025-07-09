import { ANI_DURATION } from 'constants/index'
import styled from 'styled-components'

const TabListWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 20px 8px;
  gap: 8px;
`

const TabItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  height: 44px;
  padding: 0 16px;
  border-radius: 22px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.textL2};
  background-color: ${({ $active, theme }) => ($active ? '#335FFC' : 'transparent')};
  cursor: pointer;
  transition: background-color ${ANI_DURATION}s;
`

export default function TabList({
  tabList,
}: {
  tabList: {
    key: string
    text: string
    value: string
    isActive: boolean
    clickCallback: (value: string) => void
  }[]
}) {
  return (
    <TabListWrapper className='tab-list-wrapper'>
      {tabList.map((item) => {
        const { key, text, value, isActive, clickCallback } = item
        return (
          <TabItem
            key={key}
            $active={isActive}
            className={`tab-item ${isActive ? 'active' : ''}`}
            onClick={() => clickCallback(value)}
          >
            <span>{text}</span>
          </TabItem>
        )
      })}
    </TabListWrapper>
  )
}

import { memo } from 'react'
import styled from 'styled-components'
import { TAB_CONFIG, TAB_CONTENT_CONFIG, TabKey } from 'constants/useCases'
import { useActiveTab } from 'store/usecases/hooks'
import { ANI_DURATION } from 'constants/index'

const TabContainer = styled.div`
  margin-bottom: 40px;
  overflow-x: auto;
  min-height: 48px;

  /* 隐藏滚动条但保持可滚动 */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const TabListWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
  min-width: fit-content;
  height: 48px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  border-radius: 12px;
`

const TabItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  height: 40px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  cursor: pointer;
  transition: all ${ANI_DURATION}s ease;
  gap: 4px;
  flex-shrink: 0;

  background-color: ${({ $active, theme }) => ($active ? theme.bgT30 : 'transparent')};
  color: ${({ theme }) => theme.textL1};

  &:hover {
    background-color: ${({ $active, theme }) => ($active ? theme.bgT30 : theme.bgT20)};
  }

  i {
    font-size: 18px;
    flex-shrink: 0;
    line-height: 1;
  }

  span {
    flex-shrink: 0;
  }
`

function UseCasesTabBar() {
  const [activeTab, setActiveTab] = useActiveTab()

  const handleTabClick = (value: TabKey) => {
    setActiveTab(value)
  }

  return (
    <TabContainer>
      <TabListWrapper>
        {TAB_CONFIG.map((tab) => {
          const tabConfig = TAB_CONTENT_CONFIG[tab.value as TabKey]
          const iconClassName = tabConfig?.icon
          const isActive = activeTab === tab.value

          console.log('iconClassName', iconClassName)
          return (
            <TabItem key={tab.key} $active={isActive} onClick={() => handleTabClick(tab.value as TabKey)}>
              {iconClassName && <i className={iconClassName} />}
              <span>{tab.text}</span>
            </TabItem>
          )
        })}
      </TabListWrapper>
    </TabContainer>
  )
}

UseCasesTabBar.displayName = 'UseCasesTabBar'

export default memo(UseCasesTabBar)

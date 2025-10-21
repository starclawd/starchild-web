import { memo } from 'react'
import styled from 'styled-components'
import TabList from 'components/TabList'
import { TAB_CONFIG, TabKey } from 'constants/useCases'
import { useActiveTab } from 'store/usecases/hooks'

const TabContainer = styled.div`
  margin-bottom: 40px;

  .tab-list-wrapper {
    padding: 0;
    gap: 12px;
  }

  .tab-item {
    background-color: ${({ theme }) => theme.bgT10};
    border: 1px solid ${({ theme }) => theme.lineDark8};
    color: ${({ theme }) => theme.textL2};

    &.active {
      background-color: ${({ theme }) => theme.brand100};
      color: ${({ theme }) => theme.white};
      border-color: ${({ theme }) => theme.brand100};
    }

    &:hover:not(.active) {
      background-color: ${({ theme }) => theme.bgT20};
    }
  }
`

function UseCasesTabBar() {
  const [activeTab, setActiveTab] = useActiveTab()

  const tabList = TAB_CONFIG.map((tab) => ({
    ...tab,
    isActive: activeTab === tab.value,
    clickCallback: (value: string) => setActiveTab(value as TabKey),
  }))

  return (
    <TabContainer>
      <TabList tabList={tabList} />
    </TabContainer>
  )
}

UseCasesTabBar.displayName = 'UseCasesTabBar'

export default memo(UseCasesTabBar)

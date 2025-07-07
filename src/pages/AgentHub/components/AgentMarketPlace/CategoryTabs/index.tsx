import { memo, useCallback, useState, useMemo } from 'react'
import TabList from 'components/TabList'

interface CategoryTabsProps {
  onTabClick: (sectionId: string) => void
}

const categories = [
  { id: 'agent-creator', label: 'Agent creator' },
  { id: 'backtester', label: 'Backtester' },
  { id: 'indicator-tools', label: 'Indicator tools' },
  { id: 'figure-tracker', label: 'Figure tracker' },
  { id: 'crypto-market-analysis', label: 'Crypto market analysis' },
  { id: 'push-monitor', label: 'Push monitor' },
  { id: 'token-info', label: 'Token info' },
]

export default memo(function CategoryTabs({ onTabClick }: CategoryTabsProps) {
  const [activeTab, setActiveTab] = useState('agent-creator')
  
  const handleTabClick = useCallback((categoryId: string) => {
    setActiveTab(categoryId)
    onTabClick(categoryId)
  }, [onTabClick])
  
  const tabList = useMemo(() => {
    return categories.map((category) => ({
      key: category.id,
      text: category.label,
      value: category.id,
      isActive: activeTab === category.id,
      clickCallback: handleTabClick
    }))
  }, [activeTab, handleTabClick])
  
  return <TabList tabList={tabList} />
}) 
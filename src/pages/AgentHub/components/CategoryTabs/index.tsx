import { memo, useCallback, useState, useMemo } from 'react'
import TabList from 'components/TabList'

interface Category {
  id: string
  title: string
  hasCustomComponent: boolean
}

interface CategoryTabsProps {
  categories: Category[]
  onTabClick: (sectionId: string) => void
}

export default memo(function CategoryTabs({ categories, onTabClick }: CategoryTabsProps) {
  const [activeTab, setActiveTab] = useState(categories[0]?.id || '')
  
  const handleTabClick = useCallback((categoryId: string) => {
    setActiveTab(categoryId)
    onTabClick(categoryId)
  }, [onTabClick])
  
  const tabList = useMemo(() => {
    return categories.map((category) => ({
      key: category.id,
      text: category.title,
      value: category.id,
      isActive: activeTab === category.id,
      clickCallback: handleTabClick
    }))
  }, [categories, activeTab, handleTabClick])
  
  return <TabList tabList={tabList} />
}) 
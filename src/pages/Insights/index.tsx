import { memo, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import TabList from 'components/TabList'
import SystemSignalOverview from './components/Signals'
import LiveChat from './components/LiveChat'
import { useUserInfo } from 'store/login/hooks'
import Pending from 'components/Pending'

const InsightsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.bgL0};
`

const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`

const Insights = memo(() => {
  const [activeTab, setActiveTab] = useState<'signals' | 'livechat'>('signals')
  const [{ userInfoId }] = useUserInfo()

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as 'signals' | 'livechat')
  }, [])

  const tabList = [
    {
      key: 'signals',
      text: 'Signals',
      value: 'signals',
      isActive: activeTab === 'signals',
      clickCallback: handleTabChange,
    },
    {
      key: 'livechat',
      text: 'Live Chat',
      value: 'livechat',
      isActive: activeTab === 'livechat',
      clickCallback: handleTabChange,
    },
  ]

  // 如果没有登录，显示加载状态
  if (!userInfoId) {
    return <Pending isFetching />
  }

  return (
    <InsightsWrapper>
      <TabList tabList={tabList} />
      <ContentWrapper>
        {activeTab === 'signals' && <SystemSignalOverview />}
        {activeTab === 'livechat' && <LiveChat />}
      </ContentWrapper>
    </InsightsWrapper>
  )
})

Insights.displayName = 'Insights'

export default Insights

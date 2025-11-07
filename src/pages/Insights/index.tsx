import { memo, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import TabList from 'components/TabList'
import Signals from './components/Signals'
import LiveChat from './components/LiveChat'

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

  return (
    <InsightsWrapper>
      <TabList tabList={tabList} />
      <ContentWrapper>
        {activeTab === 'signals' && <Signals />}
        {activeTab === 'livechat' && <LiveChat />}
      </ContentWrapper>
    </InsightsWrapper>
  )
})

Insights.displayName = 'Insights'

export default Insights

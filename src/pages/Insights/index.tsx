import { memo, useState, useCallback } from 'react'
import styled, { css } from 'styled-components'
import SystemSignalOverview from './components/Signals'
import LiveChat from './components/LiveChat'
import { useUserInfo } from 'store/login/hooks'
import Pending from 'components/Pending'
import MoveTabList from 'components/MoveTabList'
import { vm } from 'pages/helper'

const InsightsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.bgL0};
`

const TabWrapper = styled.div`
  margin: 0 auto;
  padding-top: 20px;
  width: 800px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)} ${vm(8)} 0 ${vm(8)};
      width: 100%;
    `}
`

const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`

const Insights = memo(() => {
  const [activeTab, setActiveTab] = useState<'signals' | 'livechat'>('signals')
  const [{ userInfoId }] = useUserInfo()

  const tabList = [
    {
      key: 0,
      text: 'Signals',
      clickCallback: () => setActiveTab('signals'),
    },
    {
      key: 1,
      text: 'Live Chat',
      clickCallback: () => setActiveTab('livechat'),
    },
  ]

  // 如果没有登录，显示加载状态
  if (!userInfoId) {
    return <Pending isFetching />
  }

  return (
    <InsightsWrapper>
      <TabWrapper>
        <MoveTabList tabIndex={activeTab === 'signals' ? 0 : 1} tabList={tabList} />
      </TabWrapper>
      <ContentWrapper>
        {activeTab === 'signals' && <SystemSignalOverview />}
        {activeTab === 'livechat' && <LiveChat />}
      </ContentWrapper>
    </InsightsWrapper>
  )
})

Insights.displayName = 'Insights'

export default Insights

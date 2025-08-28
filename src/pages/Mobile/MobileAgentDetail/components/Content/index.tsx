import { useScrollbarClass } from 'hooks/useScrollbarClass'
import styled, { css } from 'styled-components'
import { useCallback, useState, useRef, useMemo, useEffect } from 'react'
import Pending from 'components/Pending'
import { vm } from 'pages/helper'
import ChatHistory from 'pages/AgentDetail/components/ChatHistory'
import AgentDescription from 'pages/AgentDetail/components/AgentDescription'
import Code from 'pages/AgentDetail/components/Code'
import {
  useAgentDetailData,
  useBacktestData,
  useIsGeneratingCode,
  useIsRunningBacktestAgent,
} from 'store/agentdetail/hooks'
import Thinking from 'pages/AgentDetail/components/Thinking'
import MobileHeader from '../../../components/MobileHeader'
import { useAgentDetailPolling } from 'pages/AgentDetail/components/hooks'
import BottomSheet from 'components/BottomSheet'
import { Trans } from '@lingui/react/macro'
import { useCurrentAgentDetailData } from 'store/myagent/hooks'
import RightSection from '../RightSection'
import AiInput from 'pages/Chat/components/AiInput'

const MobileAgentDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .icon-loading {
    font-size: 36px !important;
  }
`

const ContentWrapper = styled.div<{ $isFromMyAgent: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - ${vm(44)});
  padding-bottom: ${({ $isFromMyAgent }) => ($isFromMyAgent ? vm(120) : '0')};
`

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${vm(20)};
  width: 100%;
  height: 100%;
  padding: 0 ${vm(12)};
`

const ThinkingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 ${vm(12)} ${vm(12)};
  background-color: ${({ theme }) => theme.black700};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
  height: ${vm(56)};
  padding: ${vm(20)} ${vm(8)} ${vm(8)};
  font-size: 0.2rem;
  font-weight: 500;
  line-height: 0.28rem;
  color: ${({ theme }) => theme.textL1};
`

export default function MobileAgentDetailContent({
  agentId,
  hideMenu = false,
  showBackIcon = true,
  isFromMyAgent = false,
  callback,
}: {
  agentId: string
  hideMenu: boolean
  showBackIcon?: boolean
  isFromMyAgent?: boolean
  callback?: () => void
}) {
  const contentRef = useScrollbarClass<HTMLDivElement>()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false)
  const [agentDetailData] = useAgentDetailData()
  const [backtestData] = useBacktestData()
  const isRunningBacktestAgent = useIsRunningBacktestAgent(agentDetailData, backtestData)
  const { isLoading } = useAgentDetailPolling({
    agentId,
    agentDetailData,
    backtestData,
  })
  const isGeneratingCode = useIsGeneratingCode(agentDetailData)
  const showThinking = useMemo(() => {
    // return true
    return isGeneratingCode || isRunningBacktestAgent
  }, [isGeneratingCode, isRunningBacktestAgent])

  const closeBottomSheet = useCallback(() => {
    setIsOpenBottomSheet(false)
  }, [])

  useEffect(() => {
    if (showThinking) {
      setIsOpenBottomSheet(true)
    }
  }, [showThinking])

  return (
    <MobileAgentDetailWrapper>
      <MobileHeader
        hideMenu={hideMenu}
        showBackIcon={showBackIcon}
        backIconCallback={callback}
        title={<Trans>Agent description</Trans>}
        rightSection={
          <RightSection
            data={agentDetailData}
            isOpenBottomSheet={isOpenBottomSheet}
            setIsOpenBottomSheet={setIsOpenBottomSheet}
          />
        }
      />
      <ContentWrapper $isFromMyAgent={isFromMyAgent}>
        {isLoading ? (
          <Pending isFetching />
        ) : (
          <Content ref={contentRef} className='scroll-style'>
            <AgentDescription
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              agentDetailData={agentDetailData}
              showBackButton={false}
            />
            <ChatHistory agentDetailData={agentDetailData} backtestData={backtestData} />
          </Content>
        )}
        {isFromMyAgent && <AiInput isFromMyAgent />}
      </ContentWrapper>
      <BottomSheet
        hideDragHandle
        hideClose={false}
        isOpen={isOpenBottomSheet}
        onClose={closeBottomSheet}
        rootStyle={{ overflowY: 'hidden', height: `calc(100vh - ${vm(44)})` }}
      >
        <ThinkingWrapper>
          <Header>
            <Trans>Thinking</Trans>
          </Header>
          {showThinking && <Thinking agentDetailData={agentDetailData} backtestData={backtestData} />}
          {!showThinking && <Code agentDetailData={agentDetailData} backtestData={backtestData} />}
        </ThinkingWrapper>
      </BottomSheet>
    </MobileAgentDetailWrapper>
  )
}

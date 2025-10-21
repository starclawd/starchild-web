import styled, { css } from 'styled-components'
import AiContent from './AiContent'
import AgentDetail from 'pages/Chat/components/AgentDetail'
import DeepThinkDetail from './DeepThinkDetail'
import { ANI_DURATION } from 'constants/index'
import { useMemo } from 'react'
import { AGENT_TYPE } from 'store/agentdetail/agentdetail'
import { useAgentDetailData } from 'store/agentdetail/hooks'
import { useIsShowAgentDetail, useIsShowDeepThink, useIsShowDeepThinkSources } from 'store/chat/hooks'

const ChatContentWrapper = styled.div`
  display: flex;
  width: 1080px;
  height: 640px;
  background-color: ${({ theme }) => theme.black800};
`

const DeepThinkContent = styled.div<{ $isShowRightContent: boolean; $shouldExpandRightSection: boolean }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  gap: 20px;
  flex-shrink: 0;
  height: 100%;
  background-color: ${({ theme }) => theme.black1000};
  z-index: 2;
  ${({ $isShowRightContent, $shouldExpandRightSection }) => css`
    width: ${$shouldExpandRightSection ? '640px' : '500px'};
    right: ${$shouldExpandRightSection ? '-640px' : '-500px'};
    transition: transform ${ANI_DURATION}s;
    ${$isShowRightContent &&
    css`
      transform: translateX(-100%);
    `}
  `}
  ${({ theme, $isShowRightContent, $shouldExpandRightSection }) => theme.mediaMinWidth.minWidth1280`
    position: unset;
    transform: unset;
    transition: width ${ANI_DURATION}s;
    overflow: hidden;
    width: 0;
    ${
      $isShowRightContent &&
      css`
        width: ${!$shouldExpandRightSection ? '35%' : '65%'};
      `
    }
  `}
`

export default function ChatContent() {
  const agentId = ''
  const [isShowDeepThink] = useIsShowDeepThink()
  const [agentDetailData] = useAgentDetailData()
  const [isShowAgentDetail] = useIsShowAgentDetail()
  const [isShowDeepThinkSources] = useIsShowDeepThinkSources()

  const isShowRightContent = useMemo(() => {
    return isShowDeepThink || isShowAgentDetail
  }, [isShowDeepThink, isShowAgentDetail])

  const shouldExpandRightSection = useMemo(() => {
    return !!(agentDetailData.task_type === AGENT_TYPE.BACKTEST_TASK && agentId)
  }, [agentId, agentDetailData.task_type])

  return (
    <ChatContentWrapper>
      <AiContent />
      <DeepThinkContent $shouldExpandRightSection={shouldExpandRightSection} $isShowRightContent={isShowRightContent}>
        {isShowDeepThink &&
          (agentId && !isShowDeepThinkSources ? <AgentDetail agentId={agentId} /> : <DeepThinkDetail />)}
      </DeepThinkContent>
    </ChatContentWrapper>
  )
}

import styled, { css } from 'styled-components'
import AiContent from './AiContent'
import AgentDetail from 'pages/Chat/components/AgentDetail'
import DeepThinkDetail from './DeepThinkDetail'
import { ANI_DURATION } from 'constants/index'
import { useCallback, useMemo } from 'react'
import { AGENT_TYPE } from 'store/agentdetail/agentdetail'
import { useAgentDetailData } from 'store/agentdetail/hooks'
import {
  useCurrentAiContentDeepThinkData,
  useIsShowAgentDetail,
  useIsShowDeepThink,
  useIsShowDeepThinkSources,
} from 'store/usecases/hooks/useChatContentHooks'
import BottomSheet from 'components/BottomSheet'
import { useIsMobile } from 'store/application/hooks'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'

const ChatContentWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: ${({ theme }) => theme.black800};
`

const DeepThinkContent = styled.div<{ $isShowRightContent: boolean; $shouldExpandRightSection: boolean }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  gap: 20px;
  flex-shrink: 0;
  height: 100%;
  background-color: ${({ theme }) => theme.black700};
  z-index: 2;
  ${({ $isShowRightContent, $shouldExpandRightSection }) => css`
    width: ${$shouldExpandRightSection ? '65%' : '35%'};
    right: ${$shouldExpandRightSection ? '-65%' : '-35%'};
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

const MobileDeepThinkContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 ${vm(12)} ${vm(12)};
  background-color: ${({ theme }) => theme.black700};
  .deep-think-inner-content {
    height: calc(100% - ${vm(56)});
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
  height: ${vm(56)};
  margin-bottom: ${vm(12)};
  padding: ${vm(20)} ${vm(8)} ${vm(8)};
  font-size: 0.2rem;
  font-weight: 500;
  line-height: 0.28rem;
  color: ${({ theme }) => theme.textL1};
`

export default function ChatContent() {
  const isMobile = useIsMobile()
  const [agentDetailData] = useAgentDetailData()
  const [isShowDeepThink, setIsShowDeepThink] = useIsShowDeepThink()
  const [isShowAgentDetail, setIsShowAgentDetail] = useIsShowAgentDetail()
  const [isShowDeepThinkSources] = useIsShowDeepThinkSources()
  const [{ agentId }] = useCurrentAiContentDeepThinkData()

  const isShowRightContent = useMemo(() => {
    return isShowDeepThink || isShowAgentDetail
  }, [isShowDeepThink, isShowAgentDetail])

  const shouldExpandRightSection = useMemo(() => {
    return !!(agentDetailData.task_type === AGENT_TYPE.BACKTEST_TASK && agentId)
  }, [agentId, agentDetailData.task_type])

  const closeDeepThink = useCallback(() => {
    setIsShowDeepThink(false)
    setIsShowAgentDetail(false)
  }, [setIsShowDeepThink, setIsShowAgentDetail])

  return (
    <ChatContentWrapper>
      <AiContent />
      {!isMobile && (
        <DeepThinkContent $shouldExpandRightSection={shouldExpandRightSection} $isShowRightContent={isShowRightContent}>
          {isShowDeepThink &&
            (agentId && !isShowDeepThinkSources ? (
              <AgentDetail isFromUseCases agentId={agentId} />
            ) : (
              <DeepThinkDetail />
            ))}
        </DeepThinkContent>
      )}
      {isMobile && (
        <BottomSheet
          hideDragHandle
          hideClose={false}
          isOpen={isShowDeepThink}
          rootStyle={{ overflowY: 'hidden', height: `calc(100vh - ${vm(44)})` }}
          onClose={closeDeepThink}
        >
          {isShowDeepThink && (
            <MobileDeepThinkContent>
              <Header>
                <Trans>Thinking</Trans>
              </Header>
              {agentId && !isShowDeepThinkSources ? <AgentDetail agentId={agentId} /> : <DeepThinkDetail />}
            </MobileDeepThinkContent>
          )}
        </BottomSheet>
      )}
    </ChatContentWrapper>
  )
}

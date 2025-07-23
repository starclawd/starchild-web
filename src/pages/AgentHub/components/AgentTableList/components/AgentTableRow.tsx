import styled, { css, useTheme } from 'styled-components'
import { memo, useState } from 'react'
import { vm } from 'pages/helper'
import CreatorInfo from 'pages/AgentHub/components/AgentCardList/components/CreatorInfo'
import SubscriberCount from 'pages/AgentHub/components/AgentCardList/components/SubscriberCount'
import { AgentInfo } from 'store/agenthub/agenthub'
import { useIsAgentSubscribed, useSubscribeAgent, useUnsubscribeAgent } from 'store/agenthub/hooks'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useIsMobile } from 'store/application/hooks'
import { Trans } from '@lingui/react/macro'
import AgentCardDetailModal from 'pages/AgentHub/components/AgentCardList/components/AgentCardDetailModal'
import { ANI_DURATION } from 'constants/index'

const RowContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.bgL2};
  cursor: pointer;
  transition: background-color ${ANI_DURATION}s ease;

  &:hover {
    background-color: ${({ theme }) => theme.bgL1};
  }

  &:last-child {
    border-bottom: none;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      align-items: flex-start;
      padding: ${vm(16)} ${vm(8)};
      gap: ${vm(8)};

      &:first-child {
        padding-top: ${vm(28)};
      }
    `}
`

const AgentTitle = styled.div`
  flex: 1;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.textL1};
  padding-right: 16px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      font-size: 0.16rem;
      line-height: 0.24rem;
      padding-right: 0;
    `}
`

const BottomRow = styled.div`
  display: contents;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    `}
`

const CreatorColumn = styled.div`
  width: 200px;
  display: flex;
  align-items: center;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: auto;
    `}
`

const SubscriberColumn = styled.div`
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: auto;
      justify-content: flex-start;
    `}
`

interface AgentTableRowProps {
  agent: AgentInfo
}

export default memo(function AgentTableRow({ agent }: AgentTableRowProps) {
  console.log('agent', agent)
  const subscribeAgent = useSubscribeAgent()
  const unsubscribeAgent = useUnsubscribeAgent()
  const isSubscribed = useIsAgentSubscribed(agent.agentId)
  const theme = useTheme()
  const toast = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isMobile = useIsMobile()

  const handleRowClick = () => {
    setIsModalOpen(true)
  }

  const handleCreatorClick = () => {
    // 处理创建者点击事件，可以在这里添加具体的逻辑
    console.log('Creator clicked:', agent.creator)
  }

  const onSubscription = async () => {
    const result = isSubscribed ? await unsubscribeAgent(agent.agentId) : await subscribeAgent(agent.agentId)

    if (result?.status === 'success') {
      toast({
        title: <Trans>{!isSubscribed ? 'Subscribed' : 'Unsubscribed'} Successfully</Trans>,
        description: (
          <Trans>
            Agent {agent.title} was successfully {!isSubscribed ? 'subscribed' : 'unsubscribed'}
          </Trans>
        ),
        status: TOAST_STATUS.SUCCESS,
        typeIcon: 'icon-chat-rubbish',
        iconTheme: theme.jade10,
      })
    } else {
      toast({
        title: <Trans>Failed to toggle subscription</Trans>,
        description: '',
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-chat-rubbish',
        iconTheme: theme.ruby50,
      })
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <RowContainer onClick={handleRowClick}>
        <AgentTitle>{agent.title}</AgentTitle>

        <BottomRow>
          <CreatorColumn>
            <CreatorInfo
              creator={agent.creator}
              avatar={agent.avatar}
              onClick={handleCreatorClick}
              showLabel={isMobile}
            />
          </CreatorColumn>
          <SubscriberColumn>
            <SubscriberCount
              subscriberCount={agent.subscriberCount}
              subscribed={isSubscribed}
              onClick={onSubscription}
            />
          </SubscriberColumn>
        </BottomRow>
      </RowContainer>

      <AgentCardDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        agentId={agent.agentId}
        title={agent.title}
        description={agent.description}
        creator={agent.creator}
        subscriberCount={agent.subscriberCount}
        avatar={agent.avatar}
        agentImageUrl={agent.agentImageUrl}
        stats={agent.stats}
        tags={agent.tags}
        type={agent.type}
        recentChats={agent.recentChats}
        onSubscription={onSubscription}
        tokenInfo={agent.tokenInfo}
      />
    </>
  )
})

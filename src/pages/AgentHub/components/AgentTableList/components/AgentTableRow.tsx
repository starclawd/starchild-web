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

const RowContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.bgL2};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.bgL1};
  }

  &:last-child {
    border-bottom: none;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)} 0;
    `}
`

const AgentDescription = styled.div`
  flex: 1;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
  padding-right: 16px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(13)};
      line-height: ${vm(18)};
      padding-right: ${vm(12)};
    `}
`

const CreatorColumn = styled.div`
  width: 200px;
  display: flex;
  align-items: center;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 120px;
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
      width: 80px;
    `}
`

interface AgentTableRowProps {
  agent: AgentInfo
}

export default memo(function AgentTableRow({ agent }: AgentTableRowProps) {
  const subscribeAgent = useSubscribeAgent()
  const unsubscribeAgent = useUnsubscribeAgent()
  const isSubscribed = useIsAgentSubscribed(agent.agentId)
  const theme = useTheme()
  const toast = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)

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
        <AgentDescription>{agent.description || agent.title}</AgentDescription>
        <CreatorColumn>
          <CreatorInfo creator={agent.creator} avatar={agent.avatar} onClick={handleCreatorClick} showLabel={false} />
        </CreatorColumn>
        <SubscriberColumn>
          <SubscriberCount subscriberCount={agent.subscriberCount} subscribed={false} onClick={onSubscription} />
        </SubscriberColumn>
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
      />
    </>
  )
})

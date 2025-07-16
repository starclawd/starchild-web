import styled, { css, useTheme } from 'styled-components'
import { memo, useState } from 'react'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { vm } from 'pages/helper'
import CreatorInfo from 'pages/AgentHub/components/AgentCardList/components/CreatorInfo'
import SubscriberCount from 'pages/AgentHub/components/AgentCardList/components/SubscriberCount'
import { AgentCardProps } from 'store/agenthub/agenthub'
import AdaptiveTextContent from 'pages/AgentHub/components/AdaptiveTextContent'
import { Trans } from '@lingui/react/macro'
import { useToggleAgentSubscribe, useIsAgentSubscribed } from 'store/agenthub/hooks'
import useToast, { TOAST_STATUS } from 'components/Toast'
import AgentCardDetailModal from 'pages/AgentHub/components/AgentCardList/components/AgentCardDetailModal'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import Avatar from 'components/Avatar'

const CardWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  gap: 16px;
  padding: 8px;
  background: ${({ theme }) => theme.bgL1};
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)};
      gap: ${vm(12)};
    `}
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(6)};
    `}
`

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(14)};
    `}
`

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.textL2};
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(12)};
    `}
`

const BottomContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
`

const ImageContainer = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
  background-color: ${({ theme }) => theme.bgL2};
  flex-shrink: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(100)};
      height: ${vm(100)};
      border-radius: ${vm(12)};
    `}
`

export default memo(function AgentCard({
  agentId: threadId,
  title,
  description,
  creator,
  subscriberCount,
  avatar,
  type,
  agentImageUrl: threadImageUrl,
  stats,
  tags,
  recentChats,
  tokenInfo,
  kolInfo,
}: AgentCardProps) {
  const toggleSubscribe = useToggleAgentSubscribe()
  const isSubscribed = useIsAgentSubscribed(threadId)
  const theme = useTheme()
  const toast = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const onClick = () => {
    setIsModalOpen(true)
  }

  const onClickCreator = () => {
    // TODO: Implement creator click
    console.log('creator clicked')
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const onSubscription = async () => {
    const result = await toggleSubscribe(threadId, isSubscribed)
    if (result?.success) {
      toast({
        title: <Trans>{!isSubscribed ? 'Subscribed' : 'Unsubscribed'} Successfully</Trans>,
        description: (
          <Trans>
            Agent {title} was successfully {!isSubscribed ? 'subscribed' : 'unsubscribed'}
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

  return (
    <>
      <CardWrapper $borderRadius={12} $borderColor='transparent' onClick={onClick}>
        {type === AGENT_HUB_TYPE.KOL_RADAR ? (
          <Avatar name={kolInfo?.name ?? ''} size={100} avatar={kolInfo?.avatar} />
        ) : (
          <ImageContainer src={threadImageUrl} />
        )}
        <Content>
          <AdaptiveTextContent
            title={type === AGENT_HUB_TYPE.KOL_RADAR ? kolInfo?.name : title}
            description={type === AGENT_HUB_TYPE.KOL_RADAR ? kolInfo?.description : description}
          />
          <BottomContainer>
            <CreatorInfo creator={creator} avatar={avatar} onClick={onClickCreator} />
            <SubscriberCount subscriberCount={subscriberCount} subscribed={isSubscribed} onClick={onSubscription} />
          </BottomContainer>
        </Content>
      </CardWrapper>

      <AgentCardDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        agentId={threadId}
        title={title}
        description={description}
        creator={creator}
        subscriberCount={subscriberCount}
        avatar={avatar}
        agentImageUrl={threadImageUrl}
        stats={stats}
        tags={tags}
        type={type}
        recentChats={recentChats}
        onSubscription={onSubscription}
      />
    </>
  )
})

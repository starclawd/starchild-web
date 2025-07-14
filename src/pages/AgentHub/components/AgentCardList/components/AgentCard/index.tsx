import styled, { css, useTheme } from 'styled-components'
import { memo } from 'react'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { vm } from 'pages/helper'
import Avatar from 'components/Avatar'
import CreatorInfo from 'pages/AgentHub/components/AgentCardList/components/CreatorInfo'
import SubscriberCount from 'pages/AgentHub/components/AgentCardList/components/SubscriberCount'
import { AgentCardProps } from 'store/agenthub/agenthub'
import AdaptiveTextContent from 'pages/AgentHub/components/AdaptiveTextContent'
import { Trans } from '@lingui/react/macro'
import { useToggleAgentSubscribe } from 'store/agenthub/hooks'
import useToast, { TOAST_STATUS } from 'components/Toast'

const CardWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  gap: 16px;
  padding: 20px;
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

export default memo(function AgentCard({
  threadId,
  title,
  description,
  creator,
  subscriberCount,
  avatar,
  subscribed,
}: AgentCardProps) {
  const toggleSubscribe = useToggleAgentSubscribe()
  const theme = useTheme()
  const toast = useToast()

  const onClick = () => {
    // TODO: Implement agent click
    console.log('agent clicked')
  }

  const onClickCreator = () => {
    // TODO: Implement creator click
    console.log('creator clicked')
  }

  const onClickSubscriberCount = async () => {
    const result = await toggleSubscribe(threadId, subscribed)
    if (result?.success) {
      toast({
        title: <Trans>{result.subscribed ? 'Subscribed' : 'Unsubscribed'} Successfully</Trans>,
        description: (
          <Trans>
            Agent {title} was successfully {result.subscribed ? 'subscribed' : 'unsubscribed'}
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
    <CardWrapper $borderRadius={12} $borderColor='transparent' onClick={onClick}>
      <Avatar name={creator} size={100} avatar={avatar} />
      <Content>
        <AdaptiveTextContent title={<Trans>{title}</Trans>} description={<Trans>{description}</Trans>} />
        <BottomContainer>
          <CreatorInfo creator={creator} onClick={onClickCreator} />
          <SubscriberCount subscriberCount={subscriberCount} subscribed={subscribed} onClick={onClickSubscriberCount} />
        </BottomContainer>
      </Content>
    </CardWrapper>
  )
})

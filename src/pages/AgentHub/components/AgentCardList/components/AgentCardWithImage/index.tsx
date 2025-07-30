import styled, { css, useTheme } from 'styled-components'
import { memo, useState } from 'react'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { Trans } from '@lingui/react/macro'
import CreatorInfo from 'pages/AgentHub/components/AgentCardList/components/CreatorInfo'
import SubscriberCount from 'pages/AgentHub/components/AgentCardList/components/SubscriberCount'
import AdaptiveTextContent from 'pages/AgentHub/components/AdaptiveTextContent'
import { AgentCardProps } from 'store/agenthub/agenthub'
import { useIsAgentSubscribed, useIsSelfAgent, useSubscribeAgent, useUnsubscribeAgent } from 'store/agenthub/hooks'
import useToast, { TOAST_STATUS } from 'components/Toast'
import AgentCardDetailModal from 'pages/AgentHub/components/AgentCardList/components/AgentCardDetailModal'
import { AGENT_HUB_TYPE, ANI_DURATION } from 'constants/index'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'

const AgentCardWithImageWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  flex-direction: column;
  transition: all ${ANI_DURATION}s ease;
  overflow: hidden;
  padding: 8px;
  gap: 12px;
  border-radius: 16px;

  &:hover {
    background: ${({ theme }) => theme.bgT20};
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)};
      gap: ${vm(8)};
    `}
`

const ImageContainer = styled.div<{ $backgroundImage?: string }>`
  position: relative;
  width: 100%;
  height: 200px;
  background: ${({ $backgroundImage }) =>
    $backgroundImage ? `url(${$backgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  cursor: pointer;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(160)};
    `}
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
    `}
`

const StatsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(6)};
    `}
`

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.textL3};
  background: ${({ theme }) => theme.bgL2};
  padding: 8px 12px;
  border-radius: 6px;
  flex: 1;
  justify-content: space-between;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.1rem;
      gap: ${vm(2)};
      padding: ${vm(6)} ${vm(8)};
      border-radius: ${vm(4)};
    `}
`

const TokenListContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 4px;
`

const TokenLogo = styled.div<{ $offset: number }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
  font-weight: 600;
  border: 2px solid ${({ theme }) => theme.bgL1};
  margin-left: ${({ $offset }: { $offset: number }) => ($offset === 0 ? 0 : -10)}px;
  position: relative;
  z-index: ${({ $offset }: { $offset: number }) => $offset + 1};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(16)};
      height: ${vm(16)};
      font-size: 0.08rem;
    `}
`

const StatLabel = styled.span`
  color: ${({ theme }) => theme.textL3};
`

const StatValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
`

const APRValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.jade10};
`

const BottomContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`

export default memo(function AgentCardWithImage({
  id,
  agentId,
  title,
  description,
  creator,
  subscriberCount,
  avatar,
  agentImageUrl: threadImageUrl,
  stats,
  tags,
  types,
  recentChats,
}: AgentCardProps) {
  const [, setCurrentRouter] = useCurrentRouter()
  const subscribeAgent = useSubscribeAgent()
  const unsubscribeAgent = useUnsubscribeAgent()
  const isSubscribed = useIsAgentSubscribed(agentId)
  const isSelfAgent = useIsSelfAgent(agentId)
  const theme = useTheme()
  const toast = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // const renderTokenLogo = (token: string, index: number) => {
  //   const props = { $offset: index }

  //   switch (token) {
  //     case 'SOL':
  //       return (
  //         <TokenLogo key={token + index} {...props}>
  //           S
  //         </TokenLogo>
  //       )
  //     case 'ETH':
  //       return (
  //         <TokenLogo key={token + index} {...props}>
  //           E
  //         </TokenLogo>
  //       )
  //     case 'BTC':
  //       return (
  //         <TokenLogo key={token + index} {...props}>
  //           B
  //         </TokenLogo>
  //       )
  //     default:
  //       return (
  //         <TokenLogo key={token + index} {...props}>
  //           {token.slice(0, 1)}
  //         </TokenLogo>
  //       )
  //   }
  // }

  const onClick = () => {
    if (types.some((type) => type === AGENT_HUB_TYPE.STRATEGY)) {
      setCurrentRouter(`${ROUTER.AGENT_DETAIL}?agentId=${id}&from=${encodeURIComponent(location.pathname)}`)
      return
    }

    setIsModalOpen(true)
  }

  const onClickCreator = () => {
    // TODO: Implement creator click
  }

  const onSubscription = async () => {
    const result = isSubscribed ? await unsubscribeAgent(agentId) : await subscribeAgent(agentId)

    if (result?.status === 'success') {
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

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <AgentCardWithImageWrapper $borderColor='transparent' onClick={onClick}>
        <ImageContainer $backgroundImage={threadImageUrl}></ImageContainer>
        <ContentContainer>
          <AdaptiveTextContent title={<Trans>{title}</Trans>} description={<Trans>{description}</Trans>} />

          {/* 暂时不支持 Stats: Token, Wins, APR */}
          {/* <StatsContainer>
            {stats?.tokens && (
              <StatItem>
                <StatLabel>
                  <Trans>Token</Trans>
                </StatLabel>
                <TokenListContainer>
                  {stats?.tokens?.map((token, index) => renderTokenLogo(token, index))}
                </TokenListContainer>
              </StatItem>
            )}
            <StatItem>
              <StatLabel>
                <Trans>Wins</Trans>
              </StatLabel>
              <StatValue>{stats?.wins}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>
                <Trans>APR</Trans>
              </StatLabel>
              <APRValue>{stats?.apr}</APRValue>
            </StatItem>
          </StatsContainer> */}

          <BottomContainer>
            <CreatorInfo creator={creator} avatar={avatar} onClick={onClickCreator} />
            <SubscriberCount
              isSelfAgent={isSelfAgent}
              subscriberCount={subscriberCount}
              subscribed={isSubscribed}
              onClick={onSubscription}
            />
          </BottomContainer>
        </ContentContainer>
      </AgentCardWithImageWrapper>

      <AgentCardDetailModal
        id={id}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        agentId={agentId}
        title={title}
        description={description}
        creator={creator}
        subscriberCount={subscriberCount}
        avatar={avatar}
        agentImageUrl={threadImageUrl}
        stats={stats}
        tags={tags}
        types={types}
        recentChats={recentChats}
        onSubscription={onSubscription}
      />
    </>
  )
})

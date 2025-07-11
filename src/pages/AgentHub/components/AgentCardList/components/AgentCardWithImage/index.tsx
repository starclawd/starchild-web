import styled, { css } from 'styled-components'
import { memo } from 'react'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import Avatar from 'components/Avatar'
import { Trans } from '@lingui/react/macro'
import CreatorInfo from 'pages/AgentHub/components/AgentCardList/components/CreatorInfo'
import SubscriberCount from 'pages/AgentHub/components/AgentCardList/components/SubscriberCount'
import AdaptiveTextContent from 'pages/AgentHub/components/AdaptiveTextContent'
import { AgentCardProps } from 'store/agenthub/agenthub'

const AgentCardWithImageWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bgL1};
  transition: all 0.2s ease;
  overflow: hidden;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin: 0 ${vm(16)};
    `}
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px 12px 0 0;
  cursor: pointer;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(160)};
    `}
`

const AvatarContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      bottom: ${vm(12)};
      left: ${vm(12)};
    `}
`

const ContentContainer = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)};
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
      font-size: ${vm(10)};
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
      font-size: ${vm(8)};
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
  threadId,
  title,
  description,
  creator,
  subscriberCount,
  avatar,
  stats,
  subscribed,
}: AgentCardProps) {
  const renderTokenLogo = (token: string, index: number) => {
    const props = { $offset: index }

    switch (token) {
      case 'SOL':
        return (
          <TokenLogo key={token + index} {...props}>
            S
          </TokenLogo>
        )
      case 'ETH':
        return (
          <TokenLogo key={token + index} {...props}>
            E
          </TokenLogo>
        )
      case 'BTC':
        return (
          <TokenLogo key={token + index} {...props}>
            B
          </TokenLogo>
        )
      default:
        return (
          <TokenLogo key={token + index} {...props}>
            {token.slice(0, 1)}
          </TokenLogo>
        )
    }
  }

  const onClick = () => {
    // TODO: Implement indicator click
    console.log('indicator clicked')
  }

  const onClickCreator = () => {
    // TODO: Implement creator click
    console.log('creator clicked')
  }

  const onClickSubscriberCount = () => {
    // TODO: Implement subscribe toggle
    console.log('subscriber count clicked')
  }

  return (
    <AgentCardWithImageWrapper $borderRadius={12} $borderColor='transparent' onClick={onClick}>
      <ImageContainer>
        <AvatarContainer>
          <Avatar name={creator} size={60} avatar={avatar} />
        </AvatarContainer>
      </ImageContainer>
      <ContentContainer>
        <AdaptiveTextContent title={<Trans>{title}</Trans>} description={<Trans>{description}</Trans>} />

        {/* 暂时不支持 Stats: Token, Wins, APR */}
        <StatsContainer>
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
        </StatsContainer>

        <BottomContainer>
          <CreatorInfo creator={creator} onClick={onClickCreator} />
          <SubscriberCount subscriberCount={subscriberCount} subscribed={subscribed} onClick={onClickSubscriberCount} />
        </BottomContainer>
      </ContentContainer>
    </AgentCardWithImageWrapper>
  )
})

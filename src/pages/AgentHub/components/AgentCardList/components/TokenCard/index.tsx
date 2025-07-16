import styled, { css, useTheme } from 'styled-components'
import { memo, useState } from 'react'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { vm } from 'pages/helper'
import { AgentCardProps } from 'store/agenthub/agenthub'
import { Trans } from '@lingui/react/macro'
import { useIsAgentSubscribed, useToggleAgentSubscribe } from 'store/agenthub/hooks'
import useToast, { TOAST_STATUS } from 'components/Toast'
import AgentCardDetailModal from 'pages/AgentHub/components/AgentCardList/components/AgentCardDetailModal'
import { formatNumber, formatPercent } from 'utils/format'
import SubscriberCount from '../SubscriberCount'
const CardWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.bgL1};
  cursor: pointer;
  transition: all 0.2s ease;
  border-color: ${({ theme }) => theme.bgT30};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)};
      gap: ${vm(12)};
    `}
`

const TokenLogo = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  background-color: ${({ theme }) => theme.bgL2};
  flex-shrink: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(48)};
      height: ${vm(48)};
    `}
`

const TokenLogoFallback = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.bgL2};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(48)};
      height: ${vm(48)};
    `}
`

const TokenLogoFallbackText = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL3};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(18)};
    `}
`

const TokenInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(2)};
    `}
`

const TokenSymbol = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(16)};
    `}
`

const TokenFullName = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.textL2};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(12)};
    `}
`

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(2)};
    `}
`

const Price = styled.span`
  font-size: 18px;
  font-weight: 400;
  color: ${({ theme }) => theme.textL1};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(16)};
    `}
`

const PriceChange = styled.span<{ $isPositive: boolean }>`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme, $isPositive }) => ($isPositive ? theme.jade10 : theme.ruby50)};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(12)};
    `}
`

export default memo(function TokenCard({
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
            Token {tokenInfo?.symbol} was successfully {!isSubscribed ? 'subscribed' : 'unsubscribed'}
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

  // Parse price change to determine if it's positive or negative
  const parsePrice = (priceChange?: string) => {
    if (!priceChange) return { text: '', isPositive: false }
    const isPositive = !priceChange.startsWith('-')
    return { text: formatPercent({ value: priceChange, precision: 2 }), isPositive }
  }

  const priceChangeData = parsePrice(tokenInfo?.pricePerChange)

  return (
    <>
      <CardWrapper $borderRadius={12} $borderColor='transparent' onClick={onClick}>
        {/* Token Logo */}
        {tokenInfo?.logoUrl ? (
          <TokenLogo src={tokenInfo.logoUrl} alt={tokenInfo.symbol} />
        ) : (
          <TokenLogoFallback>
            <TokenLogoFallbackText>{tokenInfo?.symbol?.slice(0, 3) || 'TKN'}</TokenLogoFallbackText>
          </TokenLogoFallback>
        )}

        {/* Token Info */}
        <TokenInfo>
          <TokenSymbol>{tokenInfo?.symbol || title}</TokenSymbol>
          {tokenInfo?.fullName && <TokenFullName>{tokenInfo.fullName}</TokenFullName>}
        </TokenInfo>

        {/* Price Info */}
        <PriceInfo>
          {tokenInfo?.price && <Price>${formatNumber(tokenInfo.price)}</Price>}
          {tokenInfo?.pricePerChange && (
            <PriceChange $isPositive={priceChangeData.isPositive}>{priceChangeData.text}</PriceChange>
          )}
        </PriceInfo>

        <SubscriberCount subscriberCount={subscriberCount} subscribed={isSubscribed} onClick={onSubscription} />
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

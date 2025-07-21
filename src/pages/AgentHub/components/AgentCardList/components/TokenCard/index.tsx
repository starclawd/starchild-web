import styled, { css, useTheme } from 'styled-components'
import { memo, useState } from 'react'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { vm } from 'pages/helper'
import { AgentCardProps } from 'store/agenthub/agenthub'
import { Trans } from '@lingui/react/macro'
import { useIsAgentSubscribed, useSubscribeAgent, useUnsubscribeAgent } from 'store/agenthub/hooks'
import useToast, { TOAST_STATUS } from 'components/Toast'
import AgentCardDetailModal from 'pages/AgentHub/components/AgentCardList/components/AgentCardDetailModal'
import { formatNumber, formatPercent } from 'utils/format'
import SubscriberCount from '../SubscriberCount'
import { ANI_DURATION } from 'constants/index'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'

const CardWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.bgL1};
  cursor: pointer;
  transition: all ${ANI_DURATION}s ease;
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

export default memo(function TokenCard({ tokenInfo }: AgentCardProps) {
  const [, setCurrentRouter] = useCurrentRouter()

  const onClick = () => {
    // go to token agent page by token id(tag)
    setCurrentRouter(`${ROUTER.AGENT_HUB_DEEP_DIVE}/${tokenInfo?.fullName}`)
  }

  // Parse price change to determine if it's positive or negative
  const parsePrice = (priceChange?: number) => {
    if (!priceChange) return { text: '', isPositive: false }
    const isPositive = priceChange > 0
    return { text: formatPercent({ value: priceChange / 100, precision: 2 }), isPositive }
  }

  const priceChangeData = parsePrice(tokenInfo?.pricePerChange)

  return (
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
        <TokenSymbol>{tokenInfo?.symbol}</TokenSymbol>
        {tokenInfo?.fullName && <TokenFullName>{tokenInfo.fullName}</TokenFullName>}
      </TokenInfo>

      {/* Price Info */}
      <PriceInfo>
        {tokenInfo?.price && <Price>${formatNumber(tokenInfo.price)}</Price>}
        {tokenInfo?.pricePerChange && (
          <PriceChange $isPositive={priceChangeData.isPositive}>
            {priceChangeData.isPositive ? '+' : ''}
            {priceChangeData.text}
          </PriceChange>
        )}
      </PriceInfo>
    </CardWrapper>
  )
})

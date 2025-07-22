import styled, { css } from 'styled-components'
import { memo } from 'react'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { vm } from 'pages/helper'
import { TokenCardProps } from 'store/agenthub/agenthub'
import { useCurrentTokenInfo } from 'store/agenthub/hooks'
import { formatNumber, formatPercent } from 'utils/format'
import { AGENT_CATEGORIES, AGENT_HUB_TYPE, ANI_DURATION } from 'constants/index'
import { setCurrentRouter } from 'store/application/reducer'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'

const CardWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  transition: all ${ANI_DURATION}s ease;
  border-color: ${({ theme }) => theme.bgT30};
  border-radius: 16px;

  &:hover {
    background: ${({ theme }) => theme.bgT20};
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)} ${vm(12)};
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
      width: ${vm(32)};
      height: ${vm(32)};
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
  line-height: 26px;
  font-weight: 400;
  color: ${({ theme }) => theme.textL1};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.16rem;
      line-height: 0.24rem;
    `}
`

const TokenFullName = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.textL3};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
      line-height: 0.18rem;
    `}
`

const TokenDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.textL3};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
      line-height: 0.18rem;
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
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

const PriceChange = styled.span<{ $isPositive: boolean }>`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme, $isPositive }) => ($isPositive ? theme.jade10 : theme.ruby50)};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
      line-height: 0.18rem;
    `}
`

export default memo(function TokenCard({ tokenInfo, enableClick }: TokenCardProps) {
  const [, setCurrentTokenInfo] = useCurrentTokenInfo()
  const [, setCurrentRouter] = useCurrentRouter()

  const onClick = () => {
    // Set current token info and navigate to token-deep-dive page
    setCurrentTokenInfo(tokenInfo || null)
    setCurrentRouter(ROUTER.AGENT_HUB_DEEP_DIVE)
  }

  // Parse price change to determine if it's positive or negative
  const parsePrice = (priceChange?: number) => {
    if (!priceChange) return { text: '', isPositive: false }
    const isPositive = priceChange > 0
    return { text: formatPercent({ value: priceChange / 100, precision: 2 }), isPositive }
  }

  const priceChangeData = parsePrice(tokenInfo?.pricePerChange)

  return (
    <CardWrapper
      style={{ cursor: enableClick ? 'pointer' : 'default' }}
      $borderRadius={12}
      $borderColor='transparent'
      onClick={enableClick ? onClick : undefined}
    >
      {/* Token Logo */}
      {tokenInfo?.logoUrl && <TokenLogo src={tokenInfo.logoUrl} alt={tokenInfo.symbol} />}

      {/* Token Info */}
      <TokenInfo>
        <TokenSymbol>{tokenInfo?.symbol.toUpperCase()}</TokenSymbol>
        {tokenInfo?.price ? (
          <TokenFullName>{tokenInfo.fullName}</TokenFullName>
        ) : (
          <TokenDescription>{tokenInfo?.description}</TokenDescription>
        )}
      </TokenInfo>

      {/* Price Info */}
      {tokenInfo?.price && (
        <PriceInfo>
          <Price>${formatNumber(tokenInfo.price)}</Price>
          {tokenInfo?.pricePerChange && (
            <PriceChange $isPositive={priceChangeData.isPositive}>
              {priceChangeData.isPositive ? '+' : ''}
              {priceChangeData.text}
            </PriceChange>
          )}
        </PriceInfo>
      )}
    </CardWrapper>
  )
})

import styled, { css } from 'styled-components'
import { memo } from 'react'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { vm } from 'pages/helper'
import { TokenCardProps } from 'store/agenthub/agenthub'
import { useCurrentTokenInfo } from 'store/agenthub/hooks'
import { formatNumber, formatPercent } from 'utils/format'
import { ANI_DURATION } from 'constants/index'

const CardWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.bgL1};
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

export default memo(function TokenCard({ tokenInfo, enableClick }: TokenCardProps) {
  const [, setCurrentTokenInfo] = useCurrentTokenInfo()

  const onClick = () => {
    // Set current token info instead of navigating
    setCurrentTokenInfo(tokenInfo || null)
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

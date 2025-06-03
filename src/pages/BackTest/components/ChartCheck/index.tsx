import styled, { css } from 'styled-components'
import { useTheme } from 'store/themecache/hooks'
import { ANI_DURATION } from 'constants/index'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useCallback } from 'react'
import { Trans } from '@lingui/react/macro'
import { useIsShowPrice } from 'store/backtest/hooks'

const ChartCheckWrapper = styled(BorderAllSide1PxBox)`
  width: 180px;
  height: 44px;
  padding: 4px;
  gap: 4px;
`

const IconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  width: 84px;
  height: 36px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px; 
  border-radius: 40px;
  color: ${({ theme }) => theme.textL1};
  cursor: pointer;
`

const MockBg = styled.div<{ $isShowPrice: boolean }>`
  position: absolute;
  left: 4px;
  top: 4px;
  width: 84px;
  height: 36px;
  border-radius: 40px;
  transition: left ${ANI_DURATION}s;
  background-color: ${({ theme }) => theme.brand6};
  ${({ $isShowPrice }) => !$isShowPrice && css`
    left: 91px;
  `}
`

export default function ChartCheck() {
  const theme = useTheme()
  const [isShowPrice, setIsShowPrice] = useIsShowPrice()
  const changeIsShowPrice = useCallback((status: boolean) => {
    return () => {
      setIsShowPrice(status)
    }
  }, [setIsShowPrice])
  return <ChartCheckWrapper
    $borderColor={theme.bgT30}
    $borderRadius={44}
  >
    <IconWrapper onClick={changeIsShowPrice(true)}>
      <Trans>Price</Trans>
    </IconWrapper>
    <IconWrapper onClick={changeIsShowPrice(false)}>
      <Trans>Equity</Trans>
    </IconWrapper>
    <MockBg $isShowPrice={isShowPrice}></MockBg>
  </ChartCheckWrapper>
}

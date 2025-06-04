import styled, { css } from 'styled-components'
import { useTheme } from 'store/themecache/hooks'
import { ANI_DURATION } from 'constants/index'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useCallback } from 'react'
import { Trans } from '@lingui/react/macro'
import { useIsShowPrice } from 'store/backtest/hooks'
import { vm } from 'pages/helper'

const ChartCheckWrapper = styled(BorderAllSide1PxBox)<{ $isMobileBackTestPage?: boolean }>`
  ${({ $isMobileBackTestPage }) => css`
    width: ${vm(180, $isMobileBackTestPage)};
    height: ${vm(44, $isMobileBackTestPage)};
    padding: ${vm(4, $isMobileBackTestPage)};
    gap: ${vm(4, $isMobileBackTestPage)};
  `}
`

const IconWrapper = styled.div<{ $isMobileBackTestPage?: boolean }>`
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
  ${({ $isMobileBackTestPage }) => !$isMobileBackTestPage && css`
    width: ${vm(84)};
    height: ${vm(36)};
    font-size: 0.14rem;
    line-height: 0.20rem;
    border-radius: ${vm(40)};
  `}
`

const MockBg = styled.div<{ $isShowPrice: boolean, $isMobileBackTestPage?: boolean }>`
  position: absolute;
  left: 4px;
  top: 3px;
  width: 84px;
  height: 36px;
  border-radius: 40px;
  transition: left ${ANI_DURATION}s;
  background-color: ${({ theme }) => theme.brand6};
  ${({ $isShowPrice }) => !$isShowPrice && css`
    left: 91px;
  `}
  ${({ $isMobileBackTestPage, $isShowPrice }) => !$isMobileBackTestPage && css`
    left: ${vm(4)};
    top: ${vm(3)};
    width: ${vm(84)};
    height: ${vm(36)};
    border-radius: ${vm(40)};
    ${!$isShowPrice && css`
      left: ${vm(91)};
    `}
  `}
`

export default function ChartCheck({
  isMobileBackTestPage,
}: {
  isMobileBackTestPage?: boolean
}) {
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
    $isMobileBackTestPage={isMobileBackTestPage}
  >
    <IconWrapper $isMobileBackTestPage={isMobileBackTestPage} onClick={changeIsShowPrice(true)}>
      <Trans>Price</Trans>
    </IconWrapper>
    <IconWrapper $isMobileBackTestPage={isMobileBackTestPage} onClick={changeIsShowPrice(false)}>
      <Trans>Equity</Trans>
    </IconWrapper>
    <MockBg $isMobileBackTestPage={isMobileBackTestPage} $isShowPrice={isShowPrice}></MockBg>
  </ChartCheckWrapper>
}

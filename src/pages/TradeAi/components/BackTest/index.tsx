import CryptoChart from 'pages/BackTest/components/CryptoChart'
import DataList from 'pages/BackTest/components/DataList'
import VolumeChart from 'pages/BackTest/components/VolumeChart'
import { vm } from 'pages/helper'
import { useRef } from 'react'
import { useIsMobile } from 'store/application/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'

const BackTestWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(12)};
  `}
`

const BottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.lineDark6};
`

export default function BackTest() {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const backTestWrapperRef = useRef<HTMLDivElement>(null)
  return <BackTestWrapper
    ref={backTestWrapperRef as any}
    $borderRadius={24}
    $borderColor={theme.bgT30}
  >
    <CryptoChart
      symbol="BTC"
      ref={backTestWrapperRef as any}
      isBinanceSupport={true}
    />
    {!isMobile && <BottomWrapper>
      <DataList />
      <VolumeChart />
    </BottomWrapper>}
  </BackTestWrapper>
}

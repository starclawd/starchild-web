import CryptoChart from 'pages/BackTest/components/CryptoChart'
import DataList from 'pages/BackTest/components/DataList'
import VolumeChart from 'pages/BackTest/components/VolumeChart'
import { useRef } from 'react'
import { useIsMobile } from 'store/application/hooks'
import styled from 'styled-components'

const BackTestWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.bgT30};
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
  const isMobile = useIsMobile()
  const backTestWrapperRef = useRef<HTMLDivElement>(null)
  return <BackTestWrapper ref={backTestWrapperRef as any}>
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

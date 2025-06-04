import { useScrollbarClass } from 'hooks/useScrollbarClass'
import CryptoChart from 'pages/BackTest/components/CryptoChart'
import styled from 'styled-components'
import Highlights from 'pages/BackTest/components/Highlights'

const MobileBackTestWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  padding: 12px;
  cursor: pointer;
  @media screen and (orientation:landscape) {
    gap: 20px;
    width: 100vw;
    height: calc(100vh + 60px) !important;
    min-height: calc(100vh + 60px);
    max-height: none;
    overflow-y: auto;
  }
`

export default function MobileBackTest() {
  const backTestWrapperRef = useScrollbarClass<HTMLDivElement>()

  return <MobileBackTestWrapper 
    ref={backTestWrapperRef as any}
  >
    <CryptoChart
      symbol="BTC"
      ref={backTestWrapperRef as any}
      isBinanceSupport={true}
      isMobileBackTestPage={true}
    />
    <Highlights />
  </MobileBackTestWrapper>
}

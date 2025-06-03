import { useScrollbarClass } from 'hooks/useScrollbarClass'
import CryptoChart from 'pages/BackTest/components/CryptoChart'
import styled from 'styled-components'

const MobileBackTestWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  overflow: hidden;
  padding: 12px;
  .icon-chat-expand-down {
    display: none;
  }
  @media screen and (orientation:landscape) {
    width: 100vw;
    height: 100vh;
  }
`

export default function MobileBackTest() {
  const backTestWrapperRef = useScrollbarClass<HTMLDivElement>()
  return <MobileBackTestWrapper ref={backTestWrapperRef as any}>
    <CryptoChart
      symbol="BTC"
      ref={backTestWrapperRef as any}
      isBinanceSupport={true}
      isMobileBackTestPage={true}
    />
  </MobileBackTestWrapper>
}

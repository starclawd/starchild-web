import styled from 'styled-components'
import CryptoChart from './components/CryptoChart'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import DataList from './components/DataList'
import VolumeChart from './components/VolumeChart'

const BackTestWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1920px;
  width: 100%;
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
  const backTestWrapperRef = useScrollbarClass<HTMLDivElement>()
  return <BackTestWrapper
    className="scroll-style"
    ref={backTestWrapperRef as any}
  >
    <CryptoChart
        symbol="BTC"
        ref={backTestWrapperRef as any}
        isBinanceSupport={true}
    />
    <BottomWrapper>
      <DataList />
      <VolumeChart />
    </BottomWrapper>
  </BackTestWrapper>
}

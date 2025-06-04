import styled from 'styled-components'
import CryptoChart from './components/CryptoChart'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import DataList from './components/DataList'
import VolumeChart from './components/VolumeChart'
import Highlights from './components/Highlights'

const BackTestWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 1920px;
  width: 100%;
`

const Content = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  gap: 20px;
  overflow-x: hidden;
`

const Left = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: calc(100% - 380px);
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  .chart-wrapper {
    height: 60%;
    .chart-content-wrapper {
      height: calc(100% - 104px);
    }
  }
`

const BottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 40%;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.lineDark6};
  .volume-chart-wrapper {
    height: calc(100% - 70px);
    .chart-content {
      height: calc(100% - 30px);
    }
  }
  .item-wrapper {
    width: calc((100% - 20px) / 6);
  }
`

export default function BackTest() {
  const backTestWrapperRef = useScrollbarClass<HTMLDivElement>()
  return <BackTestWrapper
    className="scroll-style"
    ref={backTestWrapperRef as any}
  >
    <Content>
      <Left>
        <CryptoChart
            symbol="BTC"
            ref={backTestWrapperRef as any}
            isBinanceSupport={true}
        />
        <BottomWrapper>
          <DataList />
          <VolumeChart />
        </BottomWrapper>
      </Left>
      <Highlights />
    </Content>
  </BackTestWrapper>
}

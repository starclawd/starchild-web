import styled from 'styled-components'
import AiThreadsList from './components/AiThreadsList'
import FileDrag from './components/FileDrag'

const TradeAiWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`

const InnerContent = styled.div`
  display: flex;
  height: 100%;
  ${({ theme }) => theme.mediaMinWidth.minWidth1024`
    width: 944px;
    .left-content {
      width: 380px;
    }
    .right-content {
      width: 564px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1280`
    width: 1160px;
    .left-content {
      width: 380px;
    }
    .right-content {
      width: 780px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1440`
    width: 1310px;
    .left-content {
      width: 516px;
    }
    .right-content {
      width: 780px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1920`
    width: 1760px;
    .left-content {
      width: 516px;
    }
    .right-content {
      width: 780px;
    }
  `}
`

const LeftContent = styled.div`
  display: flex;
`

const RightContent = styled.div`
  display: flex;
  flex-direction: column;
`

export default function TradeAi() {
  return <TradeAiWrapper>
    <InnerContent>
      <LeftContent className="left-content">
        <AiThreadsList />
      </LeftContent>
      <RightContent className="right-content">
        <FileDrag />
      </RightContent>
    </InnerContent>
  </TradeAiWrapper>
}

import styled from 'styled-components'
import AiThreadsList from './components/AiThreadsList'
import FileDrag from './components/FileDrag'
import { ANI_DURATION } from 'constants/index'

const TradeAiWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  ${({ theme }) => theme.mediaMinWidth.minWidth1024`
    .left-content,
    .left-inner-content {
      width: 380px;
    }
    .right-content,
    .right-inner-content {
      width: 564px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1280`
    .left-content,
    .left-inner-content {
      width: 380px;
    }
    .right-content,
    .right-inner-content {
      width: 780px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1440`
    .left-content,
    .left-inner-content {
      width: 516px;
    }
    .right-content,
    .right-inner-content {
      width: 780px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1920`
    .left-content,
    .left-inner-content {
      width: 516px;
    }
    .right-content,
    .right-inner-content {
      width: 780px;
    }
  `}
`

const LeftContent = styled.div`
  display: flex;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  overflow: hidden;
`

const RightContent = styled.div`
  display: flex;
  transition: width ${ANI_DURATION}s;
  will-change: width;
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export default function TradeAi() {
  return <TradeAiWrapper>
    <LeftContent className="left-content">
      <InnerContent className="left-inner-content">
        <AiThreadsList />
      </InnerContent>
    </LeftContent>
    <RightContent className="right-content">
      <InnerContent className="right-inner-content">
        <FileDrag />
      </InnerContent>
    </RightContent>
  </TradeAiWrapper>
}

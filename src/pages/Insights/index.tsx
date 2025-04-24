import styled from 'styled-components'
import InsightsList from './components/InsightsList'
import { ANI_DURATION } from 'constants/index'

const InsightsWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  ${({ theme }) => theme.mediaMinWidth.minWidth1024`
    .left-content {
      width: 380px;
    }
    .right-content {
      width: 564px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1280`
    .left-content {
      width: 380px;
    }
    .right-content {
      width: 780px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1440`
    .left-content {
      width: 516px;
    }
    .right-content {
      width: 780px;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1920`
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
  transition: width ${ANI_DURATION}s;
  will-change: width;
`

const RightContent = styled.div`
  display: flex;
  transition: width ${ANI_DURATION}s;
  will-change: width;
`

export default function Insights() {
  return <InsightsWrapper>
    <LeftContent className="left-content">
      <InsightsList />
    </LeftContent>
    <RightContent className="right-content">
    </RightContent>
  </InsightsWrapper>
}

import styled from 'styled-components'
import InsightsList from './components/InsightsList'

const InsightsWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`

const InnerWrapper = styled.div`
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
`

export default function Insights() {
  return <InsightsWrapper>
    <InnerWrapper>
      <LeftContent className="left-content">
        <InsightsList />
      </LeftContent>
      <RightContent className="right-content">
      </RightContent>
    </InnerWrapper>
  </InsightsWrapper>
}

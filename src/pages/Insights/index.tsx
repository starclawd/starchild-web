import styled from 'styled-components'
import InsightsList from './components/InsightsList'
import { ANI_DURATION } from 'constants/index'
import TokenSwitch from './components/TokenSwitch'
import { useCurrentInsightToken } from 'store/insightscache/hooks'
import CryptoChart from 'components/CryptoChart'

const InsightsWrapper = styled.div`
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
    .right-content {
      margin-left: 32px;
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
    .right-content {
      margin-left: 32px;
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
    .right-content {
      margin-left: 42px;
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
    .right-content {
      margin-left: 266px;
    }
  `}
`

const LeftContent = styled.div`
  display: flex;
  flex-shrink: 0;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  overflow: hidden;
  padding-top: 32px;
`

const RightContent = styled.div`
  display: flex;
  flex-shrink: 0;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  overflow: hidden;
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 20px;
`

export default function Insights() {
  const [currentInsightToken, setCurrentInsightToken] = useCurrentInsightToken()
  return <InsightsWrapper>
    <LeftContent className="left-content">
      <InnerContent className="left-inner-content">
        <TokenSwitch
          currentInsightToken={currentInsightToken}
          setCurrentInsightToken={setCurrentInsightToken}
        />
      </InnerContent>
    </LeftContent>
    <RightContent className="right-content">
      <InnerContent className="right-inner-content">
        <CryptoChart/>
        <InsightsList />
      </InnerContent>
    </RightContent>
  </InsightsWrapper>
}

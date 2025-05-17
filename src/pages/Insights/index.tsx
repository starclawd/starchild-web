import styled from 'styled-components'
import InsightsList from './components/InsightsList'
import { ANI_DURATION } from 'constants/index'
import TokenSwitch from './components/TokenSwitch'
import { useCurrentInsightTokenData } from 'store/insightscache/hooks'
import CryptoChart from 'components/CryptoChart'
import { useGetCoingeckoCoinIdMap } from 'store/insights/hooks'
import { useEffect } from 'react'
import { useIsLogin } from 'store/login/hooks'

const InsightsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
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
  padding-top: 20px;
`

const RightContent = styled.div`
  display: flex;
  flex-shrink: 0;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  overflow: hidden;
  padding-top: 20px;
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Placeholder = styled.div`
  width: 0px;
  height: 100%;
`

export default function Insights() {
  const isLogin = useIsLogin()
  const [{ symbol: currentInsightToken, isBinanceSupport }] = useCurrentInsightTokenData()
  const triggerGetCoingeckoCoinIdMap = useGetCoingeckoCoinIdMap()
  useEffect(() => {
    if (isLogin) {
      triggerGetCoingeckoCoinIdMap()
    }
  }, [isLogin, triggerGetCoingeckoCoinIdMap])
  return <InsightsWrapper>
    <LeftContent className="left-content">
      <InnerContent className="left-inner-content">
        <TokenSwitch />
      </InnerContent>
    </LeftContent>
    <RightContent className="right-content">
      <InnerContent className="right-inner-content">
        {currentInsightToken && <CryptoChart
          key={currentInsightToken}
          symbol={currentInsightToken}
          isBinanceSupport={isBinanceSupport}
        />}
        <InsightsList />
      </InnerContent>
    </RightContent>
    <Placeholder />
  </InsightsWrapper>
}

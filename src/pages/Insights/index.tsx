import styled from 'styled-components'
import InsightsList from './components/InsightsList'
import { ANI_DURATION } from 'constants/index'
import TokenSwitch from 'pages/Mobile/MobileInsights/components/TokenSwitch'
import { useState } from 'react'
import { useCurrentInsightToken } from 'store/insightscache/hooks'
import Notification from './components/Notification'
import { Trans } from '@lingui/react/macro'

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
  padding-top: 32px;
`

const RightContent = styled.div`
  display: flex;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  overflow: hidden;
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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
        <InsightsList />
      </InnerContent>
    </RightContent>
  </InsightsWrapper>
}

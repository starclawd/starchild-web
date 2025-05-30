import styled, { css } from 'styled-components'
import InsightsList from './components/InsightsList'
import { ANI_DURATION } from 'constants/index'
import TokenSwitch from './components/TokenSwitch'
import { useCurrentInsightTokenData } from 'store/insightscache/hooks'
import CryptoChart from 'pages/Insights/components/CryptoChart'
import { useCurrentInsightDetailData, useGetCoingeckoCoinIdMap, useIsShowInsightsDetail } from 'store/insights/hooks'
import { useEffect, useRef } from 'react'
import { useIsLogin } from 'store/login/hooks'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import InsightItem from './components/InsightItem'
import { CryptoChartRef } from 'store/insights/insights.d'

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
      min-width: 600px;
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
      min-width: 440px;
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
  flex-shrink: 0;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  overflow: hidden;
  padding-top: 20px;
`

const RightContent = styled.div`
  display: flex;
  transition: width ${ANI_DURATION}s;
  will-change: width;
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
  ${({ theme }) => theme.mediaMinWidth.minWidth1440`
    display: none;
  `}
`

const InsightsDetailContent = styled.div<{ $isShowInsightsDetail: boolean }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: -360px;
  gap: 20px;
  flex-shrink: 0;
  width: 360px;
  height: 100%;
  border-radius: 24px;
  z-index: 10;
  border: 1px solid ${({ theme }) => theme.bgT30};
  background-color: ${({ theme }) => theme.bgL1};
  box-shadow: -4px 0px 4px 0px ${({ theme }) => theme.systemShadow};
  ${({ theme, $isShowInsightsDetail }) => theme.mediaMinWidth.minWidth1024`
    transition: transform ${ANI_DURATION}s;
    ${$isShowInsightsDetail && css`
      right: -346px;
      transform: translateX(-100%);
    `}
  `}
  ${({ theme, $isShowInsightsDetail }) => theme.mediaMinWidth.minWidth1440`
    position: relative;
    right: unset;
    transform: unset;
    transition: width ${ANI_DURATION}s;
    overflow: hidden;
    margin-left: 12px;
    ${!$isShowInsightsDetail && css`
      width: 0;
      border: none;
    `}
  `}
`

const InsightsDetailInnerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
  width: 360px;
  height: 100%;
  padding: 16px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  height: 44px;
  span {
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    color: ${({ theme }) => theme.textL1};
  }
  .icon-chat-close {
    font-size: 28px;
    color: ${({ theme }) => theme.textL4};
    cursor: pointer;
  }
`

export default function Insights() {
  const isLogin = useIsLogin()
  const [isShowInsightsDetail, setIsShowInsightsDetail] = useIsShowInsightsDetail()
  const [currentInsightDetailData] = useCurrentInsightDetailData()
  const [{ symbol: currentInsightToken, isBinanceSupport }] = useCurrentInsightTokenData()
  const triggerGetCoingeckoCoinIdMap = useGetCoingeckoCoinIdMap()
  const rightContentRef = useRef<HTMLDivElement>(null)
  const cryptoChartRef = useRef<CryptoChartRef>(null)

  // 监听 RightContent 的宽度变化
  useEffect(() => {
    if (!rightContentRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // 当容器宽度发生变化时，调用图表的 handleResize 方法
        if (cryptoChartRef.current) {
          cryptoChartRef.current.handleResize()
        }
      }
    })

    resizeObserver.observe(rightContentRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

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
    <RightContent ref={rightContentRef} className="right-content">
      <InnerContent className="right-inner-content">
        {currentInsightToken && <CryptoChart
          ref={cryptoChartRef as any}
          key={currentInsightToken}
          symbol={currentInsightToken}
          isBinanceSupport={isBinanceSupport}
        />}
        <InsightsList />
      </InnerContent>
    </RightContent>
    <Placeholder />
    <InsightsDetailContent $isShowInsightsDetail={isShowInsightsDetail}>
      <InsightsDetailInnerContent>
        <Header>
          <span><Trans>Details</Trans></span>
          <IconBase onClick={() => setIsShowInsightsDetail(false)} className="icon-chat-close" />
        </Header>
        {currentInsightDetailData && <InsightItem
          isActive={true}
          isInsightsDetail={true}
          data={currentInsightDetailData}
        />}
      </InsightsDetailInnerContent>
    </InsightsDetailContent>
  </InsightsWrapper>
}

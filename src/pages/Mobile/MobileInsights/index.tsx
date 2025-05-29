import styled, { css } from 'styled-components'
import PullDownRefresh from 'components/PullDownRefresh'
import { useCallback, useState } from 'react'
import InsightsList from 'pages/Insights/components/InsightsList'
import Header from './components/Header'
import { vm } from 'pages/helper'
import { useTheme } from 'store/themecache/hooks'
import BottomSheet from 'components/BottomSheet'
import AllToken from 'pages/Insights/components/AllToken'
import TokenSwitch from 'pages/Insights/components/TokenSwitch'
import { useGetAllInsights, useTokenList } from 'store/insights/hooks'
import TokenItem from 'pages/Insights/components/TokenItem'
import { useCurrentInsightTokenData } from 'store/insightscache/hooks'
import CryptoChart from 'pages/Insights/components/CryptoChart'
import { useIsLogin } from 'store/login/hooks'
const MobileInsightsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex-grow: 1;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 8px 12px;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
    height: calc(100% - ${vm(68)});
    padding: ${vm(8)} ${vm(12)} 0;
  `}
`


export default function MobileInsights() {
  const theme = useTheme()
  const isLogin = useIsLogin()
  const tokenList = useTokenList()
  const triggerGetAllInsights = useGetAllInsights()
  const [{ symbol: currentInsightToken, isBinanceSupport }] = useCurrentInsightTokenData()
  const [isShowTokenSwitch, setIsShowTokenSwitch] = useState(false)
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false)
  const onRefresh = useCallback(async () => {
    try {
      setIsPullDownRefreshing(true)
      if (isLogin) {
        await triggerGetAllInsights({ pageIndex: 1 })
      }
      setTimeout(() => {
        setIsPullDownRefreshing(false)
      }, 1000)
    } catch (error) {
      setIsPullDownRefreshing(false)
    }
  }, [isLogin, triggerGetAllInsights])

  const showTokenSwitch = useCallback(() => {
    setIsShowTokenSwitch(true)
  }, [])
  const closeTokenSwitch = useCallback(() => {
    setIsShowTokenSwitch(false)
  }, [])
  return <MobileInsightsWrapper>
    <PullDownRefresh
      onRefresh={onRefresh}
      isRefreshing={isPullDownRefreshing}
      setIsRefreshing={setIsPullDownRefreshing}
      scrollContainerId="#insightsListWrapperEl"
    >
      <Header />
      <ContentWrapper>
        {
          currentInsightToken
            ? <TokenItem
              isSwitchFunc={true}
              size={tokenList.find(token => token.symbol === currentInsightToken)?.size || 0}
              symbol={currentInsightToken}
              des={tokenList.find(token => token.symbol === currentInsightToken)?.des || ''}
              isActive={true}
              changeToken={showTokenSwitch}
            />
            : <AllToken
              isActive={true}
              isSwitchFunc={true}
              clickCallback={showTokenSwitch}
            />
        }
        {currentInsightToken && <CryptoChart
          key={currentInsightToken}
          symbol={currentInsightToken}
          isBinanceSupport={isBinanceSupport}
        />}
        <InsightsList />
        <BottomSheet
          showFromBottom
          rootStyle={{
            bottom: '0 !important',
            height: `calc(100% - ${vm(67)})`,
            backgroundColor: theme.bgL1
          }}
          isOpen={isShowTokenSwitch}
          onClose={closeTokenSwitch}
        >
          <TokenSwitch closeTokenSwitch={closeTokenSwitch} />
        </BottomSheet>
      </ContentWrapper>
    </PullDownRefresh>
  </MobileInsightsWrapper>
}

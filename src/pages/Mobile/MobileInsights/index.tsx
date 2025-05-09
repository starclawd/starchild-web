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
import { useTokenList } from 'store/insights/hooks'
import TokenItem from 'pages/Insights/components/TokenItem'
import { useCurrentInsightToken } from 'store/insightscache/hooks'
import CryptoChart from 'components/CryptoChart'
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
  const tokenList = useTokenList()
  const [currentInsightToken, setCurrentInsightToken] = useCurrentInsightToken()
  const [isShowTokenSwitch, setIsShowTokenSwitch] = useState(false)
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false)
  const onRefresh = useCallback(() => {
    setIsPullDownRefreshing(true)
    window.location.reload()
    // setTimeout(() => {
    //   setIsPullDownRefreshing(false)
    // }, 1000)
  }, [])

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
        {currentInsightToken && <CryptoChart symbol={currentInsightToken} />}
        <InsightsList />
        <BottomSheet
          showFromBottom
          rootStyle={{
            height: `calc(100vh - ${vm(68)})`,
            backgroundColor: theme.bgL1
          }}
          isOpen={isShowTokenSwitch}
          onClose={closeTokenSwitch}
        >
          <TokenSwitch
            currentInsightToken={currentInsightToken}
            setCurrentInsightToken={setCurrentInsightToken}
          />
        </BottomSheet>
      </ContentWrapper>
    </PullDownRefresh>
  </MobileInsightsWrapper>
}

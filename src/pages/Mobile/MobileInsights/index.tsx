import { Trans } from '@lingui/react/macro'
import styled, { css } from 'styled-components'
import PullDownRefresh from 'components/PullDownRefresh'
import { useCallback, useMemo, useState } from 'react'
import InsightsList from 'pages/Insights/components/InsightsList'
import Header from './components/Header'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useTheme } from 'store/themecache/hooks'
import { IconBase } from 'components/Icons'
import { getTokenImg } from 'utils'
import BottomSheet from 'components/BottomSheet'
import AllToken from './components/AllToken'
import TokenSwitch from './components/TokenSwitch'
import { useTokenList } from 'store/insights/hooks'
import TokenItem from './components/TokenItem'
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
  const tokenList = useTokenList()
  const [currentInsightToken, setCurrentInsightToken] = useState('')
  const [isShowTokenSwitch, setIsShowTokenSwitch] = useState(false)
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false)
  const onRefresh = useCallback(() => {
    setIsPullDownRefreshing(true)
    setTimeout(() => {
      setIsPullDownRefreshing(false)
    }, 1000)
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
      >
        <Header />
        <ContentWrapper>
          {
            currentInsightToken
              ? <TokenItem
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
          <InsightsList />
          <TokenSwitch
            isShowTokenSwitch={isShowTokenSwitch}
            currentInsightToken={currentInsightToken}
            closeTokenSwitch={closeTokenSwitch}
            setCurrentInsightToken={setCurrentInsightToken}
          />
        </ContentWrapper>
      </PullDownRefresh>
  </MobileInsightsWrapper>
}

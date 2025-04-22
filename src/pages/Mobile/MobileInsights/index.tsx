import { Trans } from '@lingui/react/macro'
import styled, { css } from 'styled-components'
import PullDownRefresh from 'components/PullDownRefresh'
import { useCallback, useState } from 'react'
import InsightsList from 'pages/Insights/components/InsightsList'
import Header from './components/Header'
import { vm } from 'pages/helper'
const MobileInsightsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex-grow: 1;
`

const ContentWrapper = styled.div`
  padding: 8px 12px;
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(8)} ${vm(12)};
  `}
`

export default function MobileInsights() {
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false)
  const onRefresh = useCallback(() => {
    setIsPullDownRefreshing(true)
    setTimeout(() => {
      setIsPullDownRefreshing(false)
    }, 1000)
  }, [])
  return <MobileInsightsWrapper>
    <PullDownRefresh
        onRefresh={onRefresh}
        isRefreshing={isPullDownRefreshing}
        setIsRefreshing={setIsPullDownRefreshing}
      >
        <Header />
        <ContentWrapper>
          <InsightsList />
        </ContentWrapper>
      </PullDownRefresh>
  </MobileInsightsWrapper>
}

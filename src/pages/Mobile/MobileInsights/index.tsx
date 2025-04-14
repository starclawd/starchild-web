import { Trans } from '@lingui/react/macro'
import styled from 'styled-components'
import PullDownRefresh from 'components/PullDownRefresh'
import { useCallback, useState } from 'react'
import TradeAi from 'pages/TradeAi'
const MobileInsightsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex-grow: 1;
`

const ContentWrapper = styled.div`
  height: calc(100% - 52px);
  padding: 0 14px 14px;
  border-radius: 12px;
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
    <div>
      <Trans>Insights</Trans>
    </div>
    <PullDownRefresh
        onRefresh={onRefresh}
        isRefreshing={isPullDownRefreshing}
        setIsRefreshing={setIsPullDownRefreshing}
      >
        <ContentWrapper>
          <TradeAi />
        </ContentWrapper>
      </PullDownRefresh>
  </MobileInsightsWrapper>
}

import styled from 'styled-components'
import PullDownRefresh from 'components/PullDownRefresh'
import { useCallback, useState } from 'react'
import TradeAi from './components/TradeAi'
// import PullUpRefresh from 'components/PullUpRefresh'
// import { vm } from 'pages/helper'
const MobileTradeAiWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-bottom: 8px;
  flex-grow: 1;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
`

export default function MobileTradeAi() {
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false)
  const onRefresh = useCallback(() => {
    setIsPullDownRefreshing(true)
    window.location.reload()
  }, [])
  return <MobileTradeAiWrapper>
    <PullDownRefresh
      onRefresh={onRefresh}
      isRefreshing={isPullDownRefreshing}
      setIsRefreshing={setIsPullDownRefreshing}
      scrollContainerId="#aiContentInnerEl"
    >
      {/* <PullUpRefresh
        disabledPull={true}
        onRefresh={onRefresh}
        isRefreshing={false}
        setIsRefreshing={setIsPullDownRefreshing}
      >
      </PullUpRefresh> */}
        <ContentWrapper>
          <TradeAi />
        </ContentWrapper>
    </PullDownRefresh>
  </MobileTradeAiWrapper>
}

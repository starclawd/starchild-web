import styled from 'styled-components'
import PullDownRefresh from 'components/PullDownRefresh'
import { useCallback, useState } from 'react'
import TradeAi from './components/TradeAi'
import PullUpRefresh from 'components/PullUpRefresh'
const MobileTradeAiWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex-grow: 1;
`

const ContentWrapper = styled.div`
  height: 100vh;
  padding: 0 12px;
`

export default function MobileTradeAi() {
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false)
  const onRefresh = useCallback(() => {
    setIsPullDownRefreshing(true)
    setTimeout(() => {
      setIsPullDownRefreshing(false)
    }, 1000)
  }, [])
  return <MobileTradeAiWrapper>
    <PullDownRefresh
        onRefresh={onRefresh}
        isRefreshing={isPullDownRefreshing}
        setIsRefreshing={setIsPullDownRefreshing}
      >
        <PullUpRefresh
          disabledPull={true}
          onRefresh={onRefresh}
          isRefreshing={false}
          setIsRefreshing={setIsPullDownRefreshing}
        >
          <ContentWrapper>
            <TradeAi />
          </ContentWrapper>
        </PullUpRefresh>
      </PullDownRefresh>
  </MobileTradeAiWrapper>
}

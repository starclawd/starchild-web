import { Trans } from '@lingui/react/macro'
import styled from 'styled-components'
import PullDownRefresh from 'components/PullDownRefresh'
import { useCallback, useMemo, useState } from 'react'
import Ideas from 'pages/TradeAi/components/Ideas'
import TradeAi from './components/TradeAi'
import MobileTabs from 'components/MobileTabs'
import { MOBILE_TABS_TYPE } from 'store/application/application'

const MobileTradeAiWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex-grow: 1;
`

const TabsWrapper = styled.div`
  display: flex;
  margin: 0 0 14px;
  padding: 0 14px;
`

const ContentWrapper = styled.div`
  height: calc(100% - 52px);
  padding: 0 14px 14px;
  border-radius: 12px;
`

export default function MobileTradeAi() {
  const [tabType, setTabType] = useState(0)
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false)
  const onRefresh = useCallback(() => {
    setIsPullDownRefreshing(true)
    setTimeout(() => {
      setIsPullDownRefreshing(false)
    }, 1000)
  }, [])
  const changeTabType = useCallback((data: { value: number }) => {
    const value = data.value
    if (tabType === value) return
    setTabType(value)
  }, [tabType, setTabType])
  const tabList = useMemo(() => {
    return [
      {
        text: <Trans>Insights</Trans>,
        value: 0,
        clickCallback: changeTabType,
      },
      {
        text: <Trans>AI Agent</Trans>,
        value: 1,
        clickCallback: changeTabType,
      },
    ]
  }, [changeTabType])
  return <MobileTradeAiWrapper>
    <div>
      <Trans>Ai Agent</Trans>
    </div>
    <PullDownRefresh
        onRefresh={onRefresh}
        isRefreshing={isPullDownRefreshing}
        setIsRefreshing={setIsPullDownRefreshing}
      >
        <TabsWrapper>
          <MobileTabs
            value={tabType}
            type={MOBILE_TABS_TYPE.COMMON}
            tabList={tabList}
          />
        </TabsWrapper>
        <ContentWrapper>
          {tabType === 0 && <Ideas />}
          {tabType === 1 && <TradeAi />}
        </ContentWrapper>
      </PullDownRefresh>
  </MobileTradeAiWrapper>
}

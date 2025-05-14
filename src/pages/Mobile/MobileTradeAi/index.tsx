import styled from 'styled-components'
import PullDownRefresh from 'components/PullDownRefresh'
import { useCallback, useState } from 'react'
import TradeAi from './components/TradeAi'
import BottomSheet from 'components/BottomSheet'
import { useTheme } from 'store/themecache/hooks'
import { useIsShowDeepThink } from 'store/tradeai/hooks'
import TabList from 'pages/TradeAi/components/DeepThink/components/TabList'
import ThinkList from 'pages/TradeAi/components/DeepThink/components/ThinkList'
import Sources from 'pages/TradeAi/components/DeepThink/components/Sources'
import { vm } from 'pages/helper'
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

const DeepThinkContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${vm(20)};
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  padding: ${vm(12)} ${vm(20)} ${vm(20)};
  border-radius: ${vm(24)};
`

export default function MobileTradeAi() {
  const theme = useTheme()
  const [tabIndex, setTabIndex] = useState(0)
  const [isShowDeepThink, setIsShowDeepThink] = useIsShowDeepThink()
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false)
  const closeDeepThink = useCallback(() => {
    setIsShowDeepThink(false)
  }, [setIsShowDeepThink])
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
    <BottomSheet
      showFromBottom
      rootStyle={{
        bottom: '0 !important',
        height: '100%',
        backgroundColor: theme.bgL1
      }}
      isOpen={isShowDeepThink}
      onClose={closeDeepThink}
    >
      <DeepThinkContent>
        <TabList
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          thoughtListLength={0}
        />
        {tabIndex === 0 && <ThinkList thoughtList={[]} />}
        {tabIndex === 1 && <Sources sourceList={[]} />}
      </DeepThinkContent>
    </BottomSheet>
  </MobileTradeAiWrapper>
}

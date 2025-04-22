import styled from 'styled-components'
import Tabs, { TABS_TYPE } from 'components/Tabs'
import { useCallback, useMemo, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import Ideas from './components/InsightsList'
import FileDrag from 'pages/TradeAi/components/FileDrag'
import { TRADE_AI_TYPE } from 'store/tradeai/tradeai.d'

const InsightsWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
`

const RightContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: calc(100% - 460px);
  height: 100%;
  padding: 8px 8px 12px 8px;
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bg3};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  padding: 0 20px;
  height: 80px;
  font-size: 18px;
  font-weight: 800;
  line-height: 24px;
`

const TopContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  height: 80px;
  width: 100%;
  padding: 0 60px;
  .tabs-tab-item-insights {
    font-size: 18px;
    font-weight: 800;
    line-height: 24px;
  }
`

const BottomContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 80px);
  padding: 0 60px;
`

const TradeAiModal = styled.div`
  padding: 8px 8px 12px 0;
  width: 460px;
  .file-drag-wrapper {
    height: calc(100% - 80px);
  }
  .trade-ai-warpper {
    position: relative;
  }
`

export default function Insights() {
  const [tabTypeIndex, setTabTypeIndex] = useState(0)
  const changeTabIndex = useCallback((data: { value: number }) => {
    const index = data.value
    if (index === tabTypeIndex) return
    setTabTypeIndex(index)
  }, [tabTypeIndex, setTabTypeIndex])
  const tabList = useMemo(() => {
    return [
      {
        text: <Trans>All News</Trans>,
        value: 0,
        clickCallback: changeTabIndex,
      },
      // {
      //   text: <Trans>Following</Trans>,
      //   value: 1,
      //   clickCallback: changeTabIndex,
      // },
    ]
  }, [changeTabIndex])
  return <InsightsWrapper>
    <RightContent>
      <InnerContent>
        <TopContent>
          <Tabs
            classNameSuffix="insights"
            type={TABS_TYPE.FLAT_TAB}
            value={tabTypeIndex}
            tabList={tabList}
          />
        </TopContent>
        <BottomContent>
          <Ideas />
        </BottomContent>
      </InnerContent>
    </RightContent>
    <TradeAiModal>
      <InnerContent>
        <Header><Trans>AI Agent</Trans></Header>
        <FileDrag />
      </InnerContent>
    </TradeAiModal>
  </InsightsWrapper>
}

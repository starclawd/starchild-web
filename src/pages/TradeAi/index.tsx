import styled from 'styled-components'
import AiThreadsList from './components/AiThreadsList'
import FileDrag from './components/FileDrag'
import Tabs, { TABS_TYPE } from 'components/Tabs'
import { useCallback, useMemo, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import Insights from './components/Insights'
import { TRADE_AI_TYPE } from 'store/tradeai/tradeai.d'

const TradeAiWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-top: 1px solid ${({ theme }) => theme.line1};
`

const HeaderWrapper = styled.div`
  display: flex;
  height: 64px;
  width: 100%;
  padding: 8px 8px 0;
`

const HeaderContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bg3};
`

const AiContent = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 64px);
`

const RightContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: calc(100% - 316px);
  height: 100%;
  padding: 8px 8px 12px 0;
`

export default function TradeAi() {
  const [tabTypeIndex, setTabTypeIndex] = useState(0)
  const changeTabIndex = useCallback((data: { value: number }) => {
    const index = data.value
    if (index === tabTypeIndex) return
    setTabTypeIndex(index)
  }, [tabTypeIndex, setTabTypeIndex])
  const tabList = useMemo(() => {
    return [
      {
        text: <Trans>Insights</Trans>,
        value: 0,
        clickCallback: changeTabIndex,
      },
      {
        text: <Trans>AI Agent</Trans>,
        value: 1,
        clickCallback: changeTabIndex,
      },
    ]
  }, [changeTabIndex])
  return <TradeAiWrapper>
    <HeaderWrapper>
      <HeaderContent>
        <Tabs
          classNameSuffix="trade-ai"
          type={TABS_TYPE.BG_TAB}
          value={tabTypeIndex}
          tabList={tabList}
        />
      </HeaderContent>
    </HeaderWrapper>
    <AiContent>
      {
        tabTypeIndex === 0
          ? <Insights />
          : <>
            <AiThreadsList />
            <RightContent>
              <FileDrag tradeAiTypeProp={TRADE_AI_TYPE.PAGE_TYPE} />
            </RightContent>
          </>
      }
    </AiContent>
  </TradeAiWrapper>
}

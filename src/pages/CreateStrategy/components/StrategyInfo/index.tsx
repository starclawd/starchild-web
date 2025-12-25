import styled from 'styled-components'
import Header from './components/Header'
import { useStrategyTabIndex } from 'store/createstrategycache/hooks'
import Summary from './components/Summary'
import Code from './components/Code'
import PaperTrading from './components/PaperTrading'
import { memo, useEffect } from 'react'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import useParsedQueryString from 'hooks/useParsedQueryString'
import Restart from './components/Restart'
import { useDeployment } from 'store/createstrategy/hooks/useDeployment'
import { useUserInfo } from 'store/login/hooks'
import { useIsStartingPaperTrading } from 'store/createstrategy/hooks/usePaperTrading'
import { STRATEGY_TAB_INDEX } from 'store/createstrategy/createstrategy'

const StrategyInfoWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 100%;
  padding: 8px 8px 0;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 56px);
`

const TabContent = styled.div<{ $isActive: boolean }>`
  display: ${({ $isActive }) => ($isActive ? 'flex' : 'none')};
  flex-direction: column;
  width: 100%;
  height: 100%;
`

export default memo(function StrategyInfo() {
  const [{ userInfoId }] = useUserInfo()
  const { strategyId } = useParsedQueryString()
  const { checkDeployStatus } = useDeployment(strategyId || '')
  const [strategyInfoTabIndex] = useStrategyTabIndex(strategyId || undefined)
  const { strategyDetail, refetch } = useStrategyDetail({ strategyId: strategyId || '' })
  const { strategy_config } = strategyDetail || { name: '', description: '', strategy_config: null }
  const [isStartingPaperTrading] = useIsStartingPaperTrading()

  // 当 strategyId 存在但 strategy_config 不存在时，每5秒轮询一次
  useEffect(() => {
    if (!strategyId || strategy_config) return

    const intervalId = setInterval(() => {
      refetch()
    }, 5000)

    return () => clearInterval(intervalId)
  }, [strategyId, strategy_config, refetch])

  useEffect(() => {
    if (strategyId && userInfoId) {
      checkDeployStatus(strategyId)
    }
  }, [userInfoId, strategyId, checkDeployStatus])

  return (
    <StrategyInfoWrapper>
      <Header />
      <ContentWrapper>
        <TabContent $isActive={strategyInfoTabIndex === STRATEGY_TAB_INDEX.CREATE}>
          <Summary />
        </TabContent>
        <TabContent $isActive={strategyInfoTabIndex === STRATEGY_TAB_INDEX.CODE}>
          <Code />
        </TabContent>
        <TabContent $isActive={strategyInfoTabIndex === STRATEGY_TAB_INDEX.PAPER_TRADING}>
          <PaperTrading />
        </TabContent>
      </ContentWrapper>
      <Restart isLoading={isStartingPaperTrading && strategyInfoTabIndex === STRATEGY_TAB_INDEX.PAPER_TRADING} />
    </StrategyInfoWrapper>
  )
})

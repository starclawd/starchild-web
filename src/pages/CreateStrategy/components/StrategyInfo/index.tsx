import styled, { css } from 'styled-components'
import Header from './components/Header'
import { useStrategyInfoTabIndex } from 'store/createstrategy/hooks/useTabIndex'
import Summary from './components/Summary'
import Code from './components/Code'
import Backtest from './components/Backtest'
import PaperTrading from './components/PaperTrading'
import { memo, useEffect } from 'react'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import useParsedQueryString from 'hooks/useParsedQueryString'
import Restart from './components/Restart'
import { useIsShowRestart } from 'store/createstrategy/hooks/useRestart'
import { useDeployment } from 'store/createstrategy/hooks/useDeployment'
import { useUserInfo } from 'store/login/hooks'

const StrategyInfoWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: 100%;
  padding: 12px 20px 0;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 64px);
`

const Placeholder = styled.div`
  height: 84px;
  flex-shrink: 0;
`

export default memo(function StrategyInfo() {
  const [{ userInfoId }] = useUserInfo()
  const { checkDeployStatus } = useDeployment()
  const { strategyId } = useParsedQueryString()
  const [strategyInfoTabIndex] = useStrategyInfoTabIndex()
  const { strategyDetail, refetch } = useStrategyDetail({ strategyId: strategyId || '' })
  const { strategy_config } = strategyDetail || { name: '', description: '', strategy_config: null }
  const isShowRestart = useIsShowRestart()

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
      <ContentWrapper className={strategyInfoTabIndex === 3 ? '' : 'scroll-style'}>
        {strategyInfoTabIndex === 0 && <Summary />}
        {strategyInfoTabIndex === 1 && <Code />}
        {strategyInfoTabIndex === 2 && <Backtest />}
        {strategyInfoTabIndex === 3 && <PaperTrading />}
        {isShowRestart && <Placeholder />}
      </ContentWrapper>
      <Restart />
    </StrategyInfoWrapper>
  )
})

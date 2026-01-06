import styled, { css } from 'styled-components'
import TabList from './components/TabList'
import Summary from './components/Summary'
import Code from './components/Code'
import PaperTrading from './components/PaperTrading'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import {
  useCurrentStrategyTabIndex,
  useIsShowActionLayer,
  useStrategyDetail,
} from 'store/createstrategy/hooks/useStrategyDetail'
import useParsedQueryString from 'hooks/useParsedQueryString'
// import Restart from './components/Restart'
import { useDeployment } from 'store/createstrategy/hooks/useDeployment'
import { useUserInfo } from 'store/login/hooks'
import { GENERATION_STATUS, STRATEGY_STATUS, STRATEGY_TAB_INDEX } from 'store/createstrategy/createstrategy'
import StrategyName from './components/StrategyName'
import ActionLayer from './components/ActionLayer'
import { Trans } from '@lingui/react/macro'
import { useHandleGenerateCode, useIsGeneratingCode, useStrategyCode } from 'store/createstrategy/hooks/useCode'
import {
  useHandleStartPaperTrading,
  useIsStartingPaperTrading,
  usePaperTrading,
  useIsShowExpandPaperTrading,
} from 'store/createstrategy/hooks/usePaperTrading'
import { ANI_DURATION } from 'constants/index'
import { useDeployModalToggle } from 'store/application/hooks'
import PixelCanvas from 'pages/Chat/components/PixelCanvas'

const StrategyInfoWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const TopContent = styled.div<{ $isShowExpandPaperTrading: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
  height: 224px;
  transition: all ${ANI_DURATION}s;
  ${({ $isShowExpandPaperTrading }) =>
    $isShowExpandPaperTrading &&
    css`
      height: 0;
      overflow: hidden;
    `}
`

const InnerContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
  height: 224px;
  padding: 40px;
  z-index: 2;
`

const BottomContent = styled.div<{ $isShowExpandPaperTrading: boolean }>`
  display: flex;
  width: 100%;
  height: calc(100% - 224px);
  border-top: 1px solid ${({ theme }) => theme.black800};
  ${({ $isShowExpandPaperTrading }) =>
    $isShowExpandPaperTrading &&
    css`
      height: 100%;
      border-top: none;
    `}
`

const ContentWrapper = styled.div<{ $isShowActionLayer: boolean; $isShowExpandPaperTrading: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 70%;
  height: 100%;
  border-left: 1px solid ${({ theme }) => theme.black800};
  ${({ $isShowActionLayer }) =>
    $isShowActionLayer &&
    css`
      padding-bottom: 80px;
    `}
  ${({ $isShowExpandPaperTrading }) =>
    $isShowExpandPaperTrading &&
    css`
      width: 100%;
      border-left: none;
    `}
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
  const toggleDeployModal = useDeployModalToggle()
  const handleGenerateCode = useHandleGenerateCode()
  const handleStartPaperTrading = useHandleStartPaperTrading()
  const [currentStrategyTabIndex] = useCurrentStrategyTabIndex()
  const [isShowExpandPaperTrading] = useIsShowExpandPaperTrading()
  const [isGeneratingCode] = useIsGeneratingCode()
  const [isStartingPaperTrading] = useIsStartingPaperTrading()
  const { strategyDetail, refetch } = useStrategyDetail({ strategyId: strategyId || '' })
  const { strategy_config, name, description } = strategyDetail || { strategy_config: null, name: '', description: '' }
  const { isShowGenerateCodeOperation, isShowPaperTradingOperation, isShowLaunchOperation, isShowActionLayer } =
    useIsShowActionLayer()

  const handleDeployClick = useCallback(() => {
    toggleDeployModal(strategyId)
  }, [strategyId, toggleDeployModal])

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
      <TopContent $isShowExpandPaperTrading={isShowExpandPaperTrading}>
        <InnerContent>
          <StrategyName nameProp={name} descriptionProp={description} />
        </InnerContent>
        <PixelCanvas />
      </TopContent>
      <BottomContent $isShowExpandPaperTrading={isShowExpandPaperTrading}>
        <TabList />
        <ContentWrapper $isShowActionLayer={isShowActionLayer} $isShowExpandPaperTrading={isShowExpandPaperTrading}>
          <TabContent $isActive={currentStrategyTabIndex === STRATEGY_TAB_INDEX.CREATE}>
            <Summary />
          </TabContent>
          <TabContent $isActive={currentStrategyTabIndex === STRATEGY_TAB_INDEX.CODE}>
            <Code />
          </TabContent>
          <TabContent $isActive={currentStrategyTabIndex === STRATEGY_TAB_INDEX.PAPER_TRADING}>
            <PaperTrading />
          </TabContent>
          {isShowGenerateCodeOperation && (
            <ActionLayer
              isLoading={isGeneratingCode}
              iconCls='icon-generate-code'
              title={<Trans>Generate Code</Trans>}
              description={
                <Trans>Once generated, you can Simulation with virtual funds or deploy with real funds.</Trans>
              }
              clickCallback={handleGenerateCode}
            />
          )}
          {isShowPaperTradingOperation && (
            <ActionLayer
              isLoading={isStartingPaperTrading}
              iconCls='icon-paper-trading'
              title={<Trans>Run Paper Trading</Trans>}
              description={<Trans>Simulation in real-time with virtual funds.</Trans>}
              clickCallback={handleStartPaperTrading}
            />
          )}
          {isShowLaunchOperation && (
            <ActionLayer
              rightText={<Trans>Launch</Trans>}
              iconCls='icon-launch'
              title={<Trans>Launch</Trans>}
              description={<Trans>Deploy a live strategy and earn performance fees via a mirror vault.</Trans>}
              clickCallback={handleDeployClick}
            />
          )}
        </ContentWrapper>
      </BottomContent>
    </StrategyInfoWrapper>
  )
})

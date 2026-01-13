import styled, { css } from 'styled-components'
import TabList from './components/TabList'
import Summary from './components/Summary'
import Code from './components/Code'
import PaperTrading from './components/PaperTrading'
import { memo, useCallback, useEffect } from 'react'
import {
  useCurrentStrategyTabIndex,
  useIsShowActionLayer,
  useStrategyDetail,
} from 'store/createstrategy/hooks/useStrategyDetail'
import useParsedQueryString from 'hooks/useParsedQueryString'
// import Restart from './components/Restart'
import { useDeployment } from 'store/createstrategy/hooks/useDeployment'
import { useIsLogin, useUserInfo } from 'store/login/hooks'
import { STRATEGY_TAB_INDEX } from 'store/createstrategy/createstrategy'
import StrategyName from './components/StrategyName'
import ActionLayer from './components/ActionLayer'
import { Trans } from '@lingui/react/macro'
import { useHandleGenerateCode, useIsGeneratingCode, useIsShowExpandCode } from 'store/createstrategy/hooks/useCode'
import {
  useHandleStartPaperTrading,
  useIsStartingPaperTrading,
  useIsShowExpandPaperTrading,
} from 'store/createstrategy/hooks/usePaperTrading'
import { ANI_DURATION } from 'constants/index'
import { useDeployModalToggle, useSetCurrentRouter } from 'store/application/hooks'
import PixelCanvas from 'pages/Chat/components/PixelCanvas'
import { ROUTER } from 'pages/router'

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
  height: 260px;
  transition: all ${ANI_DURATION}s;
  ${({ theme }) => theme.mediaMaxWidth.width1560`
    height: 196px;
  `}
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
  height: 260px;
  padding: 40px;
  z-index: 2;
  transition: all ${ANI_DURATION}s;
  ${({ theme }) => theme.mediaMaxWidth.width1560`
    height: 196px;
    padding: 20px;
  `}
`

const BottomContent = styled.div<{ $isShowExpandPaperTrading: boolean }>`
  display: flex;
  width: 100%;
  height: calc(100% - 260px);
  border-top: 1px solid ${({ theme }) => theme.black800};
  ${({ theme }) => theme.mediaMaxWidth.width1560`
    height: calc(100% - 196px);
  `}
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
  flex-grow: 1;
  min-width: 0;
  height: 100%;
  border-left: 1px solid ${({ theme }) => theme.black800};
  ${({ $isShowActionLayer }) =>
    $isShowActionLayer &&
    css`
      padding-bottom: 108px;
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
  const isLogin = useIsLogin()
  const [{ userInfoId }] = useUserInfo()
  const { strategyId } = useParsedQueryString()
  const { checkDeployStatus } = useDeployment(strategyId || '')
  const toggleDeployModal = useDeployModalToggle()
  const handleGenerateCode = useHandleGenerateCode()
  const handleStartPaperTrading = useHandleStartPaperTrading()
  const setCurrentRouter = useSetCurrentRouter()
  const [currentStrategyTabIndex] = useCurrentStrategyTabIndex()
  const [isShowExpandPaperTrading] = useIsShowExpandPaperTrading()
  const [isShowExpandCode] = useIsShowExpandCode()
  const [isGeneratingCode] = useIsGeneratingCode()
  // 合并展开状态：PaperTrading 或 Code 任一展开时都隐藏顶部内容
  const isShowExpand = isShowExpandPaperTrading || isShowExpandCode
  const [isStartingPaperTrading] = useIsStartingPaperTrading()
  const { strategyDetail, refetch } = useStrategyDetail({ strategyId: strategyId || '' })
  const { strategy_config, name, description } = strategyDetail || { strategy_config: null, name: '', description: '' }
  const { isShowGenerateCodeOperation, isShowPaperTradingOperation, isShowLaunchOperation, isShowActionLayer } =
    useIsShowActionLayer()

  const handleDeployClick = useCallback(() => {
    toggleDeployModal(strategyId)
  }, [strategyId, toggleDeployModal])

  const goDetailPage = useCallback(() => {
    setCurrentRouter(`${ROUTER.VAULT_DETAIL}?strategyId=${strategyId}`)
  }, [strategyId, setCurrentRouter])

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
      <TopContent $isShowExpandPaperTrading={isShowExpand}>
        <InnerContent>
          <StrategyName nameProp={name} descriptionProp={description} />
        </InnerContent>
        <PixelCanvas />
      </TopContent>
      <BottomContent $isShowExpandPaperTrading={isShowExpand}>
        <TabList />
        <ContentWrapper $isShowActionLayer={isShowActionLayer} $isShowExpandPaperTrading={isShowExpand}>
          <TabContent $isActive={currentStrategyTabIndex === STRATEGY_TAB_INDEX.CREATE}>
            <Summary />
          </TabContent>
          <TabContent $isActive={currentStrategyTabIndex === STRATEGY_TAB_INDEX.CODE}>
            <Code />
          </TabContent>
          <TabContent $isActive={currentStrategyTabIndex === STRATEGY_TAB_INDEX.PAPER_TRADING}>
            <PaperTrading />
          </TabContent>
          {isShowGenerateCodeOperation && isLogin && (
            <ActionLayer
              isLoading={isGeneratingCode}
              iconCls='icon-generate-code'
              title={<Trans>Generate Code</Trans>}
              description={
                <Trans>Once generated, you can Simulation with virtual funds or deploy with real funds.</Trans>
              }
              clickCallback={() => handleGenerateCode(1)}
            />
          )}
          {isShowPaperTradingOperation && isLogin && (
            <ActionLayer
              isLoading={isStartingPaperTrading}
              iconCls='icon-paper-trading'
              title={<Trans>Run Paper Trading</Trans>}
              description={<Trans>Simulation in real-time with virtual funds.</Trans>}
              clickCallback={handleStartPaperTrading}
            />
          )}
          {isShowLaunchOperation && isLogin && (
            <ActionLayer
              rightText={<Trans>View</Trans>}
              iconCls='icon-launch'
              title={<Trans>View Details</Trans>}
              description={<Trans>Your strategy is public and will be displayed on the leaderboard.</Trans>}
              clickCallback={goDetailPage}
            />
          )}
        </ContentWrapper>
      </BottomContent>
    </StrategyInfoWrapper>
  )
})

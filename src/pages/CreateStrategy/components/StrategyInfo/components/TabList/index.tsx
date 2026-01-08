import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import styled, { css } from 'styled-components'
import { useCurrentStrategyTabIndex } from 'store/createstrategy/hooks/useStrategyDetail'
import { Trans } from '@lingui/react/macro'
import { useDeployModalToggle } from 'store/application/hooks'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useIsGeneratingCode, useStrategyCode } from 'store/createstrategy/hooks/useCode'
import { GENERATION_STATUS, STRATEGY_STATUS, STRATEGY_TAB_INDEX } from 'store/createstrategy/createstrategy'
import { useIsCreateStrategy, useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import { IconBase } from 'components/Icons'
import { useIsPausingPaperTrading, useIsStartingPaperTrading } from 'store/createstrategy/hooks/usePaperTrading'
import { useIsShowExpandPaperTrading } from 'store/createstrategy/hooks/usePaperTrading'
import { ANI_DURATION } from 'constants/index'
import TabItem from './components/TabItem'
import { usePaperTradingPublic } from 'store/vaultsdetail/hooks/usePaperTradingPublic'

const TabListWrapper = styled.div<{ $isShowExpandPaperTrading: boolean }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 30%;
  min-width: 300px;
  max-width: 480px;
  transition: width ${ANI_DURATION}s;
  ${({ $isShowExpandPaperTrading }) =>
    $isShowExpandPaperTrading &&
    css`
      width: 0;
      min-width: 0;
      overflow: hidden;
    `}
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
`

export default memo(function TabList() {
  const [isShowExpandPaperTrading] = useIsShowExpandPaperTrading()
  const { strategyId } = useParsedQueryString()
  // 用于锁定自动切换 tab 的 ref，一旦任意操作状态变为 true 就锁定
  const isAutoSwitchLockedRef = useRef(false)
  const toggleDeployModal = useDeployModalToggle()
  const [isCreateStrategyFrontend] = useIsCreateStrategy()
  const [isGeneratingCodeFrontend] = useIsGeneratingCode()
  const [isStartingPaperTradingFrontend] = useIsStartingPaperTrading()
  const [isPausingPaperTradingFrontend] = useIsPausingPaperTrading()
  const [, setCurrentStrategyTabIndex] = useCurrentStrategyTabIndex()
  const { strategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })
  const { strategyCode } = useStrategyCode({ strategyId: strategyId || '' })
  const codeGenerated = strategyCode?.generation_status === GENERATION_STATUS.COMPLETED
  const isGeneratingCode = strategyCode?.generation_status === GENERATION_STATUS.GENERATING
  const { strategy_config, status } = strategyDetail || { strategy_config: null, status: STRATEGY_STATUS.DRAFT }
  const { paperTradingPublicData } = usePaperTradingPublic({
    strategyId: strategyId || '',
  })

  const handleTabClick = useCallback(
    (index: STRATEGY_TAB_INDEX) => {
      return () => {
        setCurrentStrategyTabIndex(index)
      }
    },
    [setCurrentStrategyTabIndex],
  )
  const handleDeployClick = useCallback(() => {
    if (!paperTradingPublicData || !strategyId) return
    toggleDeployModal(strategyId)
  }, [paperTradingPublicData, toggleDeployModal, strategyId])
  const tabList = useMemo(() => {
    return [
      {
        step: 1,
        key: STRATEGY_TAB_INDEX.CREATE,
        text: <Trans>Create strategy</Trans>,
        icon: <IconBase className='icon-create-strategy' />,
        isComplete: !!strategy_config,
        disabled: false,
        tooltipContent: '',
        description: <Trans>Define your strategy logic.</Trans>,
        intervalDuration: 5000,
        showTooltip: false,
        isLoading: isCreateStrategyFrontend,
        clickCallback: handleTabClick(STRATEGY_TAB_INDEX.CREATE),
      },
      {
        step: 2,
        key: STRATEGY_TAB_INDEX.CODE,
        text: <Trans>Generate Code</Trans>,
        icon: <IconBase className='icon-generate-code' />,
        isComplete: codeGenerated,
        disabled: !codeGenerated && !isGeneratingCode && !isGeneratingCodeFrontend,
        tooltipContent: <Trans>Finish defining your strategy in Step 1 first.</Trans>,
        description: <Trans>Turns your text description into code.</Trans>,
        showTooltip: !codeGenerated && !isGeneratingCode && !isGeneratingCodeFrontend,
        intervalDuration: 30000,
        isLoading: isGeneratingCodeFrontend || isGeneratingCode,
        clickCallback: handleTabClick(STRATEGY_TAB_INDEX.CODE),
      },
      {
        step: 3,
        key: STRATEGY_TAB_INDEX.PAPER_TRADING,
        text: <Trans>Paper trading</Trans>,
        icon: <IconBase className='icon-paper-trading' />,
        isComplete: !!paperTradingPublicData,
        disabled: !paperTradingPublicData && !isStartingPaperTradingFrontend,
        tooltipContent: <Trans>Please generate valid code (Step 2) before starting Paper Trading.</Trans>,
        description: <Trans>Start the simulator to see how it performs.</Trans>,
        showTooltip: !paperTradingPublicData && !isStartingPaperTradingFrontend,
        intervalDuration: 5000,
        isLoading: isStartingPaperTradingFrontend,
        clickCallback: handleTabClick(STRATEGY_TAB_INDEX.PAPER_TRADING),
      },
      {
        step: 4,
        key: STRATEGY_TAB_INDEX.LAUNCH,
        text: <Trans>Launch</Trans>,
        icon: <IconBase className='icon-launch' />,
        isComplete: status === STRATEGY_STATUS.DEPLOYED,
        disabled: !paperTradingPublicData,
        tooltipContent: <Trans>Comming soon</Trans>,
        showTooltip: true,
        description: '',
        intervalDuration: 0,
        isLoading: false,
        clickCallback: handleDeployClick,
      },
    ]
  }, [
    strategy_config,
    codeGenerated,
    paperTradingPublicData,
    status,
    handleDeployClick,
    handleTabClick,
    isGeneratingCode,
    isStartingPaperTradingFrontend,
    isCreateStrategyFrontend,
    isGeneratingCodeFrontend,
  ])

  // 切换 strategyId 时重置锁定状态
  useEffect(() => {
    isAutoSwitchLockedRef.current = false
  }, [strategyId])

  // 任意操作状态变为 true 时锁定自动切换
  useEffect(() => {
    if (
      isCreateStrategyFrontend ||
      isGeneratingCodeFrontend ||
      isStartingPaperTradingFrontend ||
      isPausingPaperTradingFrontend
    ) {
      isAutoSwitchLockedRef.current = true
    }
  }, [
    isCreateStrategyFrontend,
    isGeneratingCodeFrontend,
    isStartingPaperTradingFrontend,
    isPausingPaperTradingFrontend,
  ])

  // 初始化或切换策略时，自动切换到最后一个已完成的 tab
  useEffect(() => {
    // 已锁定时不执行自动切换
    if (isAutoSwitchLockedRef.current) return

    // 数据未加载完成时不执行
    if (!strategyDetail) return

    // 找到最后一个 isComplete 为 true 的 tab
    let lastCompletedIndex = STRATEGY_TAB_INDEX.CREATE
    if (strategy_config) {
      lastCompletedIndex = STRATEGY_TAB_INDEX.CREATE
    }
    if (codeGenerated) {
      lastCompletedIndex = STRATEGY_TAB_INDEX.CODE
    }
    if (paperTradingPublicData) {
      lastCompletedIndex = STRATEGY_TAB_INDEX.PAPER_TRADING
    }
    setCurrentStrategyTabIndex(lastCompletedIndex)
  }, [strategyId, strategyDetail, codeGenerated, paperTradingPublicData, strategy_config, setCurrentStrategyTabIndex])

  return (
    <TabListWrapper $isShowExpandPaperTrading={isShowExpandPaperTrading}>
      <InnerContent>
        {tabList.map((tab) => (
          <TabItem key={tab.key} tab={tab} />
        ))}
      </InnerContent>
      {/* <Tooltip content={!codeGenerated ? <Trans>Code not compiled. Please Generate Code first.</Trans> : ''}>
        {strategyDetail && strategyDetail?.status === STRATEGY_STATUS.DEPLOYED ? (
          <ButtonCommon className='view-vault-button' onClick={handleViewVaultClick}>
            <Trans>View vault</Trans>
            <IconBase className='icon-chat-back' />
          </ButtonCommon>
        ) : (
          <ShinyButton className='launch-button' onClick={handleDeployClick}>
            <Trans>Launch</Trans>
          </ShinyButton>
        )}
      </Tooltip> */}
    </TabListWrapper>
  )
})

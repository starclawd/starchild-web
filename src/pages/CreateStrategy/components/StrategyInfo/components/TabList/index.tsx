import { memo, useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { useStrategyTabIndex } from 'store/createstrategycache/hooks'
import { Trans } from '@lingui/react/macro'
import { useTheme } from 'store/themecache/hooks'
import { useDeployModalToggle } from 'store/application/hooks'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useStrategyCode } from 'store/createstrategy/hooks/useCode'
import { GENERATION_STATUS, STRATEGY_STATUS, STRATEGY_TAB_INDEX } from 'store/createstrategy/createstrategy'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import { IconBase } from 'components/Icons'
import Loading from '../Loading'
import { usePaperTrading } from 'store/createstrategy/hooks/usePaperTrading'
import { ANI_DURATION } from 'constants/index'

const TabListWrapper = styled.div<{ $isShowExpandPaperTrading: boolean }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 520px;
  transition: width ${ANI_DURATION}s;
  ${({ $isShowExpandPaperTrading }) =>
    $isShowExpandPaperTrading &&
    css`
      width: 0;
      overflow: hidden;
    `}
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 520px;
`

const TabItem = styled.div<{ $isActive: boolean; $disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  padding: 0 40px;
  border-top: 1px solid ${({ theme }) => theme.black800};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  span {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
    color: ${({ theme }) => theme.textL3};
    i {
      font-size: 24px;
      color: ${({ theme }) => theme.textL3};
    }
  }
  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      background-color: ${theme.white};
      span {
        color: ${theme.black1000};
        i {
          color: ${theme.black1000};
        }
      }
    `}
`

export default memo(function TabList({ isShowExpandPaperTrading }: { isShowExpandPaperTrading: boolean }) {
  const theme = useTheme()
  const { strategyId } = useParsedQueryString()
  const toggleDeployModal = useDeployModalToggle()
  const [strategyInfoTabIndex, setStrategyInfoTabIndex] = useStrategyTabIndex(strategyId || undefined)
  const { strategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })
  const { strategyCode } = useStrategyCode({ strategyId: strategyId || '' })
  const codeGenerated = strategyCode?.generation_status === GENERATION_STATUS.COMPLETED
  const { strategy_config, status } = strategyDetail || { strategy_config: null, status: STRATEGY_STATUS.DRAFT }
  const { paperTradingCurrentData } = usePaperTrading({
    strategyId: strategyId || '',
  })

  const handleTabClick = useCallback(
    (index: STRATEGY_TAB_INDEX) => {
      return () => {
        setStrategyInfoTabIndex(index)
      }
    },
    [setStrategyInfoTabIndex],
  )

  const handleDeployClick = useCallback(() => {
    if (!paperTradingCurrentData || !strategyId) return
    toggleDeployModal(strategyId)
  }, [paperTradingCurrentData, toggleDeployModal, strategyId])
  const tabList = useMemo(() => {
    return [
      {
        step: 1,
        key: STRATEGY_TAB_INDEX.CREATE,
        text: <Trans>Create strategy</Trans>,
        icon: <IconBase className='icon-create-strategy' />,
        isComplete: !!strategy_config,
        disabled: !strategy_config,
        clickCallback: handleTabClick(STRATEGY_TAB_INDEX.CREATE),
      },
      {
        step: 2,
        key: STRATEGY_TAB_INDEX.CODE,
        text: <Trans>Generate Code</Trans>,
        icon: <IconBase className='icon-generate-code' />,
        isComplete: codeGenerated,
        disabled: !codeGenerated,
        clickCallback: handleTabClick(STRATEGY_TAB_INDEX.CODE),
      },
      {
        step: 3,
        key: STRATEGY_TAB_INDEX.PAPER_TRADING,
        text: <Trans>Paper trading</Trans>,
        icon: <IconBase className='icon-paper-trading' />,
        isComplete: !!paperTradingCurrentData,
        disabled: !paperTradingCurrentData,
        clickCallback: handleTabClick(STRATEGY_TAB_INDEX.PAPER_TRADING),
      },
      {
        step: 4,
        key: STRATEGY_TAB_INDEX.LAUNCH,
        text: <Trans>Launch</Trans>,
        icon: <IconBase className='icon-launch' />,
        isComplete: status === STRATEGY_STATUS.DEPLOYED,
        disabled: !paperTradingCurrentData,
        clickCallback: handleDeployClick,
      },
    ]
  }, [strategy_config, codeGenerated, paperTradingCurrentData, status, handleDeployClick, handleTabClick])

  return (
    <TabListWrapper $isShowExpandPaperTrading={isShowExpandPaperTrading}>
      <InnerContent>
        {tabList.map((tab) => {
          const { key, text, icon, isComplete, disabled, step, clickCallback } = tab
          const isActive = strategyInfoTabIndex === key
          return (
            <TabItem
              $disabled={disabled}
              onClick={!disabled ? clickCallback : undefined}
              key={key}
              $isActive={isActive}
            >
              <span>
                {icon}
                {text}
              </span>
              <Loading
                step={step}
                isActive={isActive}
                isComplete={isComplete}
                fillColor={theme.brand100}
                trackColor={isActive ? 'rgba(0, 0, 0, 0.12)' : theme.bgT30}
              />
            </TabItem>
          )
        })}
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

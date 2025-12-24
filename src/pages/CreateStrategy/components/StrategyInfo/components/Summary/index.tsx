import styled from 'styled-components'
import StrategyInfo from './components/StrategyInfo'
import { Trans } from '@lingui/react/macro'
import ActionLayer from '../ActionLayer'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useStrategyInfoTabIndex } from 'store/createstrategy/hooks/useTabIndex'
import { IconBase } from 'components/Icons'
import InfoLayer from './components/InfoLayer'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import EditStrategyInfoModal from './components/EditStrategyInfoModal'
import { useModalOpen } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import { useIsLoadingChatStream } from 'store/createstrategy/hooks/useLoadingState'
import Pending from 'components/Pending'
import { useSendChatUserContent } from 'store/createstrategy/hooks/useStream'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useIsStep3Deploying } from 'store/createstrategy/hooks/useDeployment'
import { STRATEGY_TAB_INDEX } from 'store/createstrategy/createstrategy'

const SummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-right: 8px !important;
`

const CompleteContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`

const CompleteInfo = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
`

const ActionList = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
  .action-layer-wrapper {
    width: 100%;
  }
`

const LayerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.black900};
`

const LayerTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const LayerTitleLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.textL2};
  i {
    font-size: 24px;
    color: ${({ theme }) => theme.textL2};
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ButtonEdit = styled(ButtonBorder)`
  width: fit-content;
  gap: 4px;
  height: 28px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  padding: 0 12px;
  color: ${({ theme }) => theme.textL3};
  .icon-edit {
    font-size: 14px;
    color: ${({ theme }) => theme.textL3};
  }
`

const ButtonCancel = styled(ButtonEdit)``

const ButtonConfirm = styled(ButtonCommon)`
  width: fit-content;
  gap: 4px;
  height: 28px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  padding: 0 12px;
`
const LayerList = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  flex-wrap: wrap;
  .info-layer-wrapper {
    width: calc((100% - 16px) / 3);
  }
`

export default memo(function Summary() {
  const { strategyId } = useParsedQueryString()
  const isStep3Deploying = useIsStep3Deploying(strategyId || '')
  const { strategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })
  const [isEdit, setIsEdit] = useState(false)
  const [isLoadingChatStream] = useIsLoadingChatStream()
  const sendChatUserContent = useSendChatUserContent()
  const [, setStrategyInfoTabIndex] = useStrategyInfoTabIndex()
  const [dataLayerContent, setDataLayerContent] = useState<string>('')
  const [signalLayerContent, setSignalLayerContent] = useState<string>('')
  const [capitalLayerContent, setCapitalLayerContent] = useState<string>('')
  const [riskLayerContent, setRiskLayerContent] = useState<string>('')
  const [executionLayerContent, setExecutionLayerContent] = useState<string>('')
  const editStrategyInfoModalOpen = useModalOpen(ApplicationModal.EDIT_STRATEGY_INFO_MODAL)
  const { name, description, strategy_config } = strategyDetail || {
    name: '',
    description: '',
  }
  const [dataLayerString, riskLayerString, signalLayerString, capitalLayerString, executionLayerString] =
    useMemo(() => {
      const strategyConfig = strategy_config || {
        data_layer: {},
        risk_layer: {},
        signal_layer: {},
        capital_layer: {},
        execution_layer: {},
      }
      return [
        JSON.stringify(strategyConfig.data_layer),
        JSON.stringify(strategyConfig.risk_layer),
        JSON.stringify(strategyConfig.signal_layer),
        JSON.stringify(strategyConfig.capital_layer),
        JSON.stringify(strategyConfig.execution_layer),
      ]
    }, [strategy_config])
  const LAYER_CONFIG = useMemo(() => {
    if (!strategy_config) {
      return [
        {
          key: 'data',
          iconCls: 'icon-summary',
          titleKey: <Trans>Data Layer</Trans>,
          content: '',
          updateContent: setDataLayerContent,
          isLoading: true,
        },
      ]
    }
    return [
      {
        key: 'data',
        iconCls: 'icon-summary',
        titleKey: <Trans>Data Layer</Trans>,
        content: dataLayerContent,
        updateContent: setDataLayerContent,
        isLoading: !dataLayerContent,
      },
      {
        key: 'signal',
        iconCls: 'icon-signal-layer',
        titleKey: <Trans>Signal Layer</Trans>,
        content: signalLayerContent,
        updateContent: setSignalLayerContent,
        isLoading: !signalLayerContent,
      },
      {
        key: 'capital',
        iconCls: 'icon-stake',
        titleKey: <Trans>Capital Layer</Trans>,
        content: capitalLayerContent,
        updateContent: setCapitalLayerContent,
        isLoading: !capitalLayerContent,
      },
      {
        key: 'risk',
        iconCls: 'icon-shield',
        titleKey: <Trans>Risk Layer</Trans>,
        content: riskLayerContent,
        updateContent: setRiskLayerContent,
        isLoading: !riskLayerContent,
      },
      {
        key: 'execution',
        iconCls: 'icon-execution-layer',
        titleKey: <Trans>Execution layer</Trans>,
        content: executionLayerContent,
        updateContent: setExecutionLayerContent,
        isLoading: !executionLayerContent,
      },
    ]
  }, [
    strategy_config,
    dataLayerContent,
    signalLayerContent,
    capitalLayerContent,
    riskLayerContent,
    executionLayerContent,
  ])
  const goCodeTab = useCallback(() => {
    setStrategyInfoTabIndex(STRATEGY_TAB_INDEX.CODE)
  }, [setStrategyInfoTabIndex])
  const goBacktestTab = useCallback(() => {
    setStrategyInfoTabIndex(STRATEGY_TAB_INDEX.BACKTEST)
  }, [setStrategyInfoTabIndex])
  const updateLayerContent = useCallback(() => {
    setDataLayerContent(dataLayerString)
    setSignalLayerContent(signalLayerString)
    setCapitalLayerContent(capitalLayerString)
    setRiskLayerContent(riskLayerString)
    setExecutionLayerContent(executionLayerString)
  }, [dataLayerString, signalLayerString, capitalLayerString, riskLayerString, executionLayerString])
  const openEdit = useCallback(() => {
    if (isStep3Deploying) {
      return
    }
    setIsEdit(true)
  }, [isStep3Deploying])
  const cancelEdit = useCallback(() => {
    setIsEdit(false)
    updateLayerContent()
  }, [updateLayerContent])
  const submitEdit = useCallback(() => {
    setIsEdit(false)

    const updates: string[] = []

    if (dataLayerContent !== dataLayerString) {
      updates.push(`Update Data Layer: ${dataLayerContent}`)
    }
    if (signalLayerContent !== signalLayerString) {
      updates.push(`Update Signal Layer: ${signalLayerContent}`)
    }
    if (capitalLayerContent !== capitalLayerString) {
      updates.push(`Update Capital Layer: ${capitalLayerContent}`)
    }
    if (riskLayerContent !== riskLayerString) {
      updates.push(`Update Risk Layer: ${riskLayerContent}`)
    }
    if (executionLayerContent !== executionLayerString) {
      updates.push(`Update Execution Layer: ${executionLayerContent}`)
    }

    // 如果没有任何变化，直接跳过
    if (updates.length === 0) {
      return
    }

    sendChatUserContent({
      value: `Edit Strategy:\n${updates.join('\n')}`,
    })
  }, [
    dataLayerContent,
    dataLayerString,
    signalLayerContent,
    signalLayerString,
    capitalLayerContent,
    capitalLayerString,
    riskLayerContent,
    riskLayerString,
    executionLayerContent,
    executionLayerString,
    sendChatUserContent,
  ])
  useEffect(() => {
    updateLayerContent()
  }, [updateLayerContent])
  if (!isLoadingChatStream && !strategyDetail) {
    return <Pending isNotButtonLoading />
  }
  return (
    <SummaryWrapper className='scroll-style'>
      {strategy_config && (
        <CompleteContent>
          <CompleteInfo>
            <Trans>Your configuration is complete. You can now run the strategy.</Trans>
          </CompleteInfo>
          <ActionList>
            {/* <ActionLayer
              showRightArrow
              iconCls='icon-backtest'
              title={<Trans>Verify History (Backtest)</Trans>}
              description={<Trans>See how this strategy would have performed in the past.</Trans>}
              clickCallback={goBacktestTab}
            /> */}
            <ActionLayer
              showRightArrow
              iconCls='icon-view-code'
              title={<Trans>View code</Trans>}
              description={<Trans>Generated by the Agent</Trans>}
              clickCallback={goCodeTab}
            />
          </ActionList>
        </CompleteContent>
      )}
      {name && description && <StrategyInfo nameProp={name} descriptionProp={description} />}
      <LayerWrapper>
        <LayerTitle>
          <LayerTitleLeft>
            <IconBase className='icon-summary' />
            <span>
              <Trans>Strategy summary</Trans>
            </span>
          </LayerTitleLeft>
          {strategy_config && (
            <ButtonWrapper>
              {!isEdit ? (
                <ButtonEdit $disabled={isStep3Deploying} onClick={openEdit}>
                  <IconBase className='icon-edit' />
                  <Trans>Edit</Trans>
                </ButtonEdit>
              ) : (
                <>
                  <ButtonCancel onClick={cancelEdit}>
                    <Trans>Cancel</Trans>
                  </ButtonCancel>
                  <ButtonConfirm onClick={submitEdit}>
                    <Trans>Submit</Trans>
                  </ButtonConfirm>
                </>
              )}
            </ButtonWrapper>
          )}
        </LayerTitle>
        <LayerList>
          {LAYER_CONFIG.map((layer) => (
            <InfoLayer
              content={layer.content}
              updateContent={layer.updateContent}
              isEdit={isEdit}
              key={layer.key}
              iconCls={layer.iconCls}
              title={<Trans>{layer.titleKey}</Trans>}
              isLoading={layer.isLoading}
            />
          ))}
        </LayerList>
      </LayerWrapper>
      {editStrategyInfoModalOpen && <EditStrategyInfoModal nameProp={name || ''} descriptionProp={description || ''} />}
    </SummaryWrapper>
  )
})

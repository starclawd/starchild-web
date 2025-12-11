import styled from 'styled-components'
import StrategyInfo from './components/StrategyInfo'
import { Trans } from '@lingui/react/macro'
import ActionLayer from '../ActionLayer'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useStrategyInfoTabIndex } from 'store/createstrategy/hooks/useTabIndex'
import { IconBase } from 'components/Icons'
import InfoLayer from './components/InfoLayer'
import EditContent from './components/EditContent'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { EditStrategyInfoModal } from './components/EditStrategyInfoModal'
import { useModalOpen } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application'

const SummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`

const CompleteContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
    width: 50%;
  }
`

const LayerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px;
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

export default function Summary() {
  const name = 'Weekly Fibo Reversion (Long Only)'
  const description =
    ' A counter-trend strategy leveraging weekly Fibonacci retracement levels to catch oversold bounces with 10x leverage on Orderly Network.'
  const [isEdit, setIsEdit] = useState(false)
  const [, setStrategyInfoTabIndex] = useStrategyInfoTabIndex()
  const [dataLayerContent, setDataLayerContent] = useState<string>('')
  const [signalLayerContent, setSignalLayerContent] = useState<string>('')
  const [capitalLayerContent, setCapitalLayerContent] = useState<string>('')
  const [riskLayerContent, setRiskLayerContent] = useState<string>('')
  const [executionLayerContent, setExecutionLayerContent] = useState<string>('')
  const editStrategyInfoModalOpen = useModalOpen(ApplicationModal.EDIT_STRATEGY_INFO_MODAL)
  const LAYER_CONFIG = useMemo(() => {
    return [
      {
        key: 'data',
        iconCls: 'icon-summary',
        titleKey: <Trans>Data Layer</Trans>,
        content: dataLayerContent,
        updateContent: setDataLayerContent,
      },
      {
        key: 'signal',
        iconCls: 'icon-signal-layer',
        titleKey: <Trans>Signal Layer</Trans>,
        content: signalLayerContent,
        updateContent: setSignalLayerContent,
      },
      {
        key: 'capital',
        iconCls: 'icon-stake',
        titleKey: <Trans>Capital Layer</Trans>,
        content: capitalLayerContent,
        updateContent: setCapitalLayerContent,
      },
      {
        key: 'risk',
        iconCls: 'icon-shield',
        titleKey: <Trans>Risk Layer</Trans>,
        content: riskLayerContent,
        updateContent: setRiskLayerContent,
      },
      {
        key: 'execution',
        iconCls: 'icon-execution-layer',
        titleKey: <Trans>Execution layer</Trans>,
        content: executionLayerContent,
        updateContent: setExecutionLayerContent,
      },
    ]
  }, [dataLayerContent, signalLayerContent, capitalLayerContent, riskLayerContent, executionLayerContent])
  const goCodeTab = useCallback(() => {
    setStrategyInfoTabIndex(1)
  }, [setStrategyInfoTabIndex])
  const goBacktestTab = useCallback(() => {
    setStrategyInfoTabIndex(2)
  }, [setStrategyInfoTabIndex])
  useEffect(() => {
    setDataLayerContent('No manual SL; system will close if Account Risk > 80%')
    setSignalLayerContent('No manual SL; system will close if Account Risk > 80%')
    setCapitalLayerContent('No manual SL; system will close if Account Risk > 80%')
    setRiskLayerContent('No manual SL; system will close if Account Risk > 80%')
    setExecutionLayerContent('No manual SL; system will close if Account Risk > 80%')
  }, [])
  return (
    <SummaryWrapper>
      <CompleteContent>
        <CompleteInfo>
          <Trans>Your configuration is complete. You can now run the strategy.</Trans>
        </CompleteInfo>
        <ActionList>
          <ActionLayer
            showRightArrow
            iconCls='icon-view-code'
            title={<Trans>View code</Trans>}
            description={<Trans>Generated by the Agent</Trans>}
            clickCallback={goCodeTab}
          />
          <ActionLayer
            showRightArrow
            iconCls='icon-backtest'
            title={<Trans>Verify History (Backtest)</Trans>}
            description={<Trans>See how this strategy would have performed in the past.</Trans>}
            clickCallback={goBacktestTab}
          />
        </ActionList>
      </CompleteContent>
      <StrategyInfo nameProp={name} descriptionProp={description} />
      <LayerWrapper>
        <LayerTitle>
          <LayerTitleLeft>
            <IconBase className='icon-summary' />
            <span>
              <Trans>Strategy summary</Trans>
            </span>
          </LayerTitleLeft>
          <ButtonWrapper>
            {!isEdit ? (
              <ButtonEdit onClick={() => setIsEdit(true)}>
                <IconBase className='icon-edit' />
                <Trans>Edit</Trans>
              </ButtonEdit>
            ) : (
              <>
                <ButtonCancel onClick={() => setIsEdit(false)}>
                  <Trans>Cancel</Trans>
                </ButtonCancel>
                <ButtonConfirm>
                  <Trans>Submit</Trans>
                </ButtonConfirm>
              </>
            )}
          </ButtonWrapper>
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
              isLoading={false}
            />
          ))}
        </LayerList>
      </LayerWrapper>
      {editStrategyInfoModalOpen && <EditStrategyInfoModal nameProp={name} descriptionProp={description} />}
    </SummaryWrapper>
  )
}

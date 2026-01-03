import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useStrategyTabIndex } from 'store/createstrategycache/hooks'
import { IconBase } from 'components/Icons'
import InfoLayer from './components/InfoLayer'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import { useIsLoadingChatStream } from 'store/createstrategy/hooks/useLoadingState'
import Pending from 'components/Pending'
import { useSendChatUserContent } from 'store/createstrategy/hooks/useStream'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useIsStep3Deploying } from 'store/createstrategy/hooks/useDeployment'
import { STRATEGY_TAB_INDEX } from 'store/createstrategy/createstrategy'
import { ANI_DURATION } from 'constants/index'
import TabList from 'components/TabList'

const SummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-top: 1px solid ${({ theme }) => theme.black600};
`

const LayerTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  height: 40px;
  .tab-item {
    border-bottom: 1px solid ${({ theme }) => theme.black600};
    border-right: 1px solid ${({ theme }) => theme.black600};
    &:first-child {
      border-left: 1px solid ${({ theme }) => theme.black600};
    }
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`

const ButtonEdit = styled(ButtonBorder)`
  width: fit-content;
  gap: 4px;
  height: 100%;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  padding: 0 12px;
  border-radius: 0;
  border-top: none;
  color: ${({ theme }) => theme.textL3};
  .icon-edit {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }
`

const ButtonCancel = styled(ButtonEdit)``

const ButtonConfirm = styled(ButtonEdit)`
  border-left: none;
`

const LayerList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  padding-right: 8px !important;
  overflow-y: auto;
`

const LayerSection = styled.div`
  scroll-margin-top: 20px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.black600};
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`

enum SUMMARY_TAB_KEY {
  DATA = 'data',
  SIGNAL = 'signal',
  CAPITAL = 'capital',
  RISK = 'risk',
  EXECUTION = 'execution',
}

export default memo(function Summary() {
  const { strategyId } = useParsedQueryString()
  const isStep3Deploying = useIsStep3Deploying(strategyId || '')
  const { strategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })
  const [isEdit, setIsEdit] = useState(false)
  const [isLoadingChatStream] = useIsLoadingChatStream()
  const sendChatUserContent = useSendChatUserContent()
  const [, setStrategyInfoTabIndex] = useStrategyTabIndex(strategyId || undefined)
  const [dataLayerContent, setDataLayerContent] = useState<string>('')
  const [signalLayerContent, setSignalLayerContent] = useState<string>('')
  const [capitalLayerContent, setCapitalLayerContent] = useState<string>('')
  const [riskLayerContent, setRiskLayerContent] = useState<string>('')
  const [executionLayerContent, setExecutionLayerContent] = useState<string>('')
  const [activeTab, setActiveTab] = useState(SUMMARY_TAB_KEY.DATA)
  const layerListRef = useRef<HTMLDivElement>(null)
  const isClickScrollingRef = useRef(false)
  const { strategy_config } = strategyDetail || {
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

  const handleTabClick = useCallback((key: SUMMARY_TAB_KEY) => {
    setActiveTab(key)
    // 标记为点击滚动，避免触发滚动监听
    isClickScrollingRef.current = true

    // 滚动到对应的 layer
    const element = document.getElementById(`layer-${key}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // 延迟重置，等待滚动完成
    setTimeout(() => {
      isClickScrollingRef.current = false
    }, 500)
  }, [])

  const tabList = useMemo(() => {
    return [
      {
        key: SUMMARY_TAB_KEY.DATA,
        icon: <IconBase className='icon-data-layer' />,
        text: <Trans>Data Layer</Trans>,
        clickCallback: () => handleTabClick(SUMMARY_TAB_KEY.DATA),
      },
      {
        key: SUMMARY_TAB_KEY.SIGNAL,
        icon: <IconBase className='icon-signal-layer' />,
        text: <Trans>Signal Layer</Trans>,
        clickCallback: () => handleTabClick(SUMMARY_TAB_KEY.SIGNAL),
      },
      {
        key: SUMMARY_TAB_KEY.CAPITAL,
        icon: <IconBase className='icon-capital-layer' />,
        text: <Trans>Capital Layer</Trans>,
        clickCallback: () => handleTabClick(SUMMARY_TAB_KEY.CAPITAL),
      },
      {
        key: SUMMARY_TAB_KEY.RISK,
        icon: <IconBase className='icon-risk-layer' />,
        text: <Trans>Risk Layer</Trans>,
        clickCallback: () => handleTabClick(SUMMARY_TAB_KEY.RISK),
      },
      {
        key: SUMMARY_TAB_KEY.EXECUTION,
        icon: <IconBase className='icon-execution-layer' />,
        text: <Trans>Execution Layer</Trans>,
        clickCallback: () => handleTabClick(SUMMARY_TAB_KEY.EXECUTION),
      },
    ]
  }, [handleTabClick])

  const LAYER_CONFIG = useMemo(() => {
    return [
      {
        key: SUMMARY_TAB_KEY.DATA,
        iconCls: 'icon-data-layer',
        titleKey: <Trans>Data Layer</Trans>,
        content: dataLayerContent,
        updateContent: setDataLayerContent,
        isLoading: !dataLayerContent,
      },
      {
        key: SUMMARY_TAB_KEY.SIGNAL,
        iconCls: 'icon-signal-layer',
        titleKey: <Trans>Signal Layer</Trans>,
        content: signalLayerContent,
        updateContent: setSignalLayerContent,
        isLoading: !signalLayerContent,
      },
      {
        key: SUMMARY_TAB_KEY.CAPITAL,
        iconCls: 'icon-capital-layer',
        titleKey: <Trans>Capital Layer</Trans>,
        content: capitalLayerContent,
        updateContent: setCapitalLayerContent,
        isLoading: !capitalLayerContent,
      },
      {
        key: SUMMARY_TAB_KEY.RISK,
        iconCls: 'icon-risk-layer',
        titleKey: <Trans>Risk Layer</Trans>,
        content: riskLayerContent,
        updateContent: setRiskLayerContent,
        isLoading: !riskLayerContent,
      },
      {
        key: SUMMARY_TAB_KEY.EXECUTION,
        iconCls: 'icon-execution-layer',
        titleKey: <Trans>Execution Layer</Trans>,
        content: executionLayerContent,
        updateContent: setExecutionLayerContent,
        isLoading: !executionLayerContent,
      },
    ]
  }, [dataLayerContent, signalLayerContent, capitalLayerContent, riskLayerContent, executionLayerContent])

  const goCodeTab = useCallback(() => {
    setStrategyInfoTabIndex(STRATEGY_TAB_INDEX.CODE)
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

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    // 如果是点击 tab 导致的滚动，不处理
    if (isClickScrollingRef.current) return

    const scrollTop = e.currentTarget.scrollTop

    // 找到当前可见的 layer
    let currentLayer = SUMMARY_TAB_KEY.DATA
    for (const key of Object.values(SUMMARY_TAB_KEY)) {
      const element = document.getElementById(`layer-${key.toString()}`)
      if (element) {
        // 使用 offsetTop 相对于滚动容器的位置
        const elementTop = element.offsetTop - e.currentTarget.offsetTop
        // 如果滚动位置已经超过元素顶部位置（加一点偏移），则认为是当前 layer
        if (scrollTop >= elementTop - 50) {
          currentLayer = key
        }
      }
    }

    setActiveTab(currentLayer)
  }, [])

  useEffect(() => {
    updateLayerContent()
  }, [updateLayerContent])
  if (!isLoadingChatStream && !strategyDetail) {
    return <Pending isNotButtonLoading />
  }
  return (
    <SummaryWrapper>
      <LayerTitle>
        <TabList tabKey={activeTab} tabList={tabList} />
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
      <LayerList onScroll={handleScroll} ref={layerListRef} className='scroll-style'>
        {LAYER_CONFIG.map((layer) => (
          <LayerSection key={layer.key} id={`layer-${layer.key}`}>
            <InfoLayer
              content={layer.content}
              updateContent={layer.updateContent}
              isEdit={isEdit}
              iconCls={layer.iconCls}
              title={<Trans>{layer.titleKey}</Trans>}
              isLoading={layer.isLoading}
            />
          </LayerSection>
        ))}
      </LayerList>
    </SummaryWrapper>
  )
})

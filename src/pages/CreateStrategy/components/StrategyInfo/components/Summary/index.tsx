import styled, { css, keyframes } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIsCreateStrategy } from 'store/createstrategy/hooks/useCreateStrategyDetail'
import { IconBase } from 'components/Icons'
import InfoLayer from './components/InfoLayer'
import { ButtonBorder } from 'components/Button'
import { useCreateStrategyDetail } from 'store/createstrategy/hooks/useCreateStrategyDetail'
import { useIsLoadingChatStream } from 'store/createstrategy/hooks/useLoadingState'
import { useSendChatUserContent } from 'store/createstrategy/hooks/useStream'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useIsStep3Deploying } from 'store/createstrategy/hooks/useDeployment'
import MoveTabList, { MoveType } from 'components/MoveTabList'
import { ANI_DURATION } from 'constants/index'
import TypewriterCursor from 'components/TypewriterCursor'
import { useIsLogin } from 'store/login/hooks'
import { MEDIA_WIDTHS } from 'theme/styled'
import { useWindowSize } from 'hooks/useWindowSize'
import LayerFlowModal from './components/LayerFlowModal'

// 光标闪烁动画
const cursorBlink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`

const SummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const LayerTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  height: 40px;
  padding-left: 20px;
  .move-tab-item {
    padding: 0;
  }
`

const LeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`

const ButtonFlow = styled(ButtonBorder)`
  width: fit-content;
  gap: 4px;
  height: 100%;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  border-radius: 0;
  border: none;
  padding: 0;
  color: ${({ theme }) => theme.brand100};
  .icon-flow {
    font-size: 18px;
    color: ${({ theme }) => theme.brand100};
  }
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
  border: none;
  color: ${({ theme }) => theme.black200};
  .icon-edit {
    font-size: 18px;
    color: ${({ theme }) => theme.black200};
  }
`

const ButtonCancel = styled(ButtonEdit)``

const ButtonConfirm = styled(ButtonEdit)`
  border-left: none;
  color: ${({ theme }) => theme.green100};
`

const LayerList = styled.div<{ $isEdit: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  padding-right: 8px !important;
  overflow-y: auto;
  transition: all ${ANI_DURATION}s;
  ${({ $isEdit, theme }) =>
    $isEdit &&
    css`
      background-color: ${({ theme }) => theme.black900};
    `}
`

const LayerSection = styled.div`
  position: relative;
  scroll-margin-top: 20px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.black800};
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
  .typewriter-cursor {
    margin-left: 2px;
  }
`

const BgIcon = styled.div<{ $isLogin: boolean; $iconSize?: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  i {
    font-size: ${({ $iconSize }) => ($iconSize ? `${$iconSize}px` : '258px')};
    color: ${({ theme }) => theme.black800};
    transition: font-size 0.2s ease;
  }
  ${({ $isLogin }) =>
    !$isLogin &&
    css`
      justify-content: flex-end;
      i {
        color: ${({ theme }) => theme.black900};
      }
    `}
`

enum SUMMARY_TAB_KEY {
  DATA = 'data',
  SIGNAL = 'signal',
  CAPITAL = 'capital',
  RISK = 'risk',
  EXECUTION = 'execution',
}

// 计算 BgIcon 的 font-size：80% 高度，最大 258px
const calcIconSize = (height: number) => Math.min(height * 0.8, 258)

// LayerItem 组件
interface LayerItemProps {
  layerKey: SUMMARY_TAB_KEY
  iconCls: string
  isLogin: boolean
  iconSize: number
  onHeightChange: (key: SUMMARY_TAB_KEY, height: number) => void
  children: React.ReactNode
}

const LayerItem = memo(({ layerKey, iconCls, isLogin, iconSize, onHeightChange, children }: LayerItemProps) => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height
        onHeightChange(layerKey, height)
      }
    })

    resizeObserver.observe(element)
    // 初始上报高度
    onHeightChange(layerKey, element.offsetHeight)

    return () => {
      resizeObserver.disconnect()
    }
  }, [layerKey, onHeightChange])

  return (
    <LayerSection ref={sectionRef} id={`layer-${layerKey}`}>
      {children}
      <BgIcon $isLogin={isLogin} $iconSize={iconSize}>
        <IconBase className={iconCls} />
      </BgIcon>
    </LayerSection>
  )
})

// 打字机效果的类型定义
interface TypewriterState {
  isTyping: boolean // 是否正在打字
  currentLayerIndex: number // 当前正在打字的 layer 索引
  currentPhase: 'title' | 'content' // 当前阶段：标题或内容
  currentCharIndex: number // 当前字符索引
  displayedTexts: {
    // 各个 layer 已显示的文本
    [key: string]: { title: string; content: string }
  }
}

// 打字速度配置（与 useSteamRenderText 保持一致）
const TYPING_CHUNK_SIZE = 5 // 每次显示的字符数
const TYPING_INTERVAL = 17 // 每次显示的间隔时间（毫秒）

export default memo(function Summary() {
  const isLogin = useIsLogin()
  const { width } = useWindowSize()
  const { strategyId } = useParsedQueryString()
  const isStep3Deploying = useIsStep3Deploying(strategyId || '')
  const { strategyDetail } = useCreateStrategyDetail({ strategyId: strategyId || '' })
  const [isEdit, setIsEdit] = useState(false)
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false)
  const sendChatUserContent = useSendChatUserContent()
  const [isCreateStrategyFrontend] = useIsCreateStrategy()
  const [dataLayerContent, setDataLayerContent] = useState<string>('')
  const [signalLayerContent, setSignalLayerContent] = useState<string>('')
  const [capitalLayerContent, setCapitalLayerContent] = useState<string>('')
  const [riskLayerContent, setRiskLayerContent] = useState<string>('')
  const [executionLayerContent, setExecutionLayerContent] = useState<string>('')
  const [activeTab, setActiveTab] = useState(SUMMARY_TAB_KEY.DATA)
  const layerListRef = useRef<HTMLDivElement>(null)
  const isClickScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // 打字机效果状态
  const [typewriterState, setTypewriterState] = useState<TypewriterState>({
    isTyping: false,
    currentLayerIndex: 0,
    currentPhase: 'title',
    currentCharIndex: 0,
    displayedTexts: {},
  })
  // 用于记录打字机效果是否已经开始过（一旦开始就不受 isCreateStrategyFrontend 影响）
  const typewriterStartedRef = useRef(false)
  // 用于记录 isCreateStrategyFrontend 是否曾经为 true（用于判断是否应该启动打字机效果）
  const hasBeenCreatingRef = useRef(false)
  // 用于记录旧的 strategy_config（用于对比是否有变化）
  const prevStrategyConfigRef = useRef<string | null>(null)
  // 用于记录是否应该显示等待光标（isCreateStrategyFrontend 为 true 且没有数据）
  const [showWaitingCursor, setShowWaitingCursor] = useState(false)
  // 存储各个 Layer 的高度
  const [layerHeights, setLayerHeights] = useState<Record<SUMMARY_TAB_KEY, number>>(
    {} as Record<SUMMARY_TAB_KEY, number>,
  )
  const isShowIcon = useMemo(() => {
    return !(Number(width) < MEDIA_WIDTHS.width1440)
  }, [width])

  // 处理 Layer 高度变化的回调
  const handleLayerHeightChange = useCallback((key: SUMMARY_TAB_KEY, height: number) => {
    setLayerHeights((prev) => {
      if (prev[key] === height) return prev
      return { ...prev, [key]: height }
    })
  }, [])

  // 根据所有 Layer 的最小高度计算 icon size
  const iconSize = useMemo(() => {
    const heights = Object.values(layerHeights)
    if (heights.length === 0) return 258
    const minHeight = Math.min(...heights)
    return calcIconSize(minHeight)
  }, [layerHeights])

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

  // 各个 layer 的标题文本（用于打字机效果）
  const layerTitles = useMemo(
    () => ({
      [SUMMARY_TAB_KEY.DATA]: 'Data',
      [SUMMARY_TAB_KEY.SIGNAL]: 'Signal',
      [SUMMARY_TAB_KEY.CAPITAL]: 'Capital',
      [SUMMARY_TAB_KEY.RISK]: 'Risk',
      [SUMMARY_TAB_KEY.EXECUTION]: 'Execution',
    }),
    [],
  )

  // layer 顺序
  const layerOrder = useMemo(
    () => [
      SUMMARY_TAB_KEY.DATA,
      SUMMARY_TAB_KEY.SIGNAL,
      SUMMARY_TAB_KEY.CAPITAL,
      SUMMARY_TAB_KEY.RISK,
      SUMMARY_TAB_KEY.EXECUTION,
    ],
    [],
  )

  // 各个 layer 的完整内容
  const layerContents = useMemo(
    () => ({
      [SUMMARY_TAB_KEY.DATA]: dataLayerString,
      [SUMMARY_TAB_KEY.SIGNAL]: signalLayerString,
      [SUMMARY_TAB_KEY.CAPITAL]: capitalLayerString,
      [SUMMARY_TAB_KEY.RISK]: riskLayerString,
      [SUMMARY_TAB_KEY.EXECUTION]: executionLayerString,
    }),
    [dataLayerString, signalLayerString, capitalLayerString, riskLayerString, executionLayerString],
  )

  // 记录 isCreateStrategyFrontend 是否曾经为 true
  useEffect(() => {
    if (isCreateStrategyFrontend) {
      hasBeenCreatingRef.current = true
    }
  }, [isCreateStrategyFrontend])

  // 处理等待光标显示逻辑：当 strategy_config 没有数据时，默认显示光标
  useEffect(() => {
    if (!strategy_config && !typewriterStartedRef.current) {
      setShowWaitingCursor(true)
    } else {
      setShowWaitingCursor(false)
    }
  }, [strategy_config])

  // 启动打字机效果
  useEffect(() => {
    if (!strategy_config) return

    const currentConfigStr = JSON.stringify(strategy_config)
    const prevConfigStr = prevStrategyConfigRef.current

    // 检查是否需要启动打字机效果
    const shouldStartTypewriter = () => {
      // 如果刷新页面时 isCreateStrategyFrontend 从未为 true，则直接渲染完整内容
      if (!hasBeenCreatingRef.current) {
        return false
      }

      // 首次有 strategy_config 数据，启动打字机
      if (!typewriterStartedRef.current && prevConfigStr === null) {
        return true
      }

      // 重新创建策略：isCreateStrategyFrontend 为 true 且 strategy_config 发生变化
      if (isCreateStrategyFrontend && prevConfigStr !== null && currentConfigStr !== prevConfigStr) {
        return true
      }

      return false
    }

    if (shouldStartTypewriter()) {
      typewriterStartedRef.current = true
      setShowWaitingCursor(false)
      setTypewriterState({
        isTyping: true,
        currentLayerIndex: 0,
        currentPhase: 'title',
        currentCharIndex: 0,
        displayedTexts: {},
      })
    }

    // 更新旧的 strategy_config
    prevStrategyConfigRef.current = currentConfigStr
  }, [strategy_config, isCreateStrategyFrontend])

  // 打字机效果的核心逻辑（与 useSteamRenderText 速度一致）
  useEffect(() => {
    if (!typewriterState.isTyping) return

    const currentLayerKey = layerOrder[typewriterState.currentLayerIndex]
    const currentTitle = layerTitles[currentLayerKey]
    const currentContent = layerContents[currentLayerKey]

    const timer = setTimeout(() => {
      setTypewriterState((prev) => {
        const newState = { ...prev }
        const currentDisplayed = newState.displayedTexts[currentLayerKey] || { title: '', content: '' }

        if (prev.currentPhase === 'title') {
          // 正在打标题
          if (prev.currentCharIndex < currentTitle.length) {
            // 每次显示 TYPING_CHUNK_SIZE 个字符
            const nextCharIndex = Math.min(prev.currentCharIndex + TYPING_CHUNK_SIZE, currentTitle.length)
            newState.displayedTexts = {
              ...newState.displayedTexts,
              [currentLayerKey]: {
                ...currentDisplayed,
                title: currentTitle.slice(0, nextCharIndex),
              },
            }
            newState.currentCharIndex = nextCharIndex
          } else {
            // 标题打完，开始打内容
            newState.currentPhase = 'content'
            newState.currentCharIndex = 0
          }
        } else {
          // 正在打内容
          if (prev.currentCharIndex < currentContent.length) {
            // 每次显示 TYPING_CHUNK_SIZE 个字符
            const nextCharIndex = Math.min(prev.currentCharIndex + TYPING_CHUNK_SIZE, currentContent.length)
            newState.displayedTexts = {
              ...newState.displayedTexts,
              [currentLayerKey]: {
                ...currentDisplayed,
                content: currentContent.slice(0, nextCharIndex),
              },
            }
            newState.currentCharIndex = nextCharIndex
          } else {
            // 当前 layer 打完，切换到下一个 layer
            if (prev.currentLayerIndex < layerOrder.length - 1) {
              newState.currentLayerIndex = prev.currentLayerIndex + 1
              newState.currentPhase = 'title'
              newState.currentCharIndex = 0
            } else {
              // 所有 layer 打完，结束打字机效果
              newState.isTyping = false
            }
          }
        }

        return newState
      })
    }, TYPING_INTERVAL)

    return () => clearTimeout(timer)
  }, [typewriterState, layerOrder, layerTitles, layerContents])

  // 打字机效果期间自动滚动到底部
  useEffect(() => {
    if (typewriterState.isTyping && layerListRef.current) {
      layerListRef.current.scrollTop = layerListRef.current.scrollHeight
    }
  }, [typewriterState])

  const handleTabClick = useCallback((key: SUMMARY_TAB_KEY) => {
    // 清除之前的 timeout，避免多次点击导致的混乱
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = null
    }

    setActiveTab(key)
    // 标记为点击滚动，避免触发滚动监听
    isClickScrollingRef.current = true

    // 滚动到对应的 layer
    const element = document.getElementById(`layer-${key}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // 延迟重置，等待滚动完成
    scrollTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false
      scrollTimeoutRef.current = null
    }, 500)
  }, [])

  const tabList = useMemo(() => {
    return [
      {
        key: SUMMARY_TAB_KEY.DATA,
        icon: isShowIcon ? <IconBase className='icon-data-layer' /> : null,
        text: <Trans>Data</Trans>,
        clickCallback: () => handleTabClick(SUMMARY_TAB_KEY.DATA),
      },
      {
        key: SUMMARY_TAB_KEY.SIGNAL,
        icon: isShowIcon ? <IconBase className='icon-signal-layer' /> : null,
        text: <Trans>Signal</Trans>,
        clickCallback: () => handleTabClick(SUMMARY_TAB_KEY.SIGNAL),
      },
      {
        key: SUMMARY_TAB_KEY.CAPITAL,
        icon: isShowIcon ? <IconBase className='icon-capital-layer' /> : null,
        text: <Trans>Capital</Trans>,
        clickCallback: () => handleTabClick(SUMMARY_TAB_KEY.CAPITAL),
      },
      {
        key: SUMMARY_TAB_KEY.RISK,
        icon: isShowIcon ? <IconBase className='icon-risk-layer' /> : null,
        text: <Trans>Risk</Trans>,
        clickCallback: () => handleTabClick(SUMMARY_TAB_KEY.RISK),
      },
      {
        key: SUMMARY_TAB_KEY.EXECUTION,
        icon: isShowIcon ? <IconBase className='icon-execution-layer' /> : null,
        text: <Trans>Execution</Trans>,
        clickCallback: () => handleTabClick(SUMMARY_TAB_KEY.EXECUTION),
      },
    ]
  }, [isShowIcon, handleTabClick])

  // 判断某个 layer 是否应该显示（打字机效果中，只显示已开始打字的 layer）
  const shouldShowLayer = useCallback(
    (layerIndex: number) => {
      if (!typewriterState.isTyping && !typewriterStartedRef.current) {
        // 打字机效果未开始，不显示任何 layer（除非 strategy_config 已存在且不是首次加载）
        return !isCreateStrategyFrontend || !!strategy_config
      }
      if (typewriterState.isTyping) {
        // 打字机效果进行中，只显示已开始打字的 layer
        return layerIndex <= typewriterState.currentLayerIndex
      }
      // 打字机效果已结束，显示所有 layer
      return true
    },
    [typewriterState.isTyping, typewriterState.currentLayerIndex, isCreateStrategyFrontend, strategy_config],
  )

  // 获取某个 layer 的打字机状态
  const getTypewriterInfo = useCallback(
    (layerKey: SUMMARY_TAB_KEY, layerIndex: number) => {
      const isCurrentLayer = typewriterState.isTyping && layerIndex === typewriterState.currentLayerIndex
      const isLayerComplete = !typewriterState.isTyping || layerIndex < typewriterState.currentLayerIndex
      const displayedText = typewriterState.displayedTexts[layerKey] || { title: '', content: '' }

      // 如果 layer 已完成，显示完整内容；否则显示打字机进度
      const displayedTitle = isLayerComplete ? layerTitles[layerKey] : displayedText.title
      const displayedContent = isLayerComplete ? layerContents[layerKey] : displayedText.content

      return {
        isTyping: typewriterState.isTyping,
        isCurrentLayer,
        showCursor: false, // 打字效果期间不显示光标
        cursorPosition: typewriterState.currentPhase,
        displayedTitle,
        displayedContent,
        isLayerComplete,
      }
    },
    [typewriterState, layerTitles, layerContents],
  )

  const LAYER_CONFIG = useMemo(() => {
    if (!isLogin) {
      return [
        {
          key: SUMMARY_TAB_KEY.DATA,
          iconCls: 'icon-data-layer',
          titleKey: <Trans>Data</Trans>,
          content: dataLayerContent,
          updateContent: setDataLayerContent,
          isLoading: !dataLayerContent,
        },
      ]
    }
    return [
      {
        key: SUMMARY_TAB_KEY.DATA,
        iconCls: 'icon-data-layer',
        titleKey: <Trans>Data</Trans>,
        content: dataLayerContent,
        updateContent: setDataLayerContent,
        isLoading: !dataLayerContent,
      },
      {
        key: SUMMARY_TAB_KEY.SIGNAL,
        iconCls: 'icon-signal-layer',
        titleKey: <Trans>Signal</Trans>,
        content: signalLayerContent,
        updateContent: setSignalLayerContent,
        isLoading: !signalLayerContent,
      },
      {
        key: SUMMARY_TAB_KEY.CAPITAL,
        iconCls: 'icon-capital-layer',
        titleKey: <Trans>Capital</Trans>,
        content: capitalLayerContent,
        updateContent: setCapitalLayerContent,
        isLoading: !capitalLayerContent,
      },
      {
        key: SUMMARY_TAB_KEY.RISK,
        iconCls: 'icon-risk-layer',
        titleKey: <Trans>Risk</Trans>,
        content: riskLayerContent,
        updateContent: setRiskLayerContent,
        isLoading: !riskLayerContent,
      },
      {
        key: SUMMARY_TAB_KEY.EXECUTION,
        iconCls: 'icon-execution-layer',
        titleKey: <Trans>Execution</Trans>,
        content: executionLayerContent,
        updateContent: setExecutionLayerContent,
        isLoading: !executionLayerContent,
      },
    ]
  }, [isLogin, dataLayerContent, signalLayerContent, capitalLayerContent, riskLayerContent, executionLayerContent])

  const updateLayerContent = useCallback(() => {
    setDataLayerContent(dataLayerString)
    setSignalLayerContent(signalLayerString)
    setCapitalLayerContent(capitalLayerString)
    setRiskLayerContent(riskLayerString)
    setExecutionLayerContent(executionLayerString)
  }, [dataLayerString, signalLayerString, capitalLayerString, riskLayerString, executionLayerString])
  const openEdit = useCallback(() => {
    if (isStep3Deploying || !strategy_config) {
      return
    }
    setIsEdit(true)
  }, [isStep3Deploying, strategy_config])
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

  // Flow Modal 相关
  const openFlowModal = useCallback(() => {
    if (isStep3Deploying || !strategy_config) {
      return
    }
    setIsFlowModalOpen(true)
  }, [isStep3Deploying, strategy_config])

  const closeFlowModal = useCallback(() => {
    setIsFlowModalOpen(false)
  }, [])

  const handleFlowSave = useCallback(
    (layers: {
      data_layer: Record<string, string | object>
      signal_layer: Record<string, string | object>
      capital_layer: Record<string, string | object>
      risk_layer: Record<string, string | object>
      execution_layer: Record<string, string | object>
    }) => {
      const updates: string[] = []

      if (JSON.stringify(layers.data_layer) !== dataLayerString) {
        updates.push(`Update Data Layer: ${JSON.stringify(layers.data_layer)}`)
      }
      if (JSON.stringify(layers.signal_layer) !== signalLayerString) {
        updates.push(`Update Signal Layer: ${JSON.stringify(layers.signal_layer)}`)
      }
      if (JSON.stringify(layers.capital_layer) !== capitalLayerString) {
        updates.push(`Update Capital Layer: ${JSON.stringify(layers.capital_layer)}`)
      }
      if (JSON.stringify(layers.risk_layer) !== riskLayerString) {
        updates.push(`Update Risk Layer: ${JSON.stringify(layers.risk_layer)}`)
      }
      if (JSON.stringify(layers.execution_layer) !== executionLayerString) {
        updates.push(`Update Execution Layer: ${JSON.stringify(layers.execution_layer)}`)
      }

      // 如果没有任何变化，直接跳过
      if (updates.length === 0) {
        return
      }

      sendChatUserContent({
        value: `Edit Strategy:\n${updates.join('\n')}`,
      })
    },
    [
      dataLayerString,
      signalLayerString,
      capitalLayerString,
      riskLayerString,
      executionLayerString,
      sendChatUserContent,
    ],
  )

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

  // 组件卸载时清理 timeout
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])
  return (
    <SummaryWrapper>
      <LayerTitle>
        <LeftContent>
          {!typewriterState.isTyping && isLogin && (
            <ButtonFlow $disabled={isStep3Deploying || !strategy_config} onClick={openFlowModal}>
              <IconBase className='icon-flow icon-chart-5' />
              <Trans>Flow</Trans>
            </ButtonFlow>
          )}
          <MoveTabList gap={20} tabKey={activeTab} tabList={tabList} />
        </LeftContent>
        {!typewriterState.isTyping && (
          <ButtonWrapper>
            {!isEdit ? (
              isLogin && (
                <ButtonEdit id='strategyEditButton' $disabled={isStep3Deploying || !strategy_config} onClick={openEdit}>
                  <IconBase className='icon-edit' />
                  <Trans>Edit</Trans>
                </ButtonEdit>
              )
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
      <LayerList $isEdit={isEdit} onScroll={handleScroll} ref={layerListRef} className='scroll-style'>
        {/* 等待光标：当 isCreateStrategyFrontend 为 true 且没有数据时显示 */}
        {showWaitingCursor && (
          <LayerSection>
            <TypewriterCursor />
          </LayerSection>
        )}
        {/* Layer 列表：根据打字机效果状态显示 */}
        {strategy_config &&
          LAYER_CONFIG.map((layer, index) => {
            if (!shouldShowLayer(index)) return null

            const typewriterInfo = getTypewriterInfo(layer.key, index)

            return (
              <LayerItem
                key={layer.key}
                layerKey={layer.key}
                iconCls={layer.iconCls}
                isLogin={isLogin}
                iconSize={iconSize}
                onHeightChange={handleLayerHeightChange}
              >
                <InfoLayer
                  content={typewriterInfo.isTyping ? typewriterInfo.displayedContent : layer.content}
                  updateContent={layer.updateContent}
                  isEdit={isEdit}
                  iconCls={layer.iconCls}
                  title={<Trans>{layer.titleKey}</Trans>}
                  isLoading={!typewriterInfo.isTyping && layer.isLoading}
                  // 打字机效果相关 props
                  typewriterInfo={typewriterInfo}
                />
              </LayerItem>
            )
          })}
      </LayerList>

      {/* Layer Flow Modal */}
      <LayerFlowModal
        isOpen={isFlowModalOpen}
        onClose={closeFlowModal}
        dataLayerString={dataLayerString}
        signalLayerString={signalLayerString}
        capitalLayerString={capitalLayerString}
        riskLayerString={riskLayerString}
        executionLayerString={executionLayerString}
        onSave={handleFlowSave}
      />
    </SummaryWrapper>
  )
})

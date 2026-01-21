import styled, { keyframes } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GENERATION_STATUS, STRATEGY_TAB_INDEX } from 'store/createstrategy/createstrategy'
import {
  useHandleGenerateCode,
  useIsGeneratingCode,
  useIsTypewritingCode,
  useStrategyCode,
  useIsShowExpandCode,
} from 'store/createstrategy/hooks/useCode'
import { useCurrentStrategyTabIndex, useCreateStrategyDetail } from 'store/createstrategy/hooks/useCreateStrategyDetail'
import useParsedQueryString from 'hooks/useParsedQueryString'
import MemoizedHighlight from 'components/MemoizedHighlight'
import { IconBase } from 'components/Icons'
import useCopyContent from 'hooks/useCopyContent'
import { extractExecutableCode } from 'utils/extractExecutableCode'
import { ButtonBorder } from 'components/Button'
import codeBg from 'assets/createstrategy/code-bg.png'
import TypewriterCursor from 'components/TypewriterCursor'
import StrategyCodeVisualizer from 'components/StrategyCodeVisualizer'
import { ANI_DURATION } from 'constants/index'
import MoveTabList, { MoveType } from 'components/MoveTabList'
import { useWindowSize } from 'hooks/useWindowSize'
import { MEDIA_WIDTHS } from 'theme/styled'

// 打字机效果的速度（每个字符的间隔时间，单位毫秒）
const TYPEWRITER_SPEED = 17
// 每次添加的字符数
const TYPEWRITER_CHARS_PER_TICK = 10

// 视图模式
export enum ViewMode {
  CODE = 'code',
  FLOW = 'flow',
}

const CodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  gap: 12px;
  width: 100%;
  height: 40px;
  border-left: 1px solid ${({ theme }) => theme.black800};
`

const Left = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 12px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.green200};
  .tab-list-wrapper {
    margin-right: 20px;
  }
  .move-tab-item {
    padding: 0;
  }
  .icon-circle-success {
    margin-right: 4px;
    font-size: 18px;
    color: ${({ theme }) => theme.green200};
  }
`

const OperatorWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  .tab-list-wrapper {
    height: 100%;
    border: none;
    .active-indicator {
      height: 32px;
    }
    .move-tab-item {
      height: 32px;
    }
  }
`

const RegenerateButton = styled(ButtonBorder)`
  height: 100%;
  padding: 0 12px;
  border: none;
`

const CopyButton = styled(ButtonBorder)`
  height: 100%;
  padding: 0 12px;
  border: none;
`

const ZoomButton = styled(ButtonBorder)`
  width: 38px;
  height: 100%;
  border: none;
`

const CodeContentWrapper = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  flex-direction: column;
  flex-grow: 1;
  gap: 12px;
  padding: 20px;
  padding-right: 20px !important;
  background-size: 540px 540px;
  background-repeat: no-repeat;
  background-position: center;
  code.hljs {
    padding: 0 !important;
  }
  .typewriter-cursor {
    margin-left: 2px;
  }
`

const LoadingWrapper = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.black800};
  padding: 16px;
`

// 可视化提示动画
const pulseAnimation = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(248, 70, 0, 0.4); }
  50% { box-shadow: 0 0 0 6px rgba(248, 70, 0, 0); }
`

const FlowHintButton = styled.button<{ $show: boolean }>`
  display: ${({ $show }) => ($show ? 'flex' : 'none')};
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  margin-right: 8px;
  border: none;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.brand100};
  color: ${({ theme }) => theme.black0};
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  animation: ${pulseAnimation} 2s ease-in-out infinite;
  transition: all ${ANI_DURATION}s;

  .icon {
    font-size: 14px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.brand200};
  }
`

// Flow 容器
const FlowContentWrapper = styled.div<{ $visible: boolean }>`
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
`

export default memo(function Code() {
  const { strategyId } = useParsedQueryString()
  const { width } = useWindowSize()
  const { strategyCode, refetch: refetchStrategyCode } = useStrategyCode({ strategyId: strategyId || '' })
  const [isGeneratingCodeFrontend] = useIsGeneratingCode()
  const handleGenerateCode = useHandleGenerateCode()
  const [isShowExpandCode, setIsShowExpandCode] = useIsShowExpandCode()
  const [currentStrategyTabIndex] = useCurrentStrategyTabIndex()
  const { external_code, generation_status } = strategyCode || { external_code: '', generation_status: null }

  // 获取策略配置数据（用于可视化，比解析代码更准确）
  const { strategyDetail } = useCreateStrategyDetail({ strategyId: strategyId || '' })
  const strategyConfig = strategyDetail?.strategy_config
  const { copyWithCustomProcessor } = useCopyContent({
    mode: 'custom',
    customProcessor: extractExecutableCode,
  })

  const isShowText = useMemo(() => {
    return Number(width) >= MEDIA_WIDTHS.width1440
  }, [width])
  // 打字机效果相关状态
  const [isTypewriting, setIsTypewriting] = useIsTypewritingCode()
  const [typewriterCode, setTypewriterCode] = useState('')
  const typewriterIndexRef = useRef(0)
  const targetCodeRef = useRef('')
  // 用于记录 isGeneratingCodeFrontend 是否曾经为 true（用于判断是否应该启动打字机效果）
  const hasBeenGeneratingRef = useRef(false)
  // 用于记录旧的 external_code（用于对比是否有变化）
  const prevExternalCodeRef = useRef<string | null>(null)
  // 用于记录旧的 strategy_id（用于判断是否是同一个策略的代码更新）
  const prevStrategyIdRef = useRef<string | null>(null)

  // 自动滚动相关状态
  const codeContentRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  // 视图模式切换（代码 / 流程图）
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CODE)
  // 是否显示可视化提示（打字机效果结束后显示）
  const [showFlowHint, setShowFlowHint] = useState(false)

  const tabList = useMemo(() => {
    return [
      {
        key: 'code',
        text: <Trans>Code</Trans>,
        icon: isShowText ? <IconBase className='icon-code' /> : null,
        clickCallback: () => setViewMode(ViewMode.CODE),
      },
      {
        key: 'flow',
        text: <Trans>Flow</Trans>,
        icon: isShowText ? <IconBase className='icon-flow' /> : null,
        clickCallback: () => setViewMode(ViewMode.FLOW),
      },
    ]
  }, [isShowText])

  const isGeneratingCodeStatus = useMemo(() => {
    return generation_status === GENERATION_STATUS.GENERATING
  }, [generation_status])

  // 处理滚动事件，检测用户是否手动向上滚动
  const handleScroll = useCallback(() => {
    if (!codeContentRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = codeContentRef.current
    // 计算距离底部的距离
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    // 如果用户向上滚动超过10px，则停止自动滚动
    const isAtBottom = distanceFromBottom < 10
    setShouldAutoScroll(isAtBottom)
  }, [])

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    if (codeContentRef.current && shouldAutoScroll) {
      requestAnimationFrame(() => {
        codeContentRef.current?.scrollTo({
          top: codeContentRef.current.scrollHeight,
          behavior: 'auto',
        })
      })
    }
  }, [shouldAutoScroll])

  // 记录 isGeneratingCodeFrontend 是否曾经为 true
  useEffect(() => {
    if (isGeneratingCodeFrontend) {
      hasBeenGeneratingRef.current = true
    }
  }, [isGeneratingCodeFrontend])

  // 启动打字机效果（与 Summary 组件逻辑一致）
  useEffect(() => {
    if (!external_code || generation_status !== GENERATION_STATUS.COMPLETED) return

    const prevCode = prevExternalCodeRef.current

    // 检查是否需要启动打字机效果
    const shouldStartTypewriter = () => {
      // 如果刷新页面时 isGeneratingCodeFrontend 从未为 true，则直接渲染完整内容
      if (!hasBeenGeneratingRef.current) {
        return false
      }

      // 首次有 external_code 数据，启动打字机
      if (prevCode === null) {
        return true
      }

      // 重新生成代码：external_code 发生变化 且 strategy_id 和上一次相同（确保是同一个策略的代码更新）
      const currentStrategyId = strategyCode?.strategy_id
      const prevStrategyId = prevStrategyIdRef.current
      if (prevCode !== external_code && currentStrategyId && currentStrategyId === prevStrategyId) {
        return true
      }

      return false
    }

    if (shouldStartTypewriter()) {
      // 开始打字机效果
      setIsTypewriting(true)
      setTypewriterCode('')
      typewriterIndexRef.current = 0
      targetCodeRef.current = external_code
    }

    // 更新旧的 external_code 和 strategy_id
    prevExternalCodeRef.current = external_code
    prevStrategyIdRef.current = strategyCode?.strategy_id || null
  }, [external_code, generation_status, strategyCode?.strategy_id, setIsTypewriting])

  // 打字机效果的实现
  useEffect(() => {
    if (!isTypewriting || !targetCodeRef.current) return

    const targetCode = targetCodeRef.current
    const totalLength = targetCode.length

    const intervalId = setInterval(() => {
      typewriterIndexRef.current += TYPEWRITER_CHARS_PER_TICK
      const currentIndex = typewriterIndexRef.current

      if (currentIndex >= totalLength) {
        // 打字机效果完成
        setTypewriterCode(targetCode)
        setIsTypewriting(false)
        clearInterval(intervalId)

        // 显示流程图提示
        setShowFlowHint(true)
        // 8秒后自动隐藏
        setTimeout(() => setShowFlowHint(false), 8000)
      } else {
        setTypewriterCode(targetCode.slice(0, currentIndex))
      }
    }, TYPEWRITER_SPEED)

    return () => {
      clearInterval(intervalId)
    }
  }, [isTypewriting, setIsTypewriting])

  // 监听滚动事件
  useEffect(() => {
    const codeContent = codeContentRef.current
    if (!codeContent) return

    codeContent.addEventListener('scroll', handleScroll)
    return () => {
      codeContent.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // 打字机效果时自动滚动到底部
  useEffect(() => {
    if (isTypewriting && typewriterCode) {
      scrollToBottom()
    }
  }, [isTypewriting, typewriterCode, scrollToBottom])

  // 打字机效果开始时，重置自动滚动状态
  useEffect(() => {
    if (isTypewriting) {
      setShouldAutoScroll(true)
    }
  }, [isTypewriting])

  // 视图模式自动切换逻辑
  // 1. 初始化时：如果有 external_code，直接切换到 Flow
  // 2. 非初始化时：打字机效果期间保持 Code，结束后切换到 Flow
  useEffect(() => {
    // 初始化时（还没有经历过生成过程），如果有 external_code，直接显示 Flow
    if (!hasBeenGeneratingRef.current && external_code && generation_status === GENERATION_STATUS.COMPLETED) {
      setViewMode(ViewMode.FLOW)
      return
    }

    // 非初始化时（经历过生成过程）
    if (hasBeenGeneratingRef.current) {
      // 正在生成或打字机效果中 → 切换到 Code
      if (isGeneratingCodeStatus || isGeneratingCodeFrontend || isTypewriting) {
        setViewMode(ViewMode.CODE)
      }
      // 打字机效果结束后（有代码且已完成）→ 切换到 Flow
      else if (external_code && generation_status === GENERATION_STATUS.COMPLETED) {
        setViewMode(ViewMode.FLOW)
      }
    }
  }, [external_code, generation_status, isGeneratingCodeStatus, isGeneratingCodeFrontend, isTypewriting])

  // 用于记录上一次的 tab index
  const prevTabIndexRef = useRef<STRATEGY_TAB_INDEX | null>(null)

  // 监听 currentStrategyTabIndex 变化
  // 1. 当切换 tab 后，如果正在打字机效果中，停止打字机效果并切换到 flow
  // 2. 切换到 CODE tab 时，如果有 external_code 且已完成，默认显示 flow
  useEffect(() => {
    const prevTabIndex = prevTabIndexRef.current
    prevTabIndexRef.current = currentStrategyTabIndex

    // 首次渲染时不处理
    if (prevTabIndex === null) return

    // 当 tab 发生切换时
    if (prevTabIndex !== currentStrategyTabIndex) {
      // 如果正在打字机效果中，停止打字机并切换到 flow
      if (isTypewriting) {
        // 停止打字机效果，直接显示完整代码
        setIsTypewriting(false)
        setTypewriterCode(external_code || '')
        // 切换到 flow 视图
        setViewMode(ViewMode.FLOW)
        // 隐藏流程图提示
        setShowFlowHint(false)
        return
      }

      // 切换到 CODE tab 时
      if (currentStrategyTabIndex === STRATEGY_TAB_INDEX.CODE) {
        // 如果有 external_code 且 generation_status 是完成状态，默认切换到 flow
        if (external_code && generation_status === GENERATION_STATUS.COMPLETED) {
          setViewMode(ViewMode.FLOW)
        }
      }
    }
  }, [currentStrategyTabIndex, isTypewriting, external_code, generation_status, setIsTypewriting])

  const handleCopyCode = useCallback(() => {
    if (external_code) {
      copyWithCustomProcessor(external_code)
    }
  }, [external_code, copyWithCustomProcessor])

  const handleZoom = useCallback(() => {
    setIsShowExpandCode(!isShowExpandCode)
  }, [isShowExpandCode, setIsShowExpandCode])

  // 是否显示视图切换（代码生成完成且不在打字机效果中）
  const showViewToggle = useMemo(() => {
    return !isGeneratingCodeStatus && !isGeneratingCodeFrontend && !isTypewriting && external_code
  }, [isGeneratingCodeStatus, isGeneratingCodeFrontend, isTypewriting, external_code])
  // 当 generation_status 不是 COMPLETED 时，每5秒轮询一次
  useEffect(() => {
    if (isGeneratingCodeStatus) {
      const intervalId = setInterval(() => {
        refetchStrategyCode()
      }, 5000)

      return () => {
        clearInterval(intervalId)
      }
    }
  }, [isGeneratingCodeStatus, refetchStrategyCode])

  return (
    <CodeWrapper>
      <Header>
        <Left>
          {/* 视图切换 */}
          {showViewToggle && <MoveTabList tabKey={viewMode} gap={20} tabList={tabList} />}
          {!isGeneratingCodeStatus && !isGeneratingCodeFrontend && (
            <>
              <IconBase className='icon-circle-success' />
              <Trans>Your intuition has been translated into code. The matrix is ready. </Trans>
            </>
          )}
        </Left>
        <OperatorWrapper>
          <RegenerateButton $disabled={isGeneratingCodeFrontend} onClick={() => handleGenerateCode(2)}>
            <IconBase className='icon-arrow-loading' />
            {isShowText && <Trans>Regenerate</Trans>}
          </RegenerateButton>
          <CopyButton $disabled={isGeneratingCodeFrontend} onClick={handleCopyCode}>
            <IconBase className='icon-copy' />
            {isShowText && <Trans>Copy</Trans>}
          </CopyButton>
          <ZoomButton onClick={handleZoom}>
            <IconBase className={isShowExpandCode ? 'icon-zoom-out' : 'icon-zoom-in'} />
          </ZoomButton>
        </OperatorWrapper>
      </Header>

      {/* 代码视图 - 使用 CSS 控制显示，避免重新挂载 */}
      <CodeContentWrapper
        ref={codeContentRef}
        $visible={viewMode === ViewMode.CODE}
        style={{ backgroundImage: `url(${codeBg})` }}
        className='scroll-style'
      >
        {isGeneratingCodeStatus ? (
          <TypewriterCursor />
        ) : (
          <MemoizedHighlight className='python'>
            {isTypewriting ? typewriterCode : external_code || ''}
          </MemoizedHighlight>
        )}
      </CodeContentWrapper>

      {/* 流程图视图 - 使用 CSS 控制显示，避免重新挂载 */}
      {strategyConfig && currentStrategyTabIndex === STRATEGY_TAB_INDEX.CODE && viewMode === ViewMode.FLOW && (
        <FlowContentWrapper $visible={viewMode === ViewMode.FLOW}>
          <StrategyCodeVisualizer strategyConfig={strategyConfig} />
        </FlowContentWrapper>
      )}
    </CodeWrapper>
  )
})

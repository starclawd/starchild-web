import { memo, useMemo, useState, useEffect, useRef, useCallback } from 'react'
import styled, { css } from 'styled-components'
import ChainOfThought from './components/ChainOfThought'
import MarketItem from './components/MarketItem'
import SignalAlertItem from './components/SignalAlertItem'
import { useSignalList } from 'store/vaultsdetail/hooks/useSignal'
import { Trans } from '@lingui/react/macro'
import Pending from 'components/Pending'
import { IconBase } from 'components/Icons'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import SignalsTitle from '../../../CreateStrategy/components/StrategyInfo/components/PaperTrading/components/SignalsTitle'
import { useIsShowRestart } from 'store/createstrategy/hooks/useRestart'
const ChatAreaContainer = styled.div<{ $isPaperTrading?: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 12px;
  ${({ $isPaperTrading }) =>
    $isPaperTrading &&
    css`
      width: 300px;
      flex-shrink: 0;
    `}
`

const ChatContent = styled.div<{ $isPaperTrading?: boolean; $isShowRestart: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 8px;
  padding: 40px 20px;
  overflow: auto;
  ${({ $isPaperTrading }) =>
    $isPaperTrading &&
    css`
      padding: 0;
      padding-right: 4px !important;
      height: calc(100% - 48px);
    `}
  ${({ $isShowRestart, $isPaperTrading }) =>
    $isShowRestart &&
    $isPaperTrading &&
    css`
      padding-bottom: 56px;
    `}
`

const SignalProgress = styled.div`
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 4px;
  height: 26px;
  padding: 4px 8px;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.black1000};
  background-color: ${({ theme }) => theme.brand100};
`

const LoadingDots = styled.span`
  display: inline-flex;
  width: 18px;

  @keyframes dot1 {
    0%,
    100% {
      opacity: 0;
    }
    10%,
    90% {
      opacity: 1;
    }
  }

  @keyframes dot2 {
    0%,
    33%,
    100% {
      opacity: 0;
    }
    43%,
    90% {
      opacity: 1;
    }
  }

  @keyframes dot3 {
    0%,
    66%,
    100% {
      opacity: 0;
    }
    76%,
    90% {
      opacity: 1;
    }
  }

  span {
    &:nth-child(1) {
      animation: dot1 1.5s infinite;
    }
    &:nth-child(2) {
      animation: dot2 1.5s infinite;
    }
    &:nth-child(3) {
      animation: dot3 1.5s infinite;
    }
  }
`

const MonitoringProgress = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 4px;
  height: 26px;
  padding: 4px 8px;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.textL2};
  background-color: ${({ theme }) => theme.black600};
`

const StrategyStatus = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 34px;
  gap: 4px;
  padding: 8px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL2};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  background: ${({ theme }) => theme.bgT30};
  .icon-warn {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
`

const VaultChatArea = memo(({ isPaperTrading, strategyId }: { isPaperTrading?: boolean; strategyId: string }) => {
  const isShowRestart = useIsShowRestart()
  const [isShowMonitoringProgress, setIsShowMonitoringProgress] = useState(false)
  const { strategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })
  const { signalList } = useSignalList({ strategyId, mode: isPaperTrading ? 'paper_trading' : 'live' })
  const contentInnerRef = useScrollbarClass<HTMLDivElement>()
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [isUserScrolling, setIsUserScrolling] = useState(false)

  const filteredSignalList = useMemo(() => {
    const sortSignalList = [...signalList]
    sortSignalList.sort((a, b) => a.timestamp - b.timestamp)
    return sortSignalList.filter(
      (signal) =>
        signal.strategy_id === strategyId &&
        ((isPaperTrading && signal.mode === 'paper_trading') || (!isPaperTrading && signal.mode === 'live')),
    )
  }, [signalList, strategyId, isPaperTrading])

  const isPaused = useMemo(() => {
    return strategyDetail?.status === STRATEGY_STATUS.PAUSED
  }, [strategyDetail])

  const isDelisted = useMemo(() => {
    return strategyDetail?.status === STRATEGY_STATUS.DELISTED
  }, [strategyDetail])

  // 用于实际渲染的列表
  const [displaySignalList, setDisplaySignalList] = useState(filteredSignalList)
  // 记录上一次的长度
  const prevLengthRef = useRef(filteredSignalList.length)
  // 定时器引用
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // 保存最新的 filteredSignalList，用于 setTimeout 中获取最新值
  const latestFilteredSignalListRef = useRef(filteredSignalList)
  latestFilteredSignalListRef.current = filteredSignalList

  // 滚动事件处理
  const handleScroll = useCallback(() => {
    if (!contentInnerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = contentInnerRef.current
    // 计算距离底部的距离
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    // 如果用户向上滚动超过10px，则停止自动滚动
    const isAtBottom = distanceFromBottom < 10
    setShouldAutoScroll(isAtBottom)
  }, [contentInnerRef])

  // 滚动到底部
  const scrollToBottom = useCallback(
    (forceScroll = false) => {
      if ((contentInnerRef.current && shouldAutoScroll) || forceScroll) {
        requestAnimationFrame(() => {
          contentInnerRef.current?.scrollTo({
            top: contentInnerRef.current.scrollHeight,
            behavior: 'auto',
          })
        })
      }
    },
    [contentInnerRef, shouldAutoScroll],
  )

  // 监听滚动事件，检测用户是否手动滚动
  useEffect(() => {
    const contentInner = contentInnerRef.current
    if (contentInner) {
      let scrollTimeout: ReturnType<typeof setTimeout>

      const handleScrollStart = () => {
        setIsUserScrolling(true)
        clearTimeout(scrollTimeout)
      }

      const handleScrollEnd = () => {
        scrollTimeout = setTimeout(() => {
          setIsUserScrolling(false)
        }, 150)
      }

      const handleScrollWithDetection = () => {
        handleScrollStart()
        handleScroll()
        handleScrollEnd()
      }

      contentInner.addEventListener('scroll', handleScrollWithDetection)
      return () => {
        contentInner.removeEventListener('scroll', handleScrollWithDetection)
        clearTimeout(scrollTimeout)
      }
    }
    return
  }, [contentInnerRef, handleScroll])

  // 使用 ResizeObserver 监听内容高度变化，自动滚动到底部
  useEffect(() => {
    const contentInner = contentInnerRef.current
    if (!contentInner) return

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        if (shouldAutoScroll && !isUserScrolling) {
          scrollToBottom()
        }
      })
    })

    resizeObserver.observe(contentInner)

    return () => {
      resizeObserver.disconnect()
    }
  }, [contentInnerRef, shouldAutoScroll, scrollToBottom, isUserScrolling])

  // 初始化时滚动到底部
  useEffect(() => {
    if (displaySignalList.length > 0) {
      scrollToBottom(true)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 列表更新时滚动到底部
  useEffect(() => {
    if (shouldAutoScroll && displaySignalList.length > 0) {
      scrollToBottom()
    }
  }, [displaySignalList, shouldAutoScroll, scrollToBottom])

  useEffect(() => {
    const prevLength = prevLengthRef.current
    const currentLength = filteredSignalList.length

    // 当长度从非0增加时
    if (prevLength > 0 && currentLength > prevLength) {
      // 显示 MonitoringProgress
      setIsShowMonitoringProgress(true)

      // 清除之前的定时器（如果3s内又有新数据，重置计时）
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      // 3秒后更新显示列表（使用 ref 获取最新值）
      timerRef.current = setTimeout(() => {
        setDisplaySignalList(latestFilteredSignalListRef.current)
        setIsShowMonitoringProgress(false)
        timerRef.current = null
      }, 3000)
    } else if (currentLength !== prevLength && !timerRef.current) {
      // 如果没有正在等待的定时器，直接同步更新
      setDisplaySignalList(filteredSignalList)
    }

    prevLengthRef.current = currentLength

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [filteredSignalList])

  return (
    <ChatAreaContainer $isPaperTrading={isPaperTrading}>
      {isPaperTrading && <SignalsTitle />}
      <ChatContent
        $isShowRestart={!!(isShowRestart && isPaperTrading)}
        ref={contentInnerRef as any}
        $isPaperTrading={isPaperTrading}
        className='scroll-style'
      >
        {displaySignalList.length > 0 &&
          displaySignalList.map((signal, index) => {
            const { type, signal_id, decision_id } = signal
            if (type === 'signal') {
              return <SignalAlertItem key={signal_id} signal={signal} />
            }
            if (type === 'thought') {
              return <ChainOfThought key={`${type}-${decision_id}`} thought={signal} />
            }
            if (type === 'decision') {
              return <MarketItem key={`${type}-${decision_id}`} decision={signal} />
            }
          })}
        {isShowMonitoringProgress ? (
          <MonitoringProgress>
            <Pending />
            <span>
              <Trans>Monitoring in progress...</Trans>
            </span>
          </MonitoringProgress>
        ) : (
          <SignalProgress>
            <IconBase className='icon-star' />
            <span>
              <Trans>AI reasoning in progress</Trans>
              <LoadingDots>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </LoadingDots>
            </span>
          </SignalProgress>
        )}
        {(isPaused || isDelisted) && (
          <StrategyStatus>
            <IconBase className='icon-warn' />
            <span>
              {isPaused ? <Trans>The strategy has been paused.</Trans> : <Trans>The strategy has been delisted.</Trans>}
            </span>
          </StrategyStatus>
        )}
      </ChatContent>
    </ChatAreaContainer>
  )
})

VaultChatArea.displayName = 'VaultChatArea'

export default VaultChatArea

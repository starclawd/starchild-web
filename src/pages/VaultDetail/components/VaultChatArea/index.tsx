import { memo, useMemo, useState, useEffect, useRef } from 'react'
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
import { ButtonBorder } from 'components/Button'
const ChatAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const ChatContent = styled.div<{ $isPaperTrading?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 8px;
  padding: 40px 20px;
  ${({ $isPaperTrading }) =>
    $isPaperTrading &&
    css`
      padding: 0;
      padding-right: 4px !important;
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
  const [isShowMonitoringProgress, setIsShowMonitoringProgress] = useState(false)
  const { strategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })
  const { vaultSignalList } = useSignalList({ strategyId })
  const filteredSignalList = useMemo(() => {
    return vaultSignalList.filter((signal) => signal.strategy_id === strategyId)
  }, [vaultSignalList, strategyId])

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
    <ChatAreaContainer>
      <ChatContent $isPaperTrading={isPaperTrading} className='scroll-style'>
        {(isPaused || isDelisted) && (
          <StrategyStatus>
            <IconBase className='icon-warn' />
            <span>
              {isPaused ? <Trans>The strategy has been paused.</Trans> : <Trans>The strategy has been delisted.</Trans>}
            </span>
          </StrategyStatus>
        )}
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
              <Trans>AI reasoning in progress...</Trans>
            </span>
          </SignalProgress>
        )}
        {displaySignalList.length > 0 &&
          displaySignalList.map((signal) => {
            const { type, signal_id } = signal
            if (type === 'signal') {
              return <SignalAlertItem key={signal_id} signal={signal} />
            }
            if (type === 'thought') {
              return <ChainOfThought key={signal_id} thought={signal} />
            }
            if (type === 'decision') {
              return <MarketItem key={signal_id} decision={signal} />
            }
          })}
      </ChatContent>
    </ChatAreaContainer>
  )
})

VaultChatArea.displayName = 'VaultChatArea'

export default VaultChatArea

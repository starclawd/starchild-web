import dayjs from 'dayjs'
import { memo, useMemo, useState, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import ChainOfThought from './components/ChainOfThought'
import MarketItem from './components/MarketItem'
import SignalAlertItem from './components/SignalAlertItem'
import { useSignalList } from 'store/vaultsdetail/hooks/useSignal'
import { usePaperTradingPublic } from 'store/vaultsdetail/hooks/usePaperTradingPublic'
import MonitoringProgress from './components/MonitoringProgress'
import ResponseProgress from './components/ResponseProgress'
import PaperTradingStatus from './components/PaperTradingStatus'
import { PAPER_TRADING_STATUS } from 'store/createstrategy/createstrategy'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useTimezone } from 'store/timezonecache/hooks'
import { SIGNAL_TYPE } from 'api/strategy'
import LogItem from './components/LogItem'
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

const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  flex-shrink: 0;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid ${({ theme }) => theme.black800};
`

const ChatContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
`

const SignalList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 60px);
  gap: 8px;
  padding: 20px;
`

const CombinedSignalItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.black800};
  &:last-child {
    border-bottom: none;
  }
`

const Time = styled.div`
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  color: ${({ theme }) => theme.black300};
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`

const VaultChatArea = memo(() => {
  const [timezone] = useTimezone()
  const { strategyId } = useParsedQueryString()
  const [isShowMonitoringProgress, setIsShowMonitoringProgress] = useState(false)
  const { signalList } = useSignalList({ strategyId: strategyId || '' })
  const { paperTradingPublicData } = usePaperTradingPublic({ strategyId: strategyId || '' })
  const paperTradingStatus = useMemo(() => {
    return paperTradingPublicData?.status
  }, [paperTradingPublicData])
  const isShowPaperTradingStatus = useMemo(() => {
    return (
      paperTradingStatus === PAPER_TRADING_STATUS.PAUSED ||
      paperTradingStatus === PAPER_TRADING_STATUS.SUSPENDED ||
      paperTradingStatus === PAPER_TRADING_STATUS.TERMINATED
    )
  }, [paperTradingStatus])
  const filteredSignalList = useMemo(() => {
    const sortSignalList = [...signalList]
    sortSignalList.sort((a, b) => b.timestamp - a.timestamp)
    return sortSignalList.filter((signal) => signal.strategy_id === strategyId)
  }, [signalList, strategyId])

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
    <ChatAreaContainer className='chat-area-container'>
      <ChatContent>
        <TopContent>{isShowMonitoringProgress ? <MonitoringProgress /> : <ResponseProgress />}</TopContent>
        {displaySignalList.length > 0 && (
          <SignalList className='scroll-style'>
            {displaySignalList.map((data, index) => {
              if (data.type === SIGNAL_TYPE.LOG) {
                return <LogItem key={data.decision_id} log={data} />
              }
              const { decision, timestamp, thought, signal, signal_event_id, decision_id, deployment_id } = data
              return (
                <CombinedSignalItem key={signal_event_id || decision_id || deployment_id}>
                  <Time>{dayjs.tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')}</Time>
                  <Content>
                    <SignalAlertItem signal={signal} />
                    <MarketItem decision={decision} />
                    <ChainOfThought thought={thought} />
                  </Content>
                </CombinedSignalItem>
              )
            })}
          </SignalList>
        )}
      </ChatContent>
    </ChatAreaContainer>
  )
})

VaultChatArea.displayName = 'VaultChatArea'

export default VaultChatArea

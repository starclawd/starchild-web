import { useIsBinanceSupport, useIsGeneratingCode, useIsRunningBacktestAgent } from 'store/agentdetail/hooks'
import styled, { css } from 'styled-components'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { useMemo } from 'react'
import { vm } from 'pages/helper'
import { AgentDetailDataType, BACKTEST_STATUS } from 'store/agentdetail/agentdetail'
import { BacktestDataType } from 'store/agentdetail/agentdetail'
import Pending from 'components/Pending'
import VolumeChart from 'pages/AgentDetail/components/Preview/components/VolumeChart'

const BacktestViewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  height: fit-content;
  margin-top: 20px;
  white-space: pre-wrap;
  .chart-wrapper {
    margin-bottom: 20px;
  }
  .data-list-wrapper {
    margin-bottom: 12px;
  }
  .volume-chart-wrapper {
    margin-bottom: 20px;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      .chart-wrapper {
        margin-bottom: ${vm(20)};
      }
      .data-list-wrapper {
        margin-bottom: ${vm(20)};
      }
      .volume-chart-wrapper {
        margin-bottom: ${vm(20)};
      }
    `}
`

const ErrorDisplay = styled.pre`
  padding: 20px;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: ${({ theme }) => theme.black100};
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)};
      font-size: ${vm(12)};
    `}
`

// 简单格式化错误信息
const formatErrorForDisplay = (message: string) => {
  try {
    if (!message || typeof message !== 'string') return ''
    // 查找 JSON 部分
    const jsonStart = message.indexOf('{')
    if (jsonStart === -1) return message

    const textPart = message.substring(0, jsonStart).trim()
    const jsonPart = message.substring(jsonStart)

    // 尝试格式化 JSON
    try {
      const parsed = JSON.parse(jsonPart)
      const formattedJson = JSON.stringify(parsed, null, 2)
      return textPart + '\n\n' + formattedJson
    } catch {
      return message
    }
  } catch {
    return message
  }
}

export default function BacktestView({
  agentDetailData,
  backtestData,
}: {
  agentDetailData: AgentDetailDataType
  backtestData: BacktestDataType
}) {
  const { symbol, status, error_msg } = backtestData
  const previewWrapperRef = useScrollbarClass<HTMLDivElement>()
  const isRunningBacktestAgent = useIsRunningBacktestAgent(agentDetailData, backtestData)
  const isBinanceSupport = useIsBinanceSupport(backtestData)

  const propSymbol = useMemo(() => {
    return symbol?.toUpperCase().replace('USDT', '') || ''
  }, [symbol])

  if (isRunningBacktestAgent) {
    return (
      <BacktestViewWrapper>
        <Pending isNotButtonLoading />
      </BacktestViewWrapper>
    )
  }
  if (status === BACKTEST_STATUS.FAILED) {
    return (
      <BacktestViewWrapper className='scroll-style' ref={previewWrapperRef as any}>
        <ErrorDisplay>{formatErrorForDisplay(error_msg)}</ErrorDisplay>
      </BacktestViewWrapper>
    )
  }
  return (
    <BacktestViewWrapper className='scroll-style' ref={previewWrapperRef as any}>
      <VolumeChart symbol={propSymbol} isBinanceSupport={isBinanceSupport} backtestData={backtestData} />
    </BacktestViewWrapper>
  )
}

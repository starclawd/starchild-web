import { Trans } from '@lingui/react/macro'
import { memo, useMemo } from 'react'
import { StrategyBacktestDataType } from 'store/createstrategy/createstrategy'
import styled from 'styled-components'
import { formatPercent } from 'utils/format'

// SSE 流式获取时的 parameters 类型
export interface StreamingParamsType {
  platform?: string
  symbols?: string[]
  timeframe?: string
  start_date?: string
  end_date?: string
  period?: string
  initial_capital?: number
  position_size?: number
  leverage?: number
  max_leverage?: number
  taker_fee?: number
  maker_fee?: number
  slippage?: number
  data_source?: string
}

const ParamsContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Title = styled.div`
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black100};
`

const List = styled.div`
  display: flex;
  flex-direction: column;
`

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black300};
`

export default memo(function ParamsContent({
  strategyBacktestData,
  streamingParams,
}: {
  strategyBacktestData?: StrategyBacktestDataType | null
  streamingParams?: StreamingParamsType | null
}) {
  const paramsList = useMemo(() => {
    // 优先使用 strategyBacktestData 中的 params，没有则使用 streamingParams
    const params = strategyBacktestData?.params || streamingParams
    const list: {
      title: React.ReactNode
      content: string | number
    }[] = []
    if (params) {
      if (params.platform) {
        list.push({
          title: <Trans>Platform</Trans>,
          content: params.platform,
        })
      }
      if (params.symbols) {
        list.push({
          title: <Trans>Symbols</Trans>,
          content: params.symbols.join(','),
        })
      }
      if (params.timeframe) {
        list.push({
          title: <Trans>Timeframe</Trans>,
          content: params.timeframe,
        })
      }
      if (params.period) {
        list.push({
          title: <Trans>Period</Trans>,
          content: params.period,
        })
      }
      if (params.initial_capital) {
        list.push({
          title: <Trans>Initial Capital</Trans>,
          content: params.initial_capital,
        })
      }
      if (params.position_size) {
        list.push({
          title: <Trans>Position Size</Trans>,
          content: formatPercent({ value: params.position_size }),
        })
      }
      if (params.leverage) {
        list.push({
          title: <Trans>Leverage</Trans>,
          content: `${params.leverage}x${params.max_leverage ? `(Max ${params.max_leverage}x)` : ''}`,
        })
      }
      if (params.taker_fee) {
        list.push({
          title: <Trans>Fees (Taker)</Trans>,
          content: formatPercent({ value: params.taker_fee, precision: 3 }),
        })
      }
      if (params.maker_fee) {
        list.push({
          title: <Trans>Fees (Maker)</Trans>,
          content: formatPercent({ value: params.maker_fee, precision: 3 }),
        })
      }
      if (params.slippage) {
        list.push({
          title: <Trans>Slippage</Trans>,
          content: formatPercent({ value: params.slippage }),
        })
      }
      if (params.data_source) {
        list.push({
          title: <Trans>Data Source</Trans>,
          content: params.data_source,
        })
      }
    }
    return list
  }, [strategyBacktestData, streamingParams])

  return (
    <ParamsContentWrapper>
      <Title>
        <Trans>Parameters</Trans>
      </Title>
      <List>
        {paramsList.map((item, index) => (
          <ItemWrapper key={index}>
            <span>{item.title}:</span>
            <span>{item.content}</span>
          </ItemWrapper>
        ))}
      </List>
    </ParamsContentWrapper>
  )
})

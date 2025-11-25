import { memo } from 'react'
import styled from 'styled-components'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { VaultPerformanceChart } from 'api/vaults'

interface MiniPnLChartProps {
  data: VaultPerformanceChart[]
  isPositive?: boolean
  width?: number
  height?: number
}

const ChartContainer = styled.div<{ $width: number; $height: number }>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  position: relative;
`

const MiniPnLChart = memo<MiniPnLChartProps>(({ data, isPositive, width = 80, height = 30 }) => {
  if (!data || data.length === 0) {
    return (
      <ChartContainer $width={width} $height={height}>
        <svg width={width} height={height}>
          <line x1='0' y1={height / 2} x2={width} y2={height / 2} stroke='#666' strokeWidth='1' strokeDasharray='2,2' />
        </svg>
      </ChartContainer>
    )
  }

  // 确定颜色
  const color = isPositive ? '#22c55e' : '#ef4444'
  const fillColor = isPositive ? 'url(#colorPositive)' : 'url(#colorNegative)'

  return (
    <ChartContainer $width={width} $height={height}>
      <ResponsiveContainer width={width} height={height}>
        <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id='colorPositive' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#22c55e' stopOpacity={0.3} />
              <stop offset='95%' stopColor='#22c55e' stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id='colorNegative' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#ef4444' stopOpacity={0.3} />
              <stop offset='95%' stopColor='#ef4444' stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area
            type='monotone'
            dataKey='value'
            stroke={color}
            strokeWidth={1.5}
            fill={fillColor}
            fillOpacity={1}
            connectNulls={false}
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
})

MiniPnLChart.displayName = 'MiniPnLChart'

export default MiniPnLChart

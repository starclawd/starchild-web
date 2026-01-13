import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import { Radar } from 'react-chartjs-2'
import { vm } from 'pages/helper'
import { centerSquarePlugin } from '../../utils/centerSquarePlugin'
import { useRadarOptions } from '../../hooks/useRadarOptions'

// 注册 Chart.js 雷达图所需组件和插件
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, centerSquarePlugin)

const RadarChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 170px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(170)};
    `}
`

const ChartArea = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`

interface RadarDataItem {
  label: string
  value: number
}

interface PureRadarChartProps {
  /** 雷达图数据，每个维度包含标签和数值(0-100) */
  data: RadarDataItem[]
  className?: string
}

/**
 * 纯雷达图组件
 * 展示策略在各个维度的评分，仅包含图表部分
 */
const PureRadarChart = memo<PureRadarChartProps>(({ data, className }) => {
  const { radarData, radarOptions } = useRadarOptions(data)

  return (
    <RadarChartContainer className={className}>
      <ChartArea>
        <Radar data={radarData} options={radarOptions} />
      </ChartArea>
    </RadarChartContainer>
  )
})

PureRadarChart.displayName = 'PureRadarChart'

export default PureRadarChart

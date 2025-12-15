import { formatNumber } from 'utils/format'
import { t } from '@lingui/core/macro'

export interface ChartTooltipConfig {
  theme: any
  getChartType?: () => string
  getDisplayValue?: (value: number) => string
  getTitleByChartType?: (chartType: string) => string
}

/**
 * 创建Chart.js自定义tooltip配置
 * @param config - tooltip配置选项
 * @returns Chart.js tooltip配置对象
 */
export const createChartTooltipConfig = (config: ChartTooltipConfig) => {
  const { theme, getChartType, getDisplayValue, getTitleByChartType } = config

  const defaultGetDisplayValue = (value: number) => `$${formatNumber(value)}`

  const defaultGetTitleByChartType = (chartType: string) => {
    switch (chartType) {
      case 'TVL':
        return t`Vault TVL:`
      case 'PNL':
        return t`Vault PnL:`
      case 'EQUITY':
        return t`Strategy Equity:`
      default:
        return 'Vault Value:'
    }
  }

  return {
    enabled: false, // 禁用默认tooltip，使用external
    external: (context: any) => {
      // 创建自定义tooltip
      const { chart, tooltip } = context
      const canvas = chart.canvas

      // 获取或创建tooltip元素
      let tooltipEl = document.getElementById('chartjs-tooltip')

      if (!tooltipEl) {
        tooltipEl = document.createElement('div')
        tooltipEl.id = 'chartjs-tooltip'
        tooltipEl.style.cssText = `
          position: absolute;
          background: ${theme.black600};
          border-radius: 4px;
          color: ${theme.textL1};
          font-size: 12px;
          padding: 4px 8px;
          pointer-events: none;
          z-index: 1000;
        `
        document.body.appendChild(tooltipEl)
      }

      // 如果tooltip应该隐藏
      if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = '0'
        return
      }

      // 获取tooltip数据
      if (tooltip.body && tooltip.dataPoints && tooltip.dataPoints.length > 0) {
        const dataPoint = tooltip.dataPoints[0]

        // 获取数据
        const value = dataPoint.parsed.y
        const timestamp = dataPoint.parsed.x

        const formattedValue = getDisplayValue ? getDisplayValue(value) : defaultGetDisplayValue(value)

        const date = new Date(timestamp).toISOString().split('T')[0]

        const chartType = getChartType ? getChartType() : 'default'
        const title = getTitleByChartType ? getTitleByChartType(chartType) : defaultGetTitleByChartType(chartType)

        // 创建HTML内容
        tooltipEl.innerHTML = `
          <div style="margin-bottom: 4px;">
            <span style="color: ${theme.textL3}; font-size: 12px;">${title}</span>
            <span style="color: ${theme.textL1}; font-size: 12px; font-weight: 500; margin-left: 4px;">${formattedValue}</span>
          </div>
          <div style="color: ${theme.textL3}; font-size: 11px;">${date}</div>
        `
      }

      // 计算位置
      const canvasRect = canvas.getBoundingClientRect()

      // 设置位置（在数据点右上方）
      tooltipEl.style.opacity = '1'
      tooltipEl.style.left = canvasRect.left + window.pageXOffset + tooltip.caretX + 15 + 'px'
      tooltipEl.style.top = canvasRect.top + window.pageYOffset + tooltip.caretY - 60 + 'px'
    },
  }
}

import { formatNumber } from 'utils/format'
import { t } from '@lingui/core/macro'
import { msg } from '@lingui/core/macro'
import { useLingui } from '@lingui/react/macro'
export interface ChartTooltipConfig {
  theme: any
  getChartType?: () => string
  getDisplayValue?: (value: number) => string
  getTitleByChartType?: (chartType: string) => string
  showStrategyName?: boolean
  getStrategyName?: () => string | undefined
}

/**
 * 创建Chart.js自定义tooltip配置
 * @param config - tooltip配置选项
 * @returns Chart.js tooltip配置对象
 */
export const createChartTooltipConfig = (config: ChartTooltipConfig) => {
  const { theme, getChartType, getDisplayValue, getTitleByChartType, showStrategyName, getStrategyName } = config
  const { t } = useLingui()
  const defaultGetDisplayValue = (value: number) => formatNumber(value, { showDollar: true })

  const defaultGetTitleByChartType = (chartType: string) => {
    switch (chartType) {
      case 'TVL':
        return t(msg`TVL`)
      case 'PNL':
        return t(msg`PnL`)
      case 'EQUITY':
        return t(msg`Equity`)
      default:
        return t(msg`Value`)
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
          color: ${theme.black0};
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

        // 获取实时的策略名称
        const currentStrategyName = showStrategyName && getStrategyName ? getStrategyName() : undefined

        // 创建HTML内容
        const strategyNameHtml =
          showStrategyName && currentStrategyName
            ? `
          <div style="margin-bottom: 4px; color: ${theme.black0}; font-size: 12px; font-weight: 500;">
            ${currentStrategyName}
          </div>
        `
            : ''

        tooltipEl.innerHTML = `
          ${strategyNameHtml}
          <div style="margin-bottom: 4px;">
            <span style="color: ${theme.black200}; font-size: 12px;">${title}:</span>
            <span style="color: ${theme.black0}; font-size: 12px; font-weight: 500; margin-left: 4px;">${formattedValue}</span>
          </div>
          <div style="color: ${theme.black200}; font-size: 11px;">${date}</div>
        `
      }

      // 计算位置
      const canvasRect = canvas.getBoundingClientRect()

      // 临时显示tooltip以获取尺寸
      tooltipEl.style.opacity = '1'
      tooltipEl.style.visibility = 'hidden'
      tooltipEl.style.left = '0px'
      tooltipEl.style.top = '0px'

      const tooltipRect = tooltipEl.getBoundingClientRect()
      const tooltipWidth = tooltipRect.width

      // 计算基础位置
      const pointX = canvasRect.left + window.pageXOffset + tooltip.caretX
      const pointY = canvasRect.top + window.pageYOffset + tooltip.caretY

      // 默认显示在右侧
      let left = pointX + 15
      const top = pointY - 60

      // 检查是否超出右边界，如果是则显示在左侧
      if (left + tooltipWidth > window.innerWidth) {
        left = pointX - tooltipWidth - 15
      }

      // 应用位置
      tooltipEl.style.visibility = 'visible'
      tooltipEl.style.left = left + 'px'
      tooltipEl.style.top = top + 'px'
    },
  }
}

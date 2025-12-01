import { useEffect } from 'react'
import { Chart as ChartJS } from 'chart.js'
import { VaultDetailChartData } from '../vaultsdetail.d'

export type VaultCrosshairData = {
  x: number
  y: number
  dataIndex: number
  xLabel: string
  value: number
  formattedValue: string
}

export const useVaultCrosshair = (
  chartRef: React.RefObject<ChartJS<'line', number[], string> | null>,
  chartData: VaultDetailChartData,
  setCrosshairData: (data: VaultCrosshairData | null) => void,
) => {
  useEffect(() => {
    // 由于插件已经通过 plugins 属性传递给 Line 组件，不需要全局注册

    const chart = chartRef.current
    if (!chart || !chart.canvas || !chartData.hasData) return

    const canvas = chart.canvas

    const handleCanvasMouseMove = (e: MouseEvent) => {
      // 添加防护检查，确保chart和canvas仍然有效
      if (!chartRef.current || !chartRef.current.canvas) return

      const currentChart = chartRef.current
      const currentCanvas = currentChart.canvas

      const rect = currentCanvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (isNaN(x) || isNaN(y)) return

      // 检查图表scales是否存在
      if (!currentChart.scales || !currentChart.scales.x || !currentChart.scales.y) return

      // 获取数据点索引
      const dataX = currentChart.scales.x.getValueForPixel(x)

      if (dataX !== undefined && dataX >= 0 && dataX < chartData.data.length) {
        const dataIndex = Math.round(dataX)
        const currentDataPoint = chartData.data[dataIndex]

        if (!currentDataPoint) return

        // 计算Y轴位置
        const yValue = currentChart.scales.y.getPixelForValue(currentDataPoint.value)

        // 格式化显示值
        const value = currentDataPoint.value
        const formattedValue =
          Math.abs(value) >= 1000000
            ? `$${(value / 1000000).toFixed(2)}M`
            : Math.abs(value) >= 1000
              ? `$${(value / 1000).toFixed(2)}K`
              : `$${value.toFixed(2)}`

        // 格式化时间标签
        const date = new Date(currentDataPoint.timestamp)
        const xLabel = date.toLocaleDateString('zh-CN', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })

        // 设置十字线数据到图表实例
        ;(currentChart as any).vaultCrosshair = {
          x,
          y: yValue,
          value,
          draw: true,
        }

        // 更新外部状态
        setCrosshairData({
          x,
          y: yValue,
          dataIndex,
          xLabel,
          value,
          formattedValue,
        })

        // 更新图表（不触发动画）
        try {
          currentChart.update('none')
        } catch (error) {
          // 忽略更新错误，可能图表已被销毁
          console.warn('Chart update error:', error)
        }
      }
    }

    const handleCanvasMouseLeave = () => {
      // 添加防护检查，确保chart仍然有效
      if (!chartRef.current) return

      const currentChart = chartRef.current
      ;(currentChart as any).vaultCrosshair = { draw: false }
      setCrosshairData(null)

      try {
        currentChart.update('none')
      } catch (error) {
        // 忽略更新错误，可能图表已被销毁
        console.warn('Chart update error:', error)
      }
    }

    // 添加事件监听器
    canvas.addEventListener('mousemove', handleCanvasMouseMove)
    canvas.addEventListener('mouseleave', handleCanvasMouseLeave)

    // 清理函数
    return () => {
      // 确保canvas仍然存在才移除事件监听器
      if (canvas && canvas.removeEventListener) {
        canvas.removeEventListener('mousemove', handleCanvasMouseMove)
        canvas.removeEventListener('mouseleave', handleCanvasMouseLeave)
      }
    }
  }, [chartRef, chartData, setCrosshairData])

  // 插件通过 Line 组件的 plugins 属性传递，无需手动清理
}

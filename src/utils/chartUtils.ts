import { UTCTimestamp } from 'lightweight-charts'

/**
 * 自定义时间格式化器，根据用户时区显示时间
 * @param time - UTC时间戳
 * @param timezone - 时区字符串，例如 'Asia/Shanghai'
 * @returns 格式化后的时间字符串
 */
export const createCustomTimeFormatter = (timezone?: string) => {
  return (time: UTCTimestamp) => {
    try {
      // 将时间戳转换为毫秒
      const date = new Date(time * 1000)

      // 如果没有设置时区，使用UTC
      if (!timezone) {
        return date.toISOString().slice(0, 16).replace('T', ' ') // 返回 YYYY-MM-DD HH:MM 格式
      }

      // 使用用户设置的时区格式化时间，显示完整的日期和时间
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })

      return formatter.format(date).replace(',', '') // 移除逗号，格式如：12/25/2024 14:30
    } catch (error) {
      console.error('time formatter error:', error)
      // 出错时返回UTC时间
      const date = new Date(time * 1000)
      return date.toISOString().slice(0, 16).replace('T', ' ')
    }
  }
}

/**
 * 创建图表窗口大小调整处理器
 * @param chartContainerRef - 图表容器引用
 * @param chartRef - 图表实例引用
 * @returns 处理窗口大小调整的函数
 */
export const createChartResizeHandler = (
  chartContainerRef: React.RefObject<HTMLDivElement | null>,
  chartRef: React.RefObject<any>,
) => {
  return () => {
    if (chartContainerRef.current && chartRef.current) {
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      })
    }
  }
}

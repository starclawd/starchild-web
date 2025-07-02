export const crosshairPlugin = {
  id: 'crosshair',
  afterDatasetsDraw: (chart: any) => {
    if (chart.crosshair && chart.crosshair.draw) {
      const { ctx, chartArea } = chart
      const { x, equityY, holdY, equityValue, holdValue } = chart.crosshair
      
      ctx.save()
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.54)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      
      if (equityY !== undefined || holdY !== undefined) {
        ctx.beginPath()
        ctx.moveTo(x, chartArea.top)
        ctx.lineTo(x, chartArea.bottom)
        ctx.stroke()
      }
      
      if (equityY !== undefined) {
        ctx.beginPath()
        ctx.moveTo(chartArea.left, equityY)
        ctx.lineTo(chartArea.right, equityY)
        ctx.stroke()
      }
      
      if (holdY !== undefined) {
        ctx.beginPath()
        ctx.moveTo(chartArea.left, holdY)
        ctx.lineTo(chartArea.right, holdY)
        ctx.stroke()
      }
      
      ctx.setLineDash([])
      
      if (equityY !== undefined) {
        ctx.beginPath()
        ctx.arc(x, equityY, 3, 0, 2 * Math.PI)
        ctx.fillStyle = '#000'
        ctx.fill()
        const dataIndex = Math.round(chart.scales.x.getValueForPixel(x))
        const equityRelativeValue = chart.data.datasets[0]?.data[dataIndex] || 0
        ctx.strokeStyle = equityRelativeValue >= 0 ? '#00C57E' : '#FF447C'
        ctx.lineWidth = 2
        ctx.stroke()
      }
      
      if (holdY !== undefined) {
        ctx.beginPath()
        ctx.arc(x, holdY, 3, 0, 2 * Math.PI)
        ctx.fillStyle = '#000'
        ctx.fill()
        ctx.strokeStyle = '#335FFC'
        ctx.lineWidth = 2
        ctx.stroke()
      }
      
      ctx.restore()
    }
  }
}
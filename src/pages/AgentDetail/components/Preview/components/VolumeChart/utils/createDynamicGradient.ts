export const createDynamicGradient = (ctx: CanvasRenderingContext2D, chartArea: any, yScale: any) => {
  const baselinePixel = yScale.getPixelForValue(0)

  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)

  const baselinePosition = (baselinePixel - chartArea.top) / (chartArea.bottom - chartArea.top)
  const clampedBaselinePosition = Math.max(0, Math.min(1, baselinePosition))

  if (clampedBaselinePosition > 0) {
    gradient.addColorStop(0, 'rgba(0, 197, 126, 0.36)')
    gradient.addColorStop(clampedBaselinePosition, 'rgba(0, 197, 126, 0)')
  }

  if (clampedBaselinePosition < 1) {
    gradient.addColorStop(clampedBaselinePosition, 'rgba(255, 68, 124, 0)')
    gradient.addColorStop(1, 'rgba(255, 68, 124, 0.36)')
  }

  return gradient
}

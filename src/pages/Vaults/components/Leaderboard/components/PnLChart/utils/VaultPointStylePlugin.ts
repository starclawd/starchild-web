/**
 * Vault图表点样式绘制插件
 * 用于在图表最后一个点直接绘制自定义图标或头像
 */

import { useMemo } from 'react'

export interface VaultData {
  vaultId?: string
  type?: 'community' | 'protocol'
  creatorAvatar?: string
  color?: string
}

export interface VaultPointStylePluginConfig {
  chartData: VaultData[]
  strategyIconNameMapping: Record<string, string>
}

/**
 * 在指定位置绘制vault图标或头像
 */
const drawVaultIcon = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  datasetIndex: number,
  config: VaultPointStylePluginConfig,
  borderColor: string,
  value?: number,
) => {
  const { chartData, strategyIconNameMapping } = config
  const radius = 12

  // 绘制彩色背景圆形（像图片中的橙色背景）
  ctx.fillStyle = borderColor
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.fill()

  // 获取vault信息
  const vaultData = chartData[datasetIndex]
  const vaultId = vaultData?.vaultId
  const vaultType = vaultData?.type
  const creatorAvatar = vaultData?.creatorAvatar

  if (vaultType === 'community' && creatorAvatar) {
    // Community Vault: 渲染创建者头像
    renderCreatorAvatar(ctx, creatorAvatar, x, y)
  } else {
    // Protocol Vault: 使用icon font渲染图标
    renderProtocolIcon(ctx, vaultId, strategyIconNameMapping, borderColor, x, y)
  }

  // 在图标右侧8px处绘制数值
  if (value !== undefined) {
    renderValueText(ctx, value, borderColor, x + radius + 8, y)
  }
}

/**
 * 渲染创建者头像
 */
const renderCreatorAvatar = (ctx: CanvasRenderingContext2D, avatarUrl: string, x: number, y: number) => {
  const img = new Image()
  img.onload = () => {
    // 绘制圆形头像
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, 14, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(img, x - 14, y - 14, 28, 28)
    ctx.restore()
  }
  img.src = avatarUrl
}

/**
 * 渲染协议图标
 */
const renderProtocolIcon = (
  ctx: CanvasRenderingContext2D,
  vaultId: string | undefined,
  strategyIconNameMapping: Record<string, string>,
  borderColor: string,
  x: number,
  y: number,
) => {
  if (!vaultId) {
    renderFallbackIcon(ctx, x, y)
    return
  }

  const iconClassName = strategyIconNameMapping[vaultId]
  if (!iconClassName) {
    renderFallbackIcon(ctx, x, y)
    return
  }

  // 创建临时元素来获取icon font的字符
  const tempElement = document.createElement('i')
  tempElement.className = iconClassName
  tempElement.style.position = 'absolute'
  tempElement.style.left = '-9999px'
  tempElement.style.fontSize = '16px'
  document.body.appendChild(tempElement)

  try {
    // 获取计算样式中的content值 (icon font的unicode字符)
    const computedStyle = window.getComputedStyle(tempElement, ':before')
    const iconContent = computedStyle.getPropertyValue('content')

    // 绘制白色icon font字符
    ctx.fillStyle = '#fff' // 改为白色图标
    ctx.font = '16px "icomoon"'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // 去除引号并渲染字符
    const iconChar = iconContent.replace(/['"]/g, '')
    if (iconChar && iconChar !== 'none') {
      ctx.fillText(iconChar, x, y)
    } else {
      renderFallbackIcon(ctx, x, y)
    }
  } finally {
    // 清理临时元素
    document.body.removeChild(tempElement)
  }
}

/**
 * 渲染回退图标（简单圆点）
 */
const renderFallbackIcon = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = '#fff' // 白色圆点
  ctx.beginPath()
  ctx.arc(x, y, 4, 0, 2 * Math.PI)
  ctx.fill()
}

/**
 * 渲染数值文字
 */
const renderValueText = (ctx: CanvasRenderingContext2D, value: number, color: string, x: number, y: number) => {
  // 格式化数值，添加千分位分隔符
  const valueText = `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

  // 直接绘制橙色文字，不需要背景
  ctx.fillStyle = color
  ctx.font = '12px Arial, sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(valueText, x, y)
}

/**
 * Vault点绘制插件Hook
 */
export const useVaultPointDrawPlugin = (config: VaultPointStylePluginConfig) => {
  return useMemo(
    () => ({
      id: 'vaultPointDraw',
      afterDraw(chart: any) {
        const { ctx, data } = chart

        // 遍历每个数据集
        data.datasets.forEach((dataset: any, datasetIndex: number) => {
          const meta = chart.getDatasetMeta(datasetIndex)

          if (meta.hidden || !dataset.data || dataset.data.length === 0) {
            return
          }

          // 获取最后一个点的元素
          const lastPointIndex = dataset.data.length - 1
          const lastPointElement = meta.data[lastPointIndex]

          if (lastPointElement) {
            const { x, y } = lastPointElement.getProps(['x', 'y'])

            // 获取最后一个点的数值
            const lastPointValue = dataset.data[lastPointIndex]

            // 保存画布状态
            ctx.save()

            // 在最后一个点的位置绘制图标和数值
            drawVaultIcon(ctx, x, y, datasetIndex, config, dataset.borderColor, lastPointValue)

            // 恢复画布状态
            ctx.restore()
          }
        })
      },
    }),
    [config],
  )
}

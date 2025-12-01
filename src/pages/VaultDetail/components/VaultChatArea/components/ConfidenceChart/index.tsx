import { useEffect, useMemo, useRef } from 'react'

/**
 * 半圆弧形进度图
 * 百分比 0~100 -> 角度 0~180
 * 根据原始 SVG 精确还原
 */
export default function ConfidenceChart({ percent }: { percent: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const color = useMemo(() => {
    if (percent <= 80) {
      // 橙色配置（高风险）
      return {
        main: '#FFA940', // 主色
        radialStart: 'rgba(255, 169, 64, 0)', // 径向渐变起点
        radialMid: 'rgba(255, 169, 64, 0)', // 径向渐变中点
        radialEnd: 'rgba(255, 169, 64, 0.2)', // 径向渐变终点
        shadow: 'rgba(255, 169, 64, 0.3)', // 阴影颜色
        linearStart: '#FFA940', // 线性渐变起点
        linearEnd: 'rgba(255, 169, 64, 0)', // 线性渐变终点
      }
    }

    // 绿色配置（低风险）
    return {
      main: '#00AA56', // 主色
      radialStart: 'rgba(0, 170, 86, 0)', // 径向渐变起点
      radialMid: 'rgba(0, 170, 86, 0)', // 径向渐变中点
      radialEnd: 'rgba(0, 170, 86, 0.12)', // 径向渐变终点
      shadow: 'rgba(0, 170, 86, 0.3)', // 阴影颜色
      linearStart: '#00AA56', // 线性渐变起点
      linearEnd: 'rgba(0, 170, 86, 0)', // 线性渐变终点
    }
  }, [percent])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置高清显示
    const dpr = window.devicePixelRatio || 1
    const width = 100
    const height = 50
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    // 清空画布
    ctx.clearRect(0, 0, width, height)

    // 圆弧朝上，中心点在底部中央
    const centerX = 50 // 宽度中心
    const centerY = 50 // 中心点在画布底部
    const radius = 48 // 半径 48 (预留 2px 边框空间)

    // 计算角度：从 -180° 开始，根据百分比增加
    // percent = 0: -180° 到 -180° (无圆弧)
    // percent = 30: -180° 到 -150° (30° 的圆弧)
    // percent = 100: -180° 到 0° (完整 180° 半圆)
    // Canvas: -180° = 180° (左侧)，0° (右侧)，顺时针经过 270°(顶部)
    const startAngle = Math.PI // -180° 即 180° (左侧)
    const endAngle = Math.PI + (percent / 100) * Math.PI // 从 180° 增加到 360°(即0°)

    // ===== 第一层：带模糊的内部发光 (feGaussianBlur stdDeviation="2") =====
    ctx.save()

    // 创建径向渐变 (对应 paint0_radial_17564_19004)
    // gradientTransform="translate(51.4615 54) rotate(-144.811) scale(47.7205 56.6053)"
    const radialGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.2)
    radialGradient.addColorStop(0, color.radialStart)
    radialGradient.addColorStop(0.530556, color.radialMid)
    radialGradient.addColorStop(1, color.radialEnd)

    // 设置阴影模糊效果
    ctx.shadowBlur = 4 // stdDeviation="2" * 2
    ctx.shadowColor = color.shadow

    // 绘制扇形（从圆心到圆弧）
    ctx.beginPath()
    ctx.moveTo(centerX, centerY) // 移动到中心
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false) // 顺时针绘制圆弧（朝上）
    ctx.lineTo(centerX, centerY) // 连回中心
    ctx.closePath()
    ctx.fillStyle = radialGradient
    ctx.fill()

    ctx.restore()

    // ===== 第二层：2px 渐变边框线 =====
    // 线性渐变：从左上到左下
    const linearGradient = ctx.createLinearGradient(10, 5, 0, 50)
    linearGradient.addColorStop(0, color.linearStart)
    linearGradient.addColorStop(1, color.linearEnd)

    // 绘制圆弧边框
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false) // 顺时针，圆弧朝上
    ctx.strokeStyle = linearGradient
    ctx.lineWidth = 2
    ctx.lineCap = 'round' // 圆角端点 (50% border-radius)
    ctx.stroke()
  }, [percent, color])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'block',
      }}
    />
  )
}

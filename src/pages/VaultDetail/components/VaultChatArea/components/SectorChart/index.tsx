import React from 'react'

/**
 * 百分比 0~100 -> 角度 0~180
 * 保持原始 SVG 配色、filter、gradient
 */
export default function SectorChart({ percent = 85 }) {
  const angle = (percent / 100) * 180
  const rad = (Math.PI / 180) * angle

  // 与你原图近似的参数（你也可以微调 r, cx, cy）
  const cx = 52 // 圆心 x
  const cy = 54 // 圆心 y（你原 svg 用 54）
  const r = 47 // 半径（近似原图尺寸）
  const startX = cx - r
  const startY = cy

  // 结束点（顺时针向上为正）
  const endX = cx + r * Math.cos(rad)
  const endY = cy - r * Math.sin(rad)

  const largeArcFlag = angle > 180 ? 1 : 0

  // 扇形填充路径（包含中心点）—— fill
  const wedgeD = [
    `M ${cx} ${cy}`,
    `L ${startX} ${startY}`,
    `A ${r} ${r} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
    'Z',
  ].join(' ')

  // 仅弧线（不包含中心）—— stroke，圆角端点
  const arcD = `M ${startX} ${startY} A ${r} ${r} 0 ${largeArcFlag} 1 ${endX} ${endY}`

  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='400' height='180' viewBox='0 0 104 104' fill='none'>
      <defs>
        {/* 模糊光晕，和你原来一致 */}
        <filter
          id='filter0_f_17564_19004'
          x='0'
          y='0'
          width='94.8685'
          height='58'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
          <feGaussianBlur stdDeviation='2' result='effect1_foregroundBlur_17564_19004' />
        </filter>

        {/* 扇形内部的渐变（弱） */}
        <radialGradient
          id='paint0_radial_17564_19004'
          cx='0'
          cy='0'
          r='1'
          gradientUnits='userSpaceOnUse'
          gradientTransform='translate(51.4615 54) rotate(-144.811) scale(47.7205 56.6053)'
        >
          <stop offset='0' stopColor='#00AA56' stopOpacity='0.00' />
          <stop offset='0.53' stopColor='#00AA56' stopOpacity='0.02' />
          <stop offset='1' stopColor='#00AA56' stopOpacity='0.12' />
        </radialGradient>

        {/* 扇形主色渐变（用于 fill 或 stroke） */}
        <linearGradient
          id='paint1_linear_17564_19004'
          x1='33.9615'
          y1='9.5'
          x2='4.96155'
          y2='54'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0' stopColor='#00AA56' />
          <stop offset='1' stopColor='#00AA56' stopOpacity='0' />
        </linearGradient>

        {/* 圆弧描边的渐变（更鲜明） */}
        <linearGradient id='arcStroke' x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0' stopColor='#7FF2A3' />
          <stop offset='0.6' stopColor='#33C964' />
          <stop offset='1' stopColor='#00AA56' />
        </linearGradient>

        {/* 可选：给 arc 丢一点阴影 blur，使圆弧显得柔和 */}
        <filter id='arcGlow' x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur stdDeviation='1.2' result='b' />
          <feMerge>
            <feMergeNode in='b' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>

      {/* 先渲染外层的模糊光晕（和你原 svg 对齐） */}
      <g filter='url(#filter0_f_17564_19004)'>
        {/* 这里用 wedgeD 填充弱渐变，营造内部轻微渐变色（保持视觉和原图一致） */}
        <path d={wedgeD} fill='url(#paint0_radial_17564_19004)' />
      </g>

      {/* 扇形内部主填充（更明确一点，如果希望更淡可降低 opacity） */}
      <path d={wedgeD} fill='url(#paint1_linear_17564_19004)' opacity='0.08' />

      {/* 上方那条圆弧描边（真正的边框）—— 仅 stroke，没有 fill */}
      <path
        d={arcD}
        fill='none'
        stroke='url(#arcStroke)'
        strokeWidth='3.6' // 描边宽度，可根据原图微调
        strokeLinecap='round' // 圆润端点
        strokeLinejoin='round'
        vectorEffect='non-scaling-stroke'
        filter='url(#arcGlow)' // 可去掉，如果不需要 glow
      />

      {/* 如果需要更强的边缘阴影（左下那种渐变阴影），可以另画一条较粗、透明的 arc */}
      <path
        d={arcD}
        fill='none'
        stroke='#0D3B24'
        strokeOpacity='0.06'
        strokeWidth='8'
        strokeLinecap='round'
        vectorEffect='non-scaling-stroke'
        transform='translate(0,2)'
      />
    </svg>
  )
}

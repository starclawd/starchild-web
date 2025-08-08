import styled from 'styled-components'
import { useCallback, useEffect, useRef } from 'react'
import testNftSrc from 'assets/test-nft.png'
import testDistroyNftSrc from 'assets/test-distroy-nft.png'
import { useCandidateStatus } from 'store/home/hooks'

const MosaicContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  canvas {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export default function MosaicImage({ hasBingdTg }: { hasBingdTg: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const img1Ref = useRef<HTMLImageElement | undefined>(undefined)
  const img2Ref = useRef<HTMLImageElement | undefined>(undefined)
  const animationRef = useRef<number | undefined>(undefined)
  const progressRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const prevHasBingdTg = useRef(hasBingdTg)
  const [{ burnNftIconUrl, nftIconUrl }] = useCandidateStatus()

  const blockSize = 16 // 马赛克块大小，增大以使效果更明显
  const canvasWidth = 200
  const canvasHeight = 200

  // 生成凹凸的边界线
  const getEdgeY = useCallback((x: number, maxY: number, progress: number) => {
    const freq = 0.05
    const amp = 15
    return Math.min(maxY, progress * canvasHeight + Math.sin(x * freq + progress * 8) * amp)
  }, [])

  // 马赛克效果实现
  const drawMosaicTransition = useCallback(
    (stage: 'mosaic' | 'reveal') => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx || !img1Ref.current || !img2Ref.current) {
        console.log('❌ drawMosaicTransition failed - missing dependencies:', {
          canvas: !!canvas,
          ctx: !!ctx,
          img1: !!img1Ref.current,
          img2: !!img2Ref.current,
        })
        return
      }

      console.log(`🎨 Drawing ${stage} stage, progress: ${progressRef.current.toFixed(2)}`)

      // 添加边界计算调试
      const sampleEdgeY = getEdgeY(
        100,
        canvasHeight,
        stage === 'mosaic' ? progressRef.current : 2 - progressRef.current,
      )
      console.log(`🔍 Sample edge Y at x=100: ${sampleEdgeY.toFixed(1)} (canvas height: ${canvasHeight})`)

      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      if (stage === 'mosaic') {
        // 第一阶段：马赛克化
        ctx.drawImage(img1Ref.current, 0, 0, canvasWidth, canvasHeight)
        const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)

        let mosaicBlocksDrawn = 0
        for (let y = 0; y < canvasHeight; y += blockSize) {
          for (let x = 0; x < canvasWidth; x += blockSize) {
            const edgeY = getEdgeY(x, canvasHeight, progressRef.current)

            if (y < edgeY) {
              // 计算马赛克块的平均颜色
              let r = 0,
                g = 0,
                b = 0,
                count = 0

              for (let dy = 0; dy < blockSize && y + dy < canvasHeight; dy++) {
                for (let dx = 0; dx < blockSize && x + dx < canvasWidth; dx++) {
                  const i = ((y + dy) * canvasWidth + (x + dx)) * 4
                  r += imageData.data[i]
                  g += imageData.data[i + 1]
                  b += imageData.data[i + 2]
                  count++
                }
              }

              if (count > 0) {
                r = Math.round(r / count)
                g = Math.round(g / count)
                b = Math.round(b / count)

                // 增强马赛克效果：使用亮色并添加边框
                ctx.fillStyle = `rgb(${Math.min(255, r + 50)},${Math.min(255, g + 50)},${Math.min(255, b + 50)})`
                ctx.fillRect(x, y, blockSize, blockSize)

                // 添加白色边框使马赛克更明显
                ctx.strokeStyle = 'rgba(255,255,255,0.6)'
                ctx.lineWidth = 1
                ctx.strokeRect(x, y, blockSize, blockSize)

                mosaicBlocksDrawn++
              }
            }
          }
        }
        console.log(`🔲 Mosaic blocks drawn: ${mosaicBlocksDrawn}`)
      } else {
        // 第二阶段：马赛克从上到下消失，露出第二张图
        // 先绘制第二张图作为背景
        ctx.drawImage(img2Ref.current, 0, 0, canvasWidth, canvasHeight)

        // 然后绘制第一张图片用于生成马赛克数据
        ctx.drawImage(img1Ref.current, 0, 0, canvasWidth, canvasHeight)
        const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)

        // 重新绘制第二张图作为背景
        ctx.drawImage(img2Ref.current, 0, 0, canvasWidth, canvasHeight)

        let mosaicBlocksDrawn = 0
        const revealProgress = progressRef.current - 1 // 0到1的进度

        for (let y = 0; y < canvasHeight; y += blockSize) {
          for (let x = 0; x < canvasWidth; x += blockSize) {
            const edgeY = getEdgeY(x, canvasHeight, revealProgress) // 马赛克消失的边界

            if (y >= edgeY) {
              // 在还没有消失的区域绘制马赛克块
              let r = 0,
                g = 0,
                b = 0,
                count = 0

              for (let dy = 0; dy < blockSize && y + dy < canvasHeight; dy++) {
                for (let dx = 0; dx < blockSize && x + dx < canvasWidth; dx++) {
                  const i = ((y + dy) * canvasWidth + (x + dx)) * 4
                  r += imageData.data[i]
                  g += imageData.data[i + 1]
                  b += imageData.data[i + 2]
                  count++
                }
              }

              if (count > 0) {
                r = Math.round(r / count)
                g = Math.round(g / count)
                b = Math.round(b / count)

                // 增强马赛克效果：使用亮色并添加边框
                ctx.fillStyle = `rgb(${Math.min(255, r + 50)},${Math.min(255, g + 50)},${Math.min(255, b + 50)})`
                ctx.fillRect(x, y, blockSize, blockSize)

                // 添加白色边框使马赛克更明显
                ctx.strokeStyle = 'rgba(255,255,255,0.6)'
                ctx.lineWidth = 1
                ctx.strokeRect(x, y, blockSize, blockSize)

                mosaicBlocksDrawn++
              }
            }
            // 如果 y < edgeY，则该区域已经消失，显示底层的第二张图
          }
        }
        console.log(`🔳 Reveal stage - mosaic blocks drawn: ${mosaicBlocksDrawn}`)
      }
    },
    [getEdgeY],
  )

  // 动画循环
  const animate = useCallback(() => {
    if (!isAnimatingRef.current) {
      console.log('⏹️ Animation stopped - isAnimatingRef is false')
      return
    }

    console.log('🎬 Animation frame - progress:', progressRef.current.toFixed(2))

    if (progressRef.current <= 1) {
      // 第一阶段：马赛克化
      console.log('🔲 Stage 1: Mosaic')
      drawMosaicTransition('mosaic')
    } else if (progressRef.current <= 2) {
      // 第二阶段：马赛克消失
      console.log('🔳 Stage 2: Reveal')
      drawMosaicTransition('reveal')
    } else {
      // 动画结束
      console.log('✨ Animation completed')
      isAnimatingRef.current = false

      // 动画完成后，确保显示第二张图
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (canvas && ctx && img2Ref.current) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        ctx.drawImage(img2Ref.current, 0, 0, canvasWidth, canvasHeight)
        console.log('🏁 Final image (destroyed) drawn')
      }
      return
    }

    progressRef.current += 0.008 // 调整速度：5秒完成动画 (2 / (5 * 60fps) ≈ 0.007)
    animationRef.current = requestAnimationFrame(animate)
  }, [drawMosaicTransition])

  // 加载图片
  useEffect(() => {
    const img1 = new Image()
    const img2 = new Image()

    img1.crossOrigin = 'anonymous'
    img2.crossOrigin = 'anonymous'

    img1.onload = () => {
      console.log('🖼️ Image 1 loaded:', testNftSrc)
      img1Ref.current = img1
      if (img2Ref.current) {
        console.log('🎨 Both images loaded, drawing initial image')
        // 初始显示第一张图
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (canvas && ctx) {
          ctx.drawImage(img1, 0, 0, canvasWidth, canvasHeight)
          console.log('✅ Initial image drawn')
        } else {
          console.log('❌ Canvas or context not available')
        }
      }
    }

    img2.onload = () => {
      console.log('🖼️ Image 2 loaded:', testDistroyNftSrc)
      img2Ref.current = img2
      if (img1Ref.current) {
        console.log('🎨 Both images loaded, drawing initial image')
        // 初始显示第一张图
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (canvas && ctx) {
          ctx.drawImage(img1Ref.current, 0, 0, canvasWidth, canvasHeight)
          console.log('✅ Initial image drawn')
        } else {
          console.log('❌ Canvas or context not available')
        }
      }
    }

    img1.src = nftIconUrl || testNftSrc
    img2.src = burnNftIconUrl || testDistroyNftSrc
  }, [burnNftIconUrl, nftIconUrl])

  // 监听hasBingdTg变化，触发动画
  useEffect(() => {
    console.log('🔄 hasBingdTg changed:', { prev: prevHasBingdTg.current, current: hasBingdTg })

    if (!prevHasBingdTg.current && hasBingdTg) {
      console.log('✅ Trigger animation condition met')
      console.log('📊 State check:', {
        img1Loaded: !!img1Ref.current,
        img2Loaded: !!img2Ref.current,
        isAnimating: isAnimatingRef.current,
        canvas: !!canvasRef.current,
      })

      if (img1Ref.current && img2Ref.current && !isAnimatingRef.current) {
        console.log('🚀 Starting animation...')
        progressRef.current = 0
        isAnimatingRef.current = true
        animate()
      } else {
        console.log('❌ Cannot start animation - missing requirements')
      }
    } else if (prevHasBingdTg.current && !hasBingdTg) {
      console.log('🔄 Resetting to initial state')
      // 重置到初始状态
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      isAnimatingRef.current = false
      progressRef.current = 0

      // 重新显示第一张图
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (canvas && ctx && img1Ref.current) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        ctx.drawImage(img1Ref.current, 0, 0, canvasWidth, canvasHeight)
      }
    }

    prevHasBingdTg.current = hasBingdTg
  }, [hasBingdTg, animate])

  // 清理
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <MosaicContainer>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} style={{ willReadFrequently: true } as any} />
    </MosaicContainer>
  )
}

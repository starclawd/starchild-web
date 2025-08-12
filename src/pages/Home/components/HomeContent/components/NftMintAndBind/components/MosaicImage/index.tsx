import styled from 'styled-components'
import { useCallback, useEffect, useRef } from 'react'
import nftSrc from 'assets/home/nft.gif'
import burnNftSrc from 'assets/home/burn-nft.jpeg'
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
    position: absolute;
    top: 0;
    left: 0;
  }

  .gif-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }
`

export default function MosaicImage({ hasBindTg }: { hasBindTg: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gifRef = useRef<HTMLImageElement>(null)
  const img1Ref = useRef<HTMLImageElement | undefined>(undefined)
  const img2Ref = useRef<HTMLImageElement | undefined>(undefined)
  const animationRef = useRef<number | undefined>(undefined)
  const progressRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const prevHasBingdTg = useRef(hasBindTg)
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
        return
      }

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
      }
    },
    [getEdgeY],
  )

  // 动画循环
  const animate = useCallback(() => {
    if (!isAnimatingRef.current) {
      return
    }

    if (progressRef.current <= 1) {
      // 第一阶段：马赛克化
      drawMosaicTransition('mosaic')
    } else if (progressRef.current <= 2) {
      // 第二阶段：马赛克消失
      drawMosaicTransition('reveal')
    } else {
      // 动画结束
      isAnimatingRef.current = false

      // 动画完成后，确保显示第二张图
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (canvas && ctx && img2Ref.current) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        ctx.drawImage(img2Ref.current, 0, 0, canvasWidth, canvasHeight)
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
      img1Ref.current = img1
    }

    img2.onload = () => {
      img2Ref.current = img2

      // 如果img2加载完成且hasBindTg为true，直接显示burnNftSrc
      if (hasBindTg && canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (canvas && ctx) {
          ctx.clearRect(0, 0, canvasWidth, canvasHeight)
          ctx.drawImage(img2, 0, 0, canvasWidth, canvasHeight)
        }
      }
    }

    img1.src = nftSrc
    img2.src = burnNftSrc
  }, [burnNftIconUrl, nftIconUrl, hasBindTg])

  // 初始化显示状态
  useEffect(() => {
    // 初始状态：根据hasBingdTg决定显示GIF还是Canvas
    if (gifRef.current && canvasRef.current) {
      if (!hasBindTg) {
        gifRef.current.style.display = 'block'
        canvasRef.current.style.display = 'none'
      } else {
        gifRef.current.style.display = 'none'
        canvasRef.current.style.display = 'block'

        // 如果hasBindTg为true，直接显示burnNftSrc
        if (img2Ref.current) {
          const canvas = canvasRef.current
          const ctx = canvas?.getContext('2d')
          if (canvas && ctx) {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight)
            ctx.drawImage(img2Ref.current, 0, 0, canvasWidth, canvasHeight)
          }
        }
      }
    }
  }, [hasBindTg])

  // 监听hasBingdTg变化，触发动画
  useEffect(() => {
    if (!prevHasBingdTg.current && hasBindTg) {
      if (img1Ref.current && img2Ref.current && !isAnimatingRef.current) {
        // 隐藏GIF，显示Canvas
        if (gifRef.current) {
          gifRef.current.style.display = 'none'
        }
        if (canvasRef.current) {
          canvasRef.current.style.display = 'block'
        }

        progressRef.current = 0
        isAnimatingRef.current = true
        animate()
      }
    } else if (prevHasBingdTg.current && !hasBindTg) {
      // 重置到初始状态
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      isAnimatingRef.current = false
      progressRef.current = 0

      // 显示GIF，隐藏Canvas
      if (gifRef.current) {
        gifRef.current.style.display = 'block'
      }
      if (canvasRef.current) {
        canvasRef.current.style.display = 'none'
      }
    }

    prevHasBingdTg.current = hasBindTg
  }, [hasBindTg, animate])

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
      <img
        ref={gifRef}
        src={nftSrc}
        alt='NFT'
        className='gif-image'
        style={{ display: hasBindTg ? 'none' : 'block' }}
      />
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={
          {
            willReadFrequently: true,
            display: hasBindTg ? 'block' : 'none',
          } as any
        }
      />
    </MosaicContainer>
  )
}

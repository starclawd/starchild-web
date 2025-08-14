import styled from 'styled-components'
import { useCallback, useEffect, useRef } from 'react'
import nftSrc from 'assets/home/nft.mp4'
import burnNftSrc from 'assets/home/burn-nft.mp4'
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

  .gif-image,
  .video-element {
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
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null)
  const secondMediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null)
  const img1Ref = useRef<HTMLImageElement | HTMLVideoElement | undefined>(undefined)
  const img2Ref = useRef<HTMLImageElement | HTMLVideoElement | undefined>(undefined)
  const animationRef = useRef<number | undefined>(undefined)
  const progressRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const prevHasBingdTg = useRef(hasBindTg)
  const [{ burnNftIconUrl, nftIconUrl }] = useCandidateStatus()

  const blockSize = 16 // 马赛克块大小，增大以使效果更明显
  const canvasWidth = 200
  const canvasHeight = 200

  // 检测文件类型
  const isVideoFile = useCallback((src: string) => {
    return src.includes('.mp4') || src.includes('.webm') || src.includes('.ogg')
  }, [])

  // 创建媒体元素
  const createMediaElement = useCallback(
    (src: string): Promise<HTMLImageElement | HTMLVideoElement> => {
      return new Promise((resolve, reject) => {
        if (isVideoFile(src)) {
          const video = document.createElement('video')
          video.crossOrigin = 'anonymous'
          video.muted = true
          video.loop = true
          video.playsInline = true

          video.onloadeddata = () => {
            video.currentTime = 0
            resolve(video)
          }

          video.onerror = reject
          video.src = src
        } else {
          const img = new Image()
          img.crossOrigin = 'anonymous'

          img.onload = () => resolve(img)
          img.onerror = reject
          img.src = src
        }
      })
    },
    [isVideoFile],
  )

  // 确保媒体元素可以被绘制
  const ensureMediaReady = useCallback((media: HTMLImageElement | HTMLVideoElement): boolean => {
    if (media instanceof HTMLVideoElement) {
      // HAVE_CURRENT_DATA = 2
      return media.readyState >= 2
    }
    return media.complete && media.naturalHeight !== 0
  }, [])

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

      // 确保媒体元素已准备好
      if (!ensureMediaReady(img1Ref.current) || !ensureMediaReady(img2Ref.current)) {
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
    [getEdgeY, ensureMediaReady],
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

      // 动画完成后的处理
      if (isVideoFile(burnNftSrc)) {
        // 如果 burnNftSrc 是视频，切换到视频播放模式
        if (canvasRef.current) {
          canvasRef.current.style.display = 'none'
        }
        if (secondMediaRef.current) {
          secondMediaRef.current.style.display = 'block'
          // 如果是视频，开始播放
          if (secondMediaRef.current instanceof HTMLVideoElement) {
            secondMediaRef.current.play().catch(console.error)
          }
        }
      } else {
        // 如果是图片，继续在 Canvas 上显示
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (canvas && ctx && img2Ref.current) {
          ctx.clearRect(0, 0, canvasWidth, canvasHeight)
          ctx.drawImage(img2Ref.current, 0, 0, canvasWidth, canvasHeight)
        }
      }
      return
    }

    progressRef.current += 0.008 // 调整速度：5秒完成动画 (2 / (5 * 60fps) ≈ 0.007)
    animationRef.current = requestAnimationFrame(animate)
  }, [isVideoFile, drawMosaicTransition])

  // 加载媒体文件
  useEffect(() => {
    const loadMedia = async () => {
      try {
        const [media1, media2] = await Promise.all([createMediaElement(nftSrc), createMediaElement(burnNftSrc)])

        img1Ref.current = media1
        img2Ref.current = media2

        // 设置到 mediaRef（用于显示第一个媒体）
        if (mediaRef.current) {
          if (isVideoFile(nftSrc)) {
            const videoElement = mediaRef.current as HTMLVideoElement
            videoElement.src = nftSrc
            // 确保视频开始播放
            videoElement.play().catch(console.error)
          } else {
            ;(mediaRef.current as HTMLImageElement).src = nftSrc
          }
        }

        // 设置到 secondMediaRef（用于显示第二个媒体）
        if (secondMediaRef.current) {
          if (isVideoFile(burnNftSrc)) {
            const videoElement = secondMediaRef.current as HTMLVideoElement
            videoElement.src = burnNftSrc
          } else {
            ;(secondMediaRef.current as HTMLImageElement).src = burnNftSrc
          }
        }

        // 如果是视频，开始播放
        if (media1 instanceof HTMLVideoElement) {
          media1.play().catch(console.error)
        }
        if (media2 instanceof HTMLVideoElement) {
          media2.play().catch(console.error)
        }

        // 如果media2加载完成且hasBindTg为true，直接显示burnNftSrc
        if (hasBindTg && canvasRef.current) {
          const canvas = canvasRef.current
          const ctx = canvas?.getContext('2d')
          if (canvas && ctx) {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight)
            ctx.drawImage(media2, 0, 0, canvasWidth, canvasHeight)
          }
        }
      } catch (error) {
        console.error('Failed to load media:', error)
      }
    }

    loadMedia()
  }, [burnNftIconUrl, nftIconUrl, hasBindTg, isVideoFile, createMediaElement])

  // 初始化显示状态
  useEffect(() => {
    // 初始状态：根据hasBingdTg决定显示媒体还是Canvas/第二个媒体
    if (mediaRef.current && canvasRef.current && secondMediaRef.current) {
      if (!hasBindTg) {
        mediaRef.current.style.display = 'block'
        canvasRef.current.style.display = 'none'
        secondMediaRef.current.style.display = 'none'

        // 如果是视频，开始播放
        if (mediaRef.current instanceof HTMLVideoElement) {
          mediaRef.current.play().catch(console.error)
        }
      } else {
        mediaRef.current.style.display = 'none'

        // 如果 burnNftSrc 是视频，直接显示视频
        if (isVideoFile(burnNftSrc)) {
          canvasRef.current.style.display = 'none'
          secondMediaRef.current.style.display = 'block'

          // 如果是视频，开始播放
          if (secondMediaRef.current instanceof HTMLVideoElement) {
            secondMediaRef.current.play().catch(console.error)
          }
        } else {
          // 如果是图片，显示在 Canvas 上
          canvasRef.current.style.display = 'block'
          secondMediaRef.current.style.display = 'none'

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
    }
  }, [hasBindTg, isVideoFile])

  // 监听hasBingdTg变化，触发动画
  useEffect(() => {
    if (!prevHasBingdTg.current && hasBindTg) {
      if (img1Ref.current && img2Ref.current && !isAnimatingRef.current) {
        // 隐藏第一个媒体和第二个媒体，显示Canvas进行动画
        if (mediaRef.current) {
          mediaRef.current.style.display = 'none'
        }
        if (secondMediaRef.current) {
          secondMediaRef.current.style.display = 'none'
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

      // 显示第一个媒体，隐藏Canvas和第二个媒体
      if (mediaRef.current) {
        mediaRef.current.style.display = 'block'

        // 如果是视频，开始播放
        if (mediaRef.current instanceof HTMLVideoElement) {
          mediaRef.current.play().catch(console.error)
        }
      }
      if (canvasRef.current) {
        canvasRef.current.style.display = 'none'
      }
      if (secondMediaRef.current) {
        secondMediaRef.current.style.display = 'none'
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
      {/* 第一个媒体元素 - nftSrc */}
      {isVideoFile(nftSrc) ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={nftSrc}
          className='video-element'
          muted
          loop
          playsInline
          style={{ display: hasBindTg ? 'none' : 'block' }}
        />
      ) : (
        <img
          ref={mediaRef as React.RefObject<HTMLImageElement>}
          src={nftSrc}
          alt='NFT'
          className='gif-image'
          style={{ display: hasBindTg ? 'none' : 'block' }}
        />
      )}

      {/* 第二个媒体元素 - burnNftSrc */}
      {isVideoFile(burnNftSrc) ? (
        <video
          ref={secondMediaRef as React.RefObject<HTMLVideoElement>}
          src={burnNftSrc}
          className='video-element'
          muted
          loop
          playsInline
          style={{ display: 'none' }}
        />
      ) : (
        <img
          ref={secondMediaRef as React.RefObject<HTMLImageElement>}
          src={burnNftSrc}
          alt='Burn NFT'
          className='gif-image'
          style={{ display: 'none' }}
        />
      )}

      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={
          {
            willReadFrequently: true,
            display: hasBindTg && !isVideoFile(burnNftSrc) ? 'block' : 'none',
          } as any
        }
      />
    </MosaicContainer>
  )
}

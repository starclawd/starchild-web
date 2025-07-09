import styled, { css } from 'styled-components'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import { useTheme } from 'store/themecache/hooks'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useIsMobile } from 'store/application/hooks'

const VoiceItemWrapper = styled.div<{ $isAiInput?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ theme, $isAiInput }) =>
    theme.isMobile &&
    css`
      min-width: ${vm(256)};
      height: ${vm(32)};
      ${$isAiInput &&
      css`
        width: ${vm(330)};
        height: ${vm(24)};
      `}
    `}
`

const LeftWrapper = styled.div<{ $isAiInput?: boolean }>`
  display: flex;
  align-items: center;
  ${({ theme, $isAiInput }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      ${$isAiInput &&
      css`
        gap: ${vm(20)};
      `}
    `}
`

const DeleteWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(24)};
      .icon-chat-close {
        font-size: 0.18rem;
        color: ${theme.textL4};
      }
    `}
`

const CanvasWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(164)};
      height: ${vm(24)};
      canvas {
        width: ${vm(164)};
        height: ${vm(24)};
      }
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: ${vm(164)};
        height: ${vm(24)};
      }
    `}
`

const TimeDisplay = styled.span`
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.16rem;
      font-weight: 500;
      line-height: 0.24rem;
    `}
`

const PlayButton = styled(BorderAllSide1PxBox)<{ $isAiInput?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme, $isAiInput }) =>
    theme.isMobile &&
    css`
      width: ${vm(24)};
      height: ${vm(24)};
      .icon-play {
        font-size: 0.24rem;
        color: ${theme.textL1};
      }
      .icon-chat-stop-play {
        font-size: 0.24rem;
        color: ${theme.textL1};
      }
      ${$isAiInput &&
      css`
        width: ${vm(44)};
        height: ${vm(44)};
      `}
    `}
`

export default function VoiceItem({
  voiceUrl,
  isAiInput,
  resultVoiceImg,
  deleteVoice,
}: {
  voiceUrl: string
  isAiInput?: boolean
  resultVoiceImg?: string
  deleteVoice?: () => void
}) {
  const ratio = 3
  const theme = useTheme()
  const isMobile = useIsMobile()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const [hasAudioVisualization, setHasAudioVisualization] = useState(true)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [isBlobUrl] = useState(() => voiceUrl.startsWith('blob:'))

  // 格式化时间显示为 MM:SS
  const formatTime = useCallback((timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, [])

  const drawStaticWave = useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        const WIDTH = canvasRef.current.width
        const HEIGHT = canvasRef.current.height

        ctx.clearRect(0, 0, WIDTH, HEIGHT)
        ctx.fillStyle = theme.textL1
        ctx.globalAlpha = 0.66

        // 绘制静态波形 - 均匀分布的条形
        const barCount = 40
        const barWidth = 2 * ratio
        const gap = 4 * ratio

        for (let i = 0; i < barCount; i++) {
          // 随机高度，但保持在一定范围内，创建静态波形效果
          const barHeight = Math.random() * 24 + 12
          const x = gap + i * (barWidth + gap)
          const y = (HEIGHT - barHeight) / 2

          // 绘制带圆角的矩形
          const radius = 3

          ctx.beginPath()
          ctx.moveTo(x + radius, y)
          ctx.lineTo(x + barWidth - radius, y)
          ctx.arcTo(x + barWidth, y, x + barWidth, y + radius, radius)
          ctx.lineTo(x + barWidth, y + barHeight - radius)
          ctx.arcTo(x + barWidth, y + barHeight, x + barWidth - radius, y + barHeight, radius)
          ctx.lineTo(x + radius, y + barHeight)
          ctx.arcTo(x, y + barHeight, x, y + barHeight - radius, radius)
          ctx.lineTo(x, y + radius)
          ctx.arcTo(x, y, x + radius, y, radius)
          ctx.closePath()
          ctx.fill()
        }
      }
    }
  }, [theme.textL1])
  const drawDynamicWave = useCallback(() => {
    // 只有在成功设置了音频可视化时才调用visualize
    if (hasAudioVisualization && analyserRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const WIDTH = canvas.width
      const HEIGHT = canvas.height

      analyserRef.current.fftSize = 256
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      // 波形动画配置
      const MIN_HEIGHT = 2 * ratio
      const MAX_HEIGHT = 22 * ratio
      const BAR_WIDTH = 2 * ratio
      const GAP = 4 * ratio
      const BAR_STEP = BAR_WIDTH + GAP
      const BAR_COUNT = Math.floor(WIDTH / BAR_STEP)

      // 初始化波形数据数组
      const waveformData = new Array(BAR_COUNT).fill(MIN_HEIGHT)

      // 初始化历史音量队列，用于创造趋势变化
      const volumeHistory = new Array(5).fill(0)

      // 控制波形移动速度的计数器
      let frameCounter = 0
      const frameUpdateRate = 8 // 每隔多少帧更新一次波形，值越大移动越慢

      ctx.clearRect(0, 0, WIDTH, HEIGHT)
      const draw = () => {
        animationRef.current = requestAnimationFrame(draw)

        analyserRef.current?.getByteFrequencyData(dataArray)

        // 查找数据中的最大值和最小值
        let maxValue = 0
        let minValue = 255

        for (let i = 0; i < dataArray.length - 1; i++) {
          if (dataArray[i] > maxValue) maxValue = dataArray[i]
          if (dataArray[i] > 0 && dataArray[i] < minValue) {
            minValue = dataArray[i]
          }
        }
        minValue = Math.min(1, minValue)
        maxValue = Math.max(1, maxValue)
        // 更新历史音量队列
        volumeHistory.unshift(maxValue)
        volumeHistory.pop()

        // 只在特定帧更新波形，减慢移动速度
        frameCounter++
        if (frameCounter >= frameUpdateRate) {
          frameCounter = 0

          // 创建新的波形条高度
          // 使用频率分布来创建有意义的波形
          // 计算多个频率点的平均值，而不是随机选择一个点
          let totalValue = 0
          const sampleSize = 8
          const startIndex = Math.floor(Math.random() * 20) // 随机选择起始频率点

          for (let i = 0; i < sampleSize; i++) {
            const index = (startIndex + i) % 30 // 确保在有效范围内
            totalValue += dataArray[index]
          }

          const avgValue = totalValue / sampleSize

          // 线性映射，确保最小值映射到MIN_HEIGHT，最大值映射到MAX_HEIGHT
          let barHeight
          if (avgValue <= minValue) {
            barHeight = MIN_HEIGHT
          } else if (avgValue >= maxValue) {
            barHeight = MAX_HEIGHT
          } else {
            // 线性插值 - 将频率值按比例映射到高度范围
            const percentage = avgValue / 255
            barHeight = MIN_HEIGHT + percentage * (MAX_HEIGHT - MIN_HEIGHT)
          }

          // 插入数据队列 - 从后面添加，实现从右往左移动
          waveformData.push(barHeight)
          if (waveformData.length > BAR_COUNT) {
            waveformData.shift()
          }
        }

        ctx.fillStyle = '#000000'
        ctx.clearRect(0, 0, WIDTH, HEIGHT)

        for (let i = 0; i < BAR_COUNT; i++) {
          // 计算精确的像素位置，避免小数点引起的模糊
          const x = Math.floor(i * BAR_STEP)

          // 波形条的高度
          const h = Math.max(1, Math.floor(waveformData[i]))
          const y = Math.floor((HEIGHT - h) / 2)

          // 绘制波形条
          ctx.fillStyle = theme.textL1
          ctx.globalAlpha = 0.66

          // 对于宽bar，使用圆角效果
          const radius = 3
          const r = Math.min(radius, Math.floor(h / 2), Math.floor(BAR_WIDTH / 2))

          ctx.beginPath()
          ctx.moveTo(x + r, y)
          ctx.lineTo(x + BAR_WIDTH - r, y)
          ctx.arcTo(x + BAR_WIDTH, y, x + BAR_WIDTH, y + r, r)
          ctx.lineTo(x + BAR_WIDTH, y + h - r)
          ctx.arcTo(x + BAR_WIDTH, y + h, x + BAR_WIDTH - r, y + h, r)
          ctx.lineTo(x + r, y + h)
          ctx.arcTo(x, y + h, x, y + r, r)
          ctx.lineTo(x, y + r)
          ctx.arcTo(x, y, x + r, y, r)
          ctx.closePath()
          ctx.fill()
        }
      }

      draw()
    }
  }, [theme.textL1, hasAudioVisualization])
  // 播放/暂停切换
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      // 暂停时重置为初始状态，与播放结束处理一致
      setCurrentTime(0)
      audioRef.current.currentTime = 0
      drawStaticWave()
    } else {
      // 在用户交互时初始化AudioContext（如果尚未创建）
      if (!audioContextRef.current && !sourceRef.current) {
        try {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
          analyserRef.current = audioContextRef.current.createAnalyser()
          sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current)
          sourceRef.current.connect(analyserRef.current)
          analyserRef.current.connect(audioContextRef.current.destination)
          setHasAudioVisualization(true)
        } catch (error) {
          console.warn('Could not set up audio visualization due to CORS or other restrictions:', error)
          setHasAudioVisualization(false)
        }
      }

      // 确保AudioContext已激活
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch((err) => {
          console.warn('Failed to resume AudioContext:', err)
        })
      }

      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error)
        // 特殊处理：如果播放失败，可能是由于用户未与页面交互导致的自动播放策略限制
        if (error.name === 'NotAllowedError') {
          console.warn('Auto-play prevented by browser. User interaction required.')
        }
      })
      drawDynamicWave()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying, drawStaticWave, drawDynamicWave])
  // 处理音频播放结束
  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    drawStaticWave()
  }, [drawStaticWave])

  // 更新当前播放时间
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)

      // 如果持续时间仍为Infinity，并且当前时间有效，尝试基于当前缓冲区估算总时长
      if (!isFinite(audioRef.current.duration) && audioRef.current.buffered.length > 0) {
        const bufferedEnd = audioRef.current.buffered.end(audioRef.current.buffered.length - 1)
        if (isFinite(bufferedEnd) && bufferedEnd > 0) {
          setDuration(bufferedEnd)
        }
      }

      // 对于 blob URL，如果当前播放时间接近结束且持续时间未知，使用当前时间作为估计
      if (isBlobUrl && !isFinite(audioRef.current.duration) && duration === 0) {
        // 当播放接近结束时，音频元素会发出"ended"事件
        // 在此之前，我们可以临时将当前时间作为估计的总时长
        setDuration(audioRef.current.currentTime + 0.5) // 添加一点缓冲
      }
    }
  }, [duration, isBlobUrl])

  // 音频加载完成后，获取音频时长
  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      if (isFinite(audioRef.current.duration)) {
        setDuration(audioRef.current.duration)
        setAudioLoaded(true)
      }
    }
  }, [])

  // 专门处理 blob URL 的音频时长获取
  useEffect(() => {
    if (isBlobUrl && voiceUrl) {
      // 对于 blob URL，使用 fetch 获取数据并手动解码
      const getDurationFromBlob = async () => {
        try {
          // 获取 blob 数据
          const response = await fetch(voiceUrl)
          const blob = await response.blob()

          // 创建一个临时的 AudioContext 用于解码
          const tempContext = new (window.AudioContext || (window as any).webkitAudioContext)()

          // 将 blob 转换为 ArrayBuffer
          const arrayBuffer = await blob.arrayBuffer()

          // 解码音频数据
          tempContext.decodeAudioData(
            arrayBuffer,
            (audioBuffer) => {
              // 成功解码，获取时长
              const audioDuration = audioBuffer.duration
              console.log('Blob audio duration:', audioDuration)

              if (isFinite(audioDuration) && audioDuration > 0) {
                setDuration(audioDuration)
                setAudioLoaded(true)
              }

              // 关闭临时上下文
              if (tempContext.state !== 'closed') {
                tempContext.close()
              }
            },
            (error) => {
              console.error('Error decoding blob audio:', error)
              // 关闭临时上下文
              if (tempContext.state !== 'closed') {
                tempContext.close()
              }
            },
          )
        } catch (error) {
          console.error('Error fetching or processing blob URL:', error)
        }
      }

      getDurationFromBlob()
    }
  }, [isBlobUrl, voiceUrl])

  // 处理可能的加载错误
  const handleLoadError = useCallback((e: ErrorEvent) => {
    console.error('Audio loading error:', e)
    setHasAudioVisualization(false)
  }, [])

  // 初始化音频和音频分析器
  useEffect(() => {
    try {
      // 创建音频元素
      if (audioRef.current) {
        // 清理之前的音频实例，避免内存泄漏
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current.load()
      }

      audioRef.current = new Audio()
      audioRef.current.crossOrigin = 'anonymous'
      audioRef.current.preload = 'metadata'

      // // 扩展Audio元素，添加自定义属性以跟踪播放Promise
      // audioRef.current.playPromise = undefined;

      // 先绑定事件监听器，然后再设置src
      audioRef.current.addEventListener('ended', handleEnded)
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata)
      audioRef.current.addEventListener('loadeddata', () => setAudioLoaded(true))
      audioRef.current.addEventListener('error', handleLoadError)

      // 添加状态变化监听，用于调试
      // if (isBlobUrl) {
      //   ['abort', 'stalled', 'suspend', 'waiting', 'emptied'].forEach(eventName => {
      //     audioRef.current?.addEventListener(eventName, (e) => {
      //       console.log(`voiceItem: ${eventName}`, e);
      //     });
      //   });
      // }

      // 对于blob URL，确保在设置 src 前设置好所有事件处理器
      audioRef.current.src = voiceUrl
      audioRef.current.load()

      // 尝试预加载一些数据
      if (voiceUrl.startsWith('blob:')) {
        fetch(voiceUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok')
            }
            return response
          })
          .catch((error) => {
            console.error('Fetch error for blob URL:', error)
          })
      }

      drawStaticWave()
    } catch (error) {
      console.error('Error initializing audio:', error)
      setHasAudioVisualization(false)
    }

    // 清理
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener('ended', handleEnded)
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audioRef.current.removeEventListener('error', handleLoadError)
        audioRef.current.src = ''
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect()
        } catch (e) {
          console.warn('Error disconnecting audio source:', e)
        }
      }

      if (analyserRef.current) {
        try {
          analyserRef.current.disconnect()
        } catch (e) {
          console.warn('Error disconnecting analyser:', e)
        }
      }

      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close()
        } catch (e) {
          console.warn('Error closing audio context:', e)
        }
      }
    }
  }, [theme.textL1, drawStaticWave, handleEnded, handleLoadedMetadata, handleTimeUpdate, handleLoadError, voiceUrl])

  return (
    <VoiceItemWrapper $isAiInput={isAiInput}>
      <LeftWrapper $isAiInput={isAiInput}>
        <CanvasWrapper>
          <canvas
            ref={canvasRef}
            width='492'
            height='72'
            style={{ background: 'transparent', visibility: resultVoiceImg && !isPlaying ? 'hidden' : 'visible' }}
          />
          {resultVoiceImg && !isPlaying && <img src={resultVoiceImg} alt='' />}
        </CanvasWrapper>
        <TimeDisplay>{formatTime(duration - currentTime)}</TimeDisplay>
        {isAiInput && (
          <DeleteWrapper onClick={deleteVoice}>
            <IconBase className='icon-chat-close' />
          </DeleteWrapper>
        )}
      </LeftWrapper>
      <PlayButton
        $borderRadius={'50%'}
        $borderColor={theme.bgT30}
        $isAiInput={isAiInput}
        $hideBorder={!isAiInput}
        onClick={togglePlay}
      >
        <IconBase className={isPlaying ? 'icon-chat-stop-play' : 'icon-play'} />
      </PlayButton>
    </VoiceItemWrapper>
  )
}

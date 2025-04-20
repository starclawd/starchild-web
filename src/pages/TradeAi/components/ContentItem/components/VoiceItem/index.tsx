import styled, { css } from 'styled-components'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import { useTheme } from 'store/theme/hooks'

const VoiceItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => theme.isMobile && css`
    min-width: ${vm(256)};
  `}
`

const LeftWrapper = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(12)};
  `}
`

const CanvasWrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(164)};
    height: ${vm(32)};
    canvas {
      width: ${vm(164)};
      height: ${vm(32)};
    }
  `}
`

const TimeDisplay = styled.span`
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) => theme.isMobile && css`
    font-size: .16rem;
    font-weight: 500;
    line-height: .24rem;
  `}
`

const PlayButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(24)};
    height: ${vm(24)};
    .icon-play {
      font-size: .24rem;
      color: ${theme.textL1};
    }
    
    .icon-pause {
      font-size: .24rem;
      color: ${theme.textL1};
    }
  `}
`

export default function VoiceItem({
  voiceUrl
}: {
  voiceUrl: string
}) {
  const ratio = 3
  const theme = useTheme()
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
        ctx.fillStyle = theme.textL1;
        ctx.globalAlpha = 0.66;
        
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
      const MIN_HEIGHT = 2 * ratio;
      const MAX_HEIGHT = 22 * ratio;
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
        let maxValue = 0;
        let minValue = 255;
        
        for (let i = 0; i < dataArray.length - 1; i++) {
          if (dataArray[i] > maxValue) maxValue = dataArray[i];
          if (dataArray[i] > 0 && dataArray[i] < minValue) {
            minValue = dataArray[i];
          }
        }
        minValue = Math.min(1, minValue)
        maxValue = Math.max(1, maxValue)
        // 更新历史音量队列
        volumeHistory.unshift(maxValue);
        volumeHistory.pop();
        
        // 只在特定帧更新波形，减慢移动速度
        frameCounter++;
        if (frameCounter >= frameUpdateRate) {
          frameCounter = 0;
          
          // 创建新的波形条高度
          // 使用频率分布来创建有意义的波形
          // 计算多个频率点的平均值，而不是随机选择一个点
          let totalValue = 0;
          const sampleSize = 8;
          const startIndex = Math.floor(Math.random() * 20); // 随机选择起始频率点
          
          for (let i = 0; i < sampleSize; i++) {
            const index = (startIndex + i) % 30; // 确保在有效范围内
            totalValue += dataArray[index];
          }
          
          const avgValue = totalValue / sampleSize;
          
          // 线性映射，确保最小值映射到MIN_HEIGHT，最大值映射到MAX_HEIGHT
          let barHeight;
          if (avgValue <= minValue) {
            barHeight = MIN_HEIGHT;
          } else if (avgValue >= maxValue) {
            barHeight = MAX_HEIGHT;
          } else {
            // 线性插值 - 将频率值按比例映射到高度范围
            const percentage = avgValue / 255;
            barHeight = MIN_HEIGHT + percentage * (MAX_HEIGHT - MIN_HEIGHT);
          }
          
          // 插入数据队列 - 从后面添加，实现从右往左移动
          waveformData.push(barHeight);
          if (waveformData.length > BAR_COUNT) {
            waveformData.shift();
          }
        }
        
        ctx.fillStyle = '#000000';
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        for (let i = 0; i < BAR_COUNT; i++) {
          // 计算精确的像素位置，避免小数点引起的模糊
          const x = Math.floor(i * BAR_STEP);
          
          // 波形条的高度
          const h = Math.max(1, Math.floor(waveformData[i]));
          const y = Math.floor((HEIGHT - h) / 2);
          
          // 绘制波形条
          ctx.fillStyle = theme.textL1;
          ctx.globalAlpha = 0.66;
          
          // 对于宽bar，使用圆角效果
          const radius = 3
          const r = Math.min(radius, Math.floor(h / 2), Math.floor(BAR_WIDTH / 2));
          
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + BAR_WIDTH - r, y);
          ctx.arcTo(x + BAR_WIDTH, y, x + BAR_WIDTH, y + r, r);
          ctx.lineTo(x + BAR_WIDTH, y + h - r);
          ctx.arcTo(x + BAR_WIDTH, y + h, x + BAR_WIDTH - r, y + h, r);
          ctx.lineTo(x + r, y + h);
          ctx.arcTo(x, y + h, x, y + r, r);
          ctx.lineTo(x, y + r);
          ctx.arcTo(x, y, x + r, y, r);
          ctx.closePath();
          ctx.fill();
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
        audioContextRef.current.resume().catch(err => {
          console.warn('Failed to resume AudioContext:', err)
        })
      }
      
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error)
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
    }
  }, [])
  
  // 音频加载完成后，获取音频时长
  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }, [])
  
  // 初始化音频和音频分析器
  useEffect(() => {
    try {
      // 创建音频元素
      audioRef.current = new Audio(voiceUrl)
      audioRef.current.crossOrigin = "anonymous"
      audioRef.current.preload = "auto"
      audioRef.current.addEventListener('ended', handleEnded)
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata)
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio element error:', e)
      })
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
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close()
        } catch (e) {
          console.warn('Error closing audio context:', e)
        }
      }
    }
  }, [theme.textL1, drawStaticWave, handleEnded, handleLoadedMetadata, handleTimeUpdate, voiceUrl])
  
  return (
    <VoiceItemWrapper>
      <LeftWrapper>
        <CanvasWrapper>
          <canvas 
            ref={canvasRef} 
            width="492" 
            height="72"
            style={{ background: 'transparent' }} 
          />
        </CanvasWrapper>
        <TimeDisplay>
          {formatTime(duration - currentTime)}
        </TimeDisplay>
      </LeftWrapper>
      <PlayButton onClick={togglePlay}>
        <IconBase className={isPlaying ? 'icon-pause' : 'icon-play'} />
      </PlayButton>
    </VoiceItemWrapper>
  )
}

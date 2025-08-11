import { useState, useCallback, useEffect } from 'react'
import { isAndroidTelegramWebApp } from 'utils/telegramWebApp'

export function useVideoPreload(isMobile: boolean, starchildVideo: string, starchildVideoMobile: string) {
  // 添加视频下载状态
  const [loadProgress, setLoadProgress] = useState(0)
  const [mainVideoSrc, setMainVideoSrc] = useState<string>('')
  const [loadError, setLoadError] = useState<string>('')
  // 添加视频是否完全就绪的状态
  const [isVideoFullyLoaded, setIsVideoFullyLoaded] = useState(false)

  // 预先下载视频
  const preloadVideo = useCallback(async () => {
    try {
      setLoadProgress(0)
      setLoadError('')
      setIsVideoFullyLoaded(false)

      // 根据isMobile选择不同的视频源
      const videoSrc = isMobile ? starchildVideoMobile : starchildVideo

      // 只在安卓系统下的 Telegram WebApp 环境中直接使用原始链接
      if (isAndroidTelegramWebApp()) {
        console.log('🎬 安卓 Telegram WebApp 环境：使用原始视频链接')
        setMainVideoSrc(videoSrc)
        setLoadProgress(100)

        // 创建一个视频元素来检测视频是否完全加载
        const testVideo = document.createElement('video')
        testVideo.src = videoSrc
        testVideo.preload = 'metadata'

        // 监听视频元数据加载完成
        testVideo.addEventListener('loadedmetadata', () => {
          console.log('🎬 安卓 Telegram WebApp: 视频元数据加载完成')
        })

        // 监听视频完全加载
        testVideo.addEventListener('canplaythrough', () => {
          console.log('🎬 安卓 Telegram WebApp: 视频完全加载完成')
          setIsVideoFullyLoaded(true)
        })

        // 监听加载错误
        testVideo.addEventListener('error', (e) => {
          console.error('🎬 安卓 Telegram WebApp: 视频加载错误', e)
          setLoadError('视频加载失败')
          setIsVideoFullyLoaded(false)
        })

        return
      }

      // 非安卓 Telegram WebApp 环境使用原有的 blob 方式
      console.log('🎬 正常环境或非安卓 Telegram WebApp：使用 blob 方式加载视频')
      const response = await fetch(videoSrc, {
        cache: 'force-cache', // 强制使用缓存
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentLength = response.headers.get('content-length')
      const total = contentLength ? parseInt(contentLength, 10) : 0

      if (!response.body) {
        throw new Error('ReadableStream not supported')
      }

      const reader = response.body.getReader()
      const chunks: Uint8Array[] = []
      let loaded = 0

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        chunks.push(value)
        loaded += value.length

        if (total > 0) {
          const progress = (loaded / total) * 100
          setLoadProgress(Math.round(progress))
        }
      }

      // 合并所有 chunks
      const blob = new Blob(chunks, { type: 'video/mp4' })
      const url = URL.createObjectURL(blob)

      setMainVideoSrc(url)
      setIsVideoFullyLoaded(true)
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : '下载失败')
      // 失败时回退到原始地址，根据isMobile选择对应的视频
      const fallbackSrc = isMobile ? starchildVideoMobile : starchildVideo
      setMainVideoSrc(fallbackSrc)
      setIsVideoFullyLoaded(false)
    }
  }, [isMobile, starchildVideo, starchildVideoMobile])

  // 组件挂载时开始预加载
  useEffect(() => {
    preloadVideo()

    // 清理函数
    return () => {
      if (mainVideoSrc && mainVideoSrc.startsWith('blob:')) {
        URL.revokeObjectURL(mainVideoSrc)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    loadProgress,
    mainVideoSrc,
    loadError,
    preloadVideo,
    isVideoFullyLoaded,
  }
}

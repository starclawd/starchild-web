import { useState, useCallback, useEffect } from 'react'

export function useVideoPreload(isMobile: boolean, starchildVideo: string, starchildVideoMobile: string) {
  // 添加视频下载状态
  const [loadProgress, setLoadProgress] = useState(0)
  const [mainVideoSrc, setMainVideoSrc] = useState<string>('')
  const [loadError, setLoadError] = useState<string>('')

  // 预先下载视频
  const preloadVideo = useCallback(async () => {
    try {
      // 在后台预加载主视频，不阻塞播放
      setLoadProgress(0)
      setLoadError('')

      // 根据isMobile选择不同的视频源
      const videoSrc = isMobile ? starchildVideoMobile : starchildVideo
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
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : '下载失败')
      // 失败时回退到原始地址，根据isMobile选择对应的视频
      const fallbackSrc = isMobile ? starchildVideoMobile : starchildVideo
      setMainVideoSrc(fallbackSrc)
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
  }
}

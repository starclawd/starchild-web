import { useState, useRef, useCallback } from 'react'

// 定义视频播放状态
export type VideoPlayState = 'loading' | 'loop-playing' | 'loop-completed' | 'main-playing' | 'main-completed'

export function useVideoPlayback() {
  // 添加视频播放状态管理
  const [playState, setPlayState] = useState<VideoPlayState>('loop-playing')
  const [hasCompletedFirstLoop, setHasCompletedFirstLoop] = useState(false)
  const [userHasScrolled, setUserHasScrolled] = useState(false)
  // 添加主视频播放时间状态
  const [mainVideoCurrentTime, setMainVideoCurrentTime] = useState(0)
  const [mainVideoDuration, setMainVideoDuration] = useState(0)
  // 添加用户交互状态
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false)
  // 添加主视频播放重试状态
  const [mainVideoRetryCount, setMainVideoRetryCount] = useState(0)
  // 添加主视频就绪状态
  const [isMainVideoReady, setIsMainVideoReady] = useState(false)

  const isVideoReady = useRef<boolean>(false)
  const pendingSeekTime = useRef<number | null>(null)
  const isSeekingRef = useRef<boolean>(false)
  // 缓存上次的目标时间，避免重复seek
  const lastTargetTime = useRef<number>(-1)
  // 滚动回顶部的延时器
  const backToTopTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 尝试播放主视频的函数
  const tryPlayMainVideo = useCallback(
    async (mainVideoRef: React.RefObject<HTMLVideoElement | null>, retryCount = 0) => {
      const mainVideo = mainVideoRef.current
      if (!mainVideo) return false

      // 如果视频已经在播放，不要重复播放
      if (!mainVideo.paused && mainVideo.currentTime > 0) {
        return true
      }

      try {
        mainVideo.currentTime = 0
        mainVideo.loop = false

        await mainVideo.play()
        isVideoReady.current = true
        setNeedsUserInteraction(false)
        setMainVideoRetryCount(0)
        return true
      } catch (error) {
        // 重试逻辑（最多重试2次）
        if (retryCount < 2) {
          setMainVideoRetryCount(retryCount + 1)

          setTimeout(
            () => {
              tryPlayMainVideo(mainVideoRef, retryCount + 1)
            },
            500 * (retryCount + 1),
          )

          return false
        }

        return false
      }
    },
    [],
  )

  // 切换回循环视频播放
  const switchBackToLoopVideo = useCallback(
    (homeWrapperRef: React.RefObject<HTMLDivElement | null>) => {
      const homeWrapper = homeWrapperRef.current
      if (homeWrapper && playState === 'main-completed') {
        // 强制重置滚动位置到顶部
        homeWrapper.scrollTop = 0

        // 清除可能存在的延时器
        if (backToTopTimerRef.current) {
          clearTimeout(backToTopTimerRef.current)
          backToTopTimerRef.current = null
        }

        setPlayState('loop-completed')

        // 强制刷新滚动容器，确保浏览器重新计算滚动区域
        setTimeout(() => {
          if (homeWrapper) {
            homeWrapper.style.overflowY = 'hidden'
            setTimeout(() => {
              homeWrapper.style.overflowY = 'auto'
            }, 10)
          }
        }, 100)
        setUserHasScrolled(false)
        setNeedsUserInteraction(false) // 重置用户交互状态
        isVideoReady.current = false
      }
    },
    [playState],
  )

  const updateVideoTime = useCallback(
    (
      targetTime: number,
      loopVideoRef: React.RefObject<HTMLVideoElement | null>,
      mainVideoRef: React.RefObject<HTMLVideoElement | null>,
    ) => {
      const video =
        playState === 'main-playing' || playState === 'main-completed' ? mainVideoRef.current : loopVideoRef.current
      if (!video) {
        return
      }

      if (!isVideoReady.current) {
        return
      }

      const currentTime = video.currentTime
      const timeDiff = Math.abs(targetTime - currentTime)

      // 增加去抖动机制，减少过于频繁的 seeking
      if (Math.abs(targetTime - lastTargetTime.current) < 0.1) {
        return
      }

      // 如果正在seeking，保存待处理的时间
      if (isSeekingRef.current) {
        pendingSeekTime.current = targetTime
        return
      }

      // 增加阈值到100ms，减少 seeking 频率
      if (timeDiff > 0.1) {
        isSeekingRef.current = true
        lastTargetTime.current = targetTime
        video.currentTime = targetTime
      }
    },
    [playState],
  )

  return {
    playState,
    setPlayState,
    hasCompletedFirstLoop,
    setHasCompletedFirstLoop,
    userHasScrolled,
    setUserHasScrolled,
    mainVideoCurrentTime,
    setMainVideoCurrentTime,
    mainVideoDuration,
    setMainVideoDuration,
    needsUserInteraction,
    setNeedsUserInteraction,
    mainVideoRetryCount,
    setMainVideoRetryCount,
    isMainVideoReady,
    setIsMainVideoReady,
    isVideoReady,
    pendingSeekTime,
    isSeekingRef,
    lastTargetTime,
    backToTopTimerRef,
    tryPlayMainVideo,
    switchBackToLoopVideo,
    updateVideoTime,
  }
}

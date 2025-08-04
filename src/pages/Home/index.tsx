import styled, { css, useTheme } from 'styled-components'
import { useEffect, useRef, useState } from 'react'
import starchildVideo from 'assets/home/starchild.mp4'
import starchildVideoMobile from 'assets/home/starchild-mobile.mp4'
import { ScrollDownArrow, VideoPlayer, HomeMenu, HomeFooter } from './components'
import { useIsMobile } from 'store/application/hooks'
import useToast from 'components/Toast'
import { useVideoPlayback, useVideoPreload } from './hooks'
import HomeContent from './components/HomeContent'

const HomeWrapper = styled.div<{ $allowScroll: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
  overflow-y: ${(props) => (props.$allowScroll ? 'auto' : 'hidden')};
  overflow-x: hidden;
`

const AniContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex-shrink: 0;
  width: 100%;
  height: 10000px;
  z-index: 2;
`

const Container = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  z-index: 3;
  transition: opacity 0.3s ease;
`

const InnerContent = styled.div<{ $opacity: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100dvh;
  transition: transform 1.5s;
  opacity: 0;
  ${({ $opacity }) =>
    $opacity > 0 &&
    css`
      opacity: 1;
    `}
`

const Content = styled.div<{ $opacity: number }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transform: translateY(${(props) => (props.$opacity > 0 ? '0px' : '80px')});
  transition: transform 1.5s;
`

export default function Home() {
  const toast = useToast()
  const theme = useTheme()
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(false)
  const loopVideoRef = useRef<HTMLVideoElement>(null)
  const mainVideoRef = useRef<HTMLVideoElement>(null)
  const homeWrapperRef = useRef<HTMLDivElement>(null)
  const [textOpacity, setTextOpacity] = useState(0)
  const rafId = useRef<number>(null)
  const lastUpdateTime = useRef<number>(0)
  // 滚动卡顿检测
  const lastScrollAttemptRef = useRef<number>(0)
  const scrollStuckCountRef = useRef<number>(0)

  // 添加输入框内容状态
  const [inputValue, setInputValue] = useState('')
  // 添加滚动位置状态
  const [scrollPosition, setScrollPosition] = useState(0)

  // 使用拆分的 hooks
  const {
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
  } = useVideoPlayback()

  const { loadProgress, mainVideoSrc, loadError, preloadVideo } = useVideoPreload(
    isMobile,
    starchildVideo,
    starchildVideoMobile,
  )

  // 尝试自动播放循环视频
  useEffect(() => {
    const video = loopVideoRef.current
    if (video && playState === 'loop-playing') {
      video.loop = false // 第一遍不循环
      video
        .play()
        .then(() => {
          setNeedsUserInteraction(false)
        })
        .catch(() => {
          // 播放失败时继续运行，不阻塞后续流程
        })
    }
  }, [playState, setNeedsUserInteraction])

  // 监听预加载完成
  useEffect(() => {
    // 预加载完成后，React会自动更新视频源
  }, [mainVideoSrc])

  useEffect(() => {
    const loopVideo = loopVideoRef.current
    const mainVideo = mainVideoRef.current
    const homeWrapper = homeWrapperRef.current
    if (!loopVideo || !mainVideo || !homeWrapper) return

    const handleScroll = () => {
      // 移除性能限制，让滚动更流畅
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }

      rafId.current = requestAnimationFrame(() => {
        const scrollTop = homeWrapper.scrollTop
        const scrollHeight = homeWrapper.scrollHeight - homeWrapper.clientHeight

        // 更新滚动位置状态
        setScrollPosition(scrollTop)

        // 滚动卡顿检测和恢复
        if (scrollTop < 50 && scrollTop > 0) {
          const now = Date.now()
          if (Math.abs(scrollTop - lastScrollAttemptRef.current) < 1) {
            scrollStuckCountRef.current++
            if (scrollStuckCountRef.current > 5) {
              // 强制刷新滚动容器
              homeWrapper.style.overflowY = 'hidden'
              setTimeout(() => {
                homeWrapper.style.overflowY = 'auto'
                scrollStuckCountRef.current = 0
              }, 10)
            }
          } else {
            scrollStuckCountRef.current = 0
          }
          lastScrollAttemptRef.current = scrollTop
        }

        // 主视频播放完成后，不允许滚动回循环视频，停留在最后

        // 检测用户是否开始滚动（只有主视频加载完成才允许）
        if (scrollTop > 10 && !userHasScrolled && isMainVideoReady) {
          setUserHasScrolled(true)

          // 如果循环视频已经播放完第一遍且主视频已加载完成，切换到主视频播放
          if (playState === 'loop-completed') {
            setPlayState('main-playing')
            tryPlayMainVideo(mainVideoRef)
          }
        }
      })
    }

    const handleVideoLoad = (videoElement: HTMLVideoElement) => {
      if (playState === 'loop-playing' && videoElement === loopVideo) {
        // 循环视频加载完成，开始自动播放（第一次）
        videoElement.loop = false // 第一遍不要循环，等ended事件触发
        videoElement
          .play()
          .then(() => {})
          .catch(() => {})
        isVideoReady.current = true
      } else if (playState === 'loop-completed' && videoElement === loopVideo) {
        // 切换回循环视频，直接开始循环播放
        videoElement.loop = true
        videoElement
          .play()
          .then(() => {
            setNeedsUserInteraction(false)
          })
          .catch(() => {
            // 播放失败时继续正常流程
          })
        isVideoReady.current = true
      } else if (videoElement === mainVideo) {
        // 主视频元数据加载完成（无论当前状态如何）
        setIsMainVideoReady(true)
        setMainVideoDuration(videoElement.duration)
      }
    }

    const handleVideoEnded = (videoElement: HTMLVideoElement) => {
      if (playState === 'loop-playing' && !hasCompletedFirstLoop && videoElement === loopVideo) {
        // 循环视频第一遍播放完成
        setHasCompletedFirstLoop(true)
        setPlayState('loop-completed')
        // 现在设置为循环并继续播放
        videoElement.loop = true
        videoElement.play().catch(() => {})
      } else if (playState === 'main-playing' && videoElement === mainVideo) {
        // 主视频播放完成，停在最后一帧
        setPlayState('main-completed')
      }
    }

    // 主视频播放时间更新处理
    const handleMainVideoTimeUpdate = () => {
      if (playState === 'main-playing' && mainVideo) {
        setMainVideoCurrentTime(mainVideo.currentTime)

        // 根据播放时间控制文字显示（在播放到70%时开始显示）
        if (mainVideo.duration > 0) {
          const progress = mainVideo.currentTime / mainVideo.duration
          if (progress >= 0.8) {
            const fadeProgress = Math.min((progress - 0.8) / 0.2, 1)
            setTextOpacity(fadeProgress)
          } else {
            setTextOpacity(0)
          }
        }
      }
    }

    const handleSeeked = () => {
      isSeekingRef.current = false

      // 处理待处理的seek请求
      if (pendingSeekTime.current !== null) {
        const nextSeekTime = pendingSeekTime.current
        pendingSeekTime.current = null
        updateVideoTime(nextSeekTime, loopVideoRef, mainVideoRef)
      }
    }

    const loopVideoLoadHandler = () => handleVideoLoad(loopVideo)
    const mainVideoLoadHandler = () => handleVideoLoad(mainVideo)
    const loopVideoEndedHandler = () => handleVideoEnded(loopVideo)
    const mainVideoEndedHandler = () => handleVideoEnded(mainVideo)

    loopVideo.addEventListener('loadedmetadata', loopVideoLoadHandler)
    loopVideo.addEventListener('ended', loopVideoEndedHandler)
    mainVideo.addEventListener('loadedmetadata', mainVideoLoadHandler)
    mainVideo.addEventListener('timeupdate', handleMainVideoTimeUpdate)
    mainVideo.addEventListener('seeked', handleSeeked)
    mainVideo.addEventListener('ended', mainVideoEndedHandler)
    homeWrapper.addEventListener('scroll', handleScroll, { passive: true })

    const backToTopTimer = backToTopTimerRef.current

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      if (backToTopTimer) {
        clearTimeout(backToTopTimer)
      }
      loopVideo.removeEventListener('loadedmetadata', loopVideoLoadHandler)
      loopVideo.removeEventListener('ended', loopVideoEndedHandler)
      mainVideo.removeEventListener('loadedmetadata', mainVideoLoadHandler)
      mainVideo.removeEventListener('timeupdate', handleMainVideoTimeUpdate)
      mainVideo.removeEventListener('seeked', handleSeeked)
      mainVideo.removeEventListener('ended', mainVideoEndedHandler)
      homeWrapper.removeEventListener('scroll', handleScroll)
    }
  }, [
    isMainVideoReady,
    playState,
    hasCompletedFirstLoop,
    userHasScrolled,
    mainVideoSrc,
    setUserHasScrolled,
    setPlayState,
    setHasCompletedFirstLoop,
    setIsMainVideoReady,
    setMainVideoDuration,
    setMainVideoCurrentTime,
    setNeedsUserInteraction,
    tryPlayMainVideo,
    updateVideoTime,
    isVideoReady,
    pendingSeekTime,
    isSeekingRef,
    backToTopTimerRef,
  ])

  return (
    <HomeWrapper
      ref={homeWrapperRef}
      className='scroll-style'
      $allowScroll={isMainVideoReady && (playState === 'loop-completed' || playState === 'main-playing')}
    >
      <VideoPlayer
        playState={playState}
        mainVideoSrc={mainVideoSrc}
        loadError={loadError}
        isMobile={isMobile}
        loopVideoRef={loopVideoRef}
        mainVideoRef={mainVideoRef}
      />
      <AniContent>
        <Container>
          <InnerContent $opacity={textOpacity}>
            <HomeMenu opacity={textOpacity} />
            <Content $opacity={textOpacity}>
              <HomeContent />
            </Content>
          </InnerContent>
        </Container>
      </AniContent>
      <HomeFooter opacity={textOpacity} />
      <ScrollDownArrow
        opacity={
          playState === 'loop-completed' && isMainVideoReady ? 1 : 0 // 只在循环播放完成且主视频加载完成时显示
        }
      />
    </HomeWrapper>
  )
}

import styled, { css } from 'styled-components'
import { useEffect, useRef, useState, useCallback } from 'react'
import starchildVideo from 'assets/home/starchild.mp4'
import starchildVideoMobile from 'assets/home/starchild-mobile.mp4'
import { ScrollDownArrow, VideoPlayer, HomeMenu, HomeFooter } from './components'
import { useCurrentRouter, useIsMobile } from 'store/application/hooks'
import { useVideoPlayback, useVideoPreload } from './hooks'
import HomeContent from './components/HomeContent'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { ROUTER } from 'pages/router'
import { isAndroidTelegramWebApp } from 'utils/telegramWebApp'
import Pending from 'components/Pending'
import { t } from '@lingui/core/macro'

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
  opacity: ${(props) => (props.$opacity > 0 ? 1 : 0)};
  transform: translateY(${(props) => (props.$opacity > 0 ? '0px' : '80px')});
  transition: transform 1.5s;
`

const RetryOverlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  visibility: ${({ $show }) => ($show ? 'visible' : 'hidden')};
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
`

export default function Home() {
  const isMobile = useIsMobile()
  const [, setCurrentRouter] = useCurrentRouter()
  const { login } = useParsedQueryString()
  const [isMainVideoLoading, setIsMainVideoLoading] = useState(login === '1') // login=1时初始为加载状态
  const loopVideoRef = useRef<HTMLVideoElement>(null)
  const mainVideoRef = useRef<HTMLVideoElement>(null)
  const homeWrapperRef = useRef<HTMLDivElement>(null)
  const [textOpacity, setTextOpacity] = useState(login === '1' ? 1 : 0)
  const rafId = useRef<number>(null)
  // 滚动卡顿检测
  const lastScrollAttemptRef = useRef<number>(0)
  const scrollStuckCountRef = useRef<number>(0)
  // 记录初始login=1状态，即使URL参数被删除也保持追踪
  const wasInitiallyLoginOneRef = useRef(login === '1')
  const lastFrameIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { mainVideoSrc, loadError, isVideoFullyLoaded } = useVideoPreload(
    isMobile,
    starchildVideo,
    starchildVideoMobile,
  )

  // 使用拆分的 hooks
  const {
    playState,
    setPlayState,
    hasCompletedFirstLoop,
    setHasCompletedFirstLoop,
    userHasScrolled,
    setUserHasScrolled,
    setMainVideoCurrentTime,
    setMainVideoDuration,
    setNeedsUserInteraction,
    isMainVideoReady,
    setIsMainVideoReady,
    hasMainVideoStarted,
    isRetrying,
    mainVideoRetryCount,
    isVideoReady,
    pendingSeekTime,
    isSeekingRef,
    backToTopTimerRef,
    tryPlayMainVideo,
    updateVideoTime,
  } = useVideoPlayback(login === '1')

  // 强制保持最后一帧的函数（用于login=1场景）
  const enforceLastFrame = useCallback(() => {
    if (!wasInitiallyLoginOneRef.current) return

    const video = mainVideoRef.current
    if (video && video.duration && video.duration > 0) {
      const expectedTime = Math.max(0, video.duration - 0.1)

      // 如果视频时间不在预期位置，强制修正
      if (Math.abs(video.currentTime - expectedTime) > 0.05) {
        // console.warn('强制修正视频到最后一帧，当前:', video.currentTime, '目标:', expectedTime)
        video.currentTime = expectedTime
        video.pause()
      }
    }
  }, [])

  // 当初始为login=1时，设置视频到最后一帧并启动保护机制
  useEffect(() => {
    if (wasInitiallyLoginOneRef.current) {
      // 设置视频为就绪状态
      isVideoReady.current = true

      // 清除可能存在的定时器
      if (lastFrameIntervalRef.current) {
        clearInterval(lastFrameIntervalRef.current)
      }

      // 主视频直接显示最后一帧
      if (mainVideoRef.current) {
        const video = mainVideoRef.current

        // 设置到最后一帧的函数
        const setToLastFrame = () => {
          if (video && video.duration && video.duration > 0) {
            // 设置视频时间到最后一帧
            const lastFrameTime = Math.max(0, video.duration - 0.1)
            video.currentTime = lastFrameTime
            setMainVideoDuration(video.duration)
            setMainVideoCurrentTime(lastFrameTime)

            // 确保视频暂停在最后一帧
            video.pause()
            setIsMainVideoLoading(false)

            // 启动强制保护定时器，每100ms检查一次
            lastFrameIntervalRef.current = setInterval(enforceLastFrame, 100)
            return true
          }
          return false
        }

        // 等待视频准备就绪的函数
        const waitForVideo = () => {
          if (video.readyState >= 1 && video.duration) {
            setToLastFrame()
          } else {
            // 如果视频还没准备好，再等一下
            setTimeout(waitForVideo, 50)
          }
        }

        waitForVideo()
      }
    }

    // 清理函数
    return () => {
      if (lastFrameIntervalRef.current) {
        clearInterval(lastFrameIntervalRef.current)
        lastFrameIntervalRef.current = null
      }
    }
  }, [isVideoReady, setMainVideoDuration, setMainVideoCurrentTime, enforceLastFrame])

  // 视频加载完成后，静默删除 URL 中的 login=1 参数
  useEffect(() => {
    if (login === '1' && !isMainVideoLoading) {
      setCurrentRouter(ROUTER.HOME)
      // // 创建新的 URLSearchParams 对象
      // const searchParams = new URLSearchParams(location.search)

      // // 删除 login 参数
      // searchParams.delete('login')

      // // 构建新的 URL 路径
      // const newSearch = searchParams.toString()
      // const newPath = newSearch ? `${location.pathname}?${newSearch}` : location.pathname

      // // 使用 replace 静默更新 URL，不触发页面重新加载
      // navigate(newPath, { replace: true })
    }
  }, [login, isMainVideoLoading, setCurrentRouter])

  // 尝试自动播放循环视频（但 login=1 时跳过）
  useEffect(() => {
    if (login === '1') return // login=1 时不播放循环视频

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
  }, [playState, setNeedsUserInteraction, login])

  // 监听预加载完成
  useEffect(() => {
    // 预加载完成后，React会自动更新视频源
  }, [mainVideoSrc])

  // 在 Telegram WebApp 环境中，监听视频完全加载状态
  useEffect(() => {
    const mainVideo = mainVideoRef.current
    if (!mainVideo || !mainVideoSrc) return

    // 确保在视频完全加载后更新主视频就绪状态
    const handleCanPlayThrough = () => {
      // console.log('🎬 主视频可以流畅播放')
      setIsMainVideoReady(true)
    }

    const handleLoadedData = () => {
      // console.log('🎬 主视频数据加载完成')
    }

    const handleError = (e: any) => {
      // console.error('🎬 主视频加载错误:', e)
      setIsMainVideoReady(false)
    }

    mainVideo.addEventListener('canplaythrough', handleCanPlayThrough)
    mainVideo.addEventListener('loadeddata', handleLoadedData)
    mainVideo.addEventListener('error', handleError)

    return () => {
      mainVideo.removeEventListener('canplaythrough', handleCanPlayThrough)
      mainVideo.removeEventListener('loadeddata', handleLoadedData)
      mainVideo.removeEventListener('error', handleError)
    }
  }, [mainVideoSrc, setIsMainVideoReady])

  // 调试信息：显示当前视频加载状态
  // useEffect(() => {
  //   if (isAndroidTelegramWebApp()) {
  //     console.log('🎬 安卓 Telegram WebApp 视频状态:', {
  //       mainVideoSrc: !!mainVideoSrc,
  //       isVideoFullyLoaded,
  //       isMainVideoReady,
  //       canAllowScroll: isMainVideoReady && isVideoFullyLoaded,
  //       playState,
  //     })
  //   }
  // }, [mainVideoSrc, isVideoFullyLoaded, isMainVideoReady, playState])

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
        // 在 Telegram WebApp 环境中，还需要确保视频完全加载完成
        const canAllowScroll = isMainVideoReady && isVideoFullyLoaded

        if (scrollTop > 10 && !userHasScrolled && canAllowScroll) {
          setUserHasScrolled(true)
          // console.log('🎬 允许滚动播放：主视频就绪且完全加载')

          // 如果循环视频已经播放完第一遍且主视频已加载完成，切换到主视频播放
          if (playState === 'loop-completed') {
            setPlayState('main-playing')
            // 直接尝试播放主视频，时间重置由hook内部处理
            tryPlayMainVideo(mainVideoRef)
          }
        } else if (scrollTop > 10 && !userHasScrolled && !canAllowScroll) {
          // 如果尝试滚动但条件不满足，记录调试信息
          // console.log('🎬 滚动被阻止：', {
          //   isMainVideoReady,
          //   isVideoFullyLoaded,
          //   canAllowScroll,
          // })
        }
      })
    }

    const handleVideoLoad = (videoElement: HTMLVideoElement) => {
      if (wasInitiallyLoginOneRef.current && videoElement === mainVideo) {
        // 初始login=1时，主视频加载完成，但不在这里设置时间，避免与useEffect中的逻辑冲突
        // console.log('初始login=1: handleVideoLoad触发，跳过时间设置')
        setIsMainVideoReady(true)
        setMainVideoDuration(videoElement.duration)
        // 不在这里设置currentTime，让useEffect中的逻辑来处理
        return
      }

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
      if (mainVideo) {
        setMainVideoCurrentTime(mainVideo.currentTime)

        // 初始login=1场景下的特殊处理
        if (wasInitiallyLoginOneRef.current) {
          // 如果视频在播放中但应该在最后一帧，重新设置到最后一帧
          if (!mainVideo.paused && mainVideo.duration && mainVideo.currentTime < mainVideo.duration - 0.2) {
            console.warn('初始login=1: 检测到视频不在最后一帧，重新设置')
            mainVideo.currentTime = Math.max(0, mainVideo.duration - 0.1)
            mainVideo.pause()
          }
          return
        }

        // 只有在主视频播放状态下才处理
        if (playState === 'main-playing') {
          // 防止视频意外回到第一帧的保护机制
          if (hasMainVideoStarted && mainVideo.currentTime === 0 && !mainVideo.seeking) {
            console.warn('检测到主视频异常回到第一帧，尝试恢复播放')
            mainVideo.play().catch(() => {})
          }

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
    }

    const handleSeeked = () => {
      isSeekingRef.current = false

      // 处理待处理的seek请求
      if (pendingSeekTime.current !== null) {
        const nextSeekTime = pendingSeekTime.current
        pendingSeekTime.current = null
        updateVideoTime(nextSeekTime, loopVideoRef, mainVideoRef, login === '1')
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
    isVideoFullyLoaded,
    hasMainVideoStarted,
    isMainVideoReady,
    playState,
    hasCompletedFirstLoop,
    userHasScrolled,
    mainVideoSrc,
    login,
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
      $allowScroll={
        isMainVideoReady &&
        (playState === 'loop-completed' || playState === 'main-playing' || playState === 'main-completed')
      }
    >
      <VideoPlayer
        playState={playState}
        mainVideoSrc={mainVideoSrc}
        loadError={loadError}
        isMobile={isMobile}
        loopVideoRef={loopVideoRef}
        mainVideoRef={mainVideoRef}
        isMainVideoLoading={isMainVideoLoading}
        login={login}
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
      {/* 视频重试时显示 Pending 组件 */}
      <RetryOverlay $show={isRetrying}>
        <Pending isFetching={true} />
      </RetryOverlay>
    </HomeWrapper>
  )
}

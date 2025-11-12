import styled, { css } from 'styled-components'
import { useEffect, useMemo, useRef, useState } from 'react'
import starchildVideo from 'assets/home/starchild-new.mp4'
import starchildVideoMobile from 'assets/home/starchild-mobile.mp4'
import { ScrollDownArrow, VideoPlayer, HomeMenu, HomeFooter } from './components'
import { useCurrentRouter, useIsMobile } from 'store/application/hooks'
import { useVideoPlayback, useVideoPreload } from './hooks'
import HomeContent from './components/HomeContent'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { ROUTER } from 'pages/router'
import Pending from 'components/Pending'
import { isFromTGRedirection } from 'store/login/utils'
import { useHasSkipped } from 'store/homecache/hooks'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'

const HomeWrapper = styled.div<{ $allowScroll: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
  overflow-y: ${(props) => (props.$allowScroll ? 'auto' : 'hidden')};
  overflow-x: hidden;
  transform: unset !important;
`

const SkipButton = styled.div`
  position: fixed;
  top: 60px;
  right: 60px;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  gap: 8px;
  height: 42px;
  padding: 8px 20px;
  border-radius: 80px;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
  color: ${({ theme }) => theme.textL1};
  border: 1px solid ${({ theme }) => theme.bgT30};
  background: ${({ theme }) => theme.text10};
  cursor: pointer;
  transition: opacity ${ANI_DURATION}s;
  i {
    font-size: 24px;
  }
  &:hover {
    opacity: 0.7;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(6)};
      top: ${vm(40)};
      right: ${vm(24)};
      height: ${vm(32)};
      padding: ${vm(6)} ${vm(12)};
      font-size: 0.14rem;
      line-height: 0.2rem;
      border-radius: ${vm(80)};
      i {
        font-size: 0.17rem;
      }
    `}
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
  const isFromTeleRedirection = isFromTGRedirection()
  const [isMainVideoLoading, setIsMainVideoLoading] = useState(false) // login=1时不需要加载状态
  const loopVideoRef = useRef<HTMLVideoElement>(null)
  const mainVideoRef = useRef<HTMLVideoElement>(null)
  const homeWrapperRef = useRef<HTMLDivElement>(null)
  // 记录初始login=1状态，即使URL参数被删除也保持追踪
  const wasInitiallyLoginOneRef = useRef(login === '1' || isFromTeleRedirection)
  // 使用缓存的跳过状态
  const [hasSkippedCache, setHasSkippedCache] = useHasSkipped()
  const [hasSkipped, setHasSkipped] = useState(hasSkippedCache)
  const [textOpacity, setTextOpacity] = useState(wasInitiallyLoginOneRef.current || hasSkippedCache ? 1 : 0)
  const rafId = useRef<number>(null)
  // 滚动卡顿检测
  const lastScrollAttemptRef = useRef<number>(0)
  const scrollStuckCountRef = useRef<number>(0)
  // 当login=1或已跳过时，不预加载视频
  const { mainVideoSrc, loadError, isVideoFullyLoaded } = useVideoPreload(
    isMobile,
    starchildVideo,
    starchildVideoMobile,
    wasInitiallyLoginOneRef.current || hasSkippedCache, // 使用初始状态或缓存跳过状态
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
  } = useVideoPlayback(wasInitiallyLoginOneRef.current || hasSkipped)

  // SkipButton点击处理函数
  const handleSkip = () => {
    setHasSkipped(true)
    setHasSkippedCache(true) // 缓存跳过状态到localStorage
    setTextOpacity(1)
    setCurrentRouter(ROUTER.HOME) // 清除URL参数
  }

  // login=1或已跳过时，直接删除URL参数，无需等待视频加载
  useEffect(() => {
    if (wasInitiallyLoginOneRef.current || hasSkippedCache) {
      setCurrentRouter(ROUTER.HOME)
    }
  }, [setCurrentRouter, hasSkippedCache])

  // 尝试自动播放循环视频（但 login=1 或已跳过时跳过）
  useEffect(() => {
    if (wasInitiallyLoginOneRef.current || hasSkipped) return // login=1 或已跳过时不播放循环视频

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
  }, [playState, setNeedsUserInteraction, hasSkipped])

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

        // 检测用户是否开始滚动
        // login=1或已跳过时直接允许滚动，否则需要主视频加载完成
        const canAllowScroll = wasInitiallyLoginOneRef.current || hasSkipped || (isMainVideoReady && isVideoFullyLoaded)

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
      // login=1或已跳过时不需要处理视频加载
      if (wasInitiallyLoginOneRef.current || hasSkipped) {
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
        // login=1或已跳过时不需要处理视频时间更新
        if (wasInitiallyLoginOneRef.current || hasSkipped) {
          return
        }

        setMainVideoCurrentTime(mainVideo.currentTime)

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
        updateVideoTime(nextSeekTime, loopVideoRef, mainVideoRef, wasInitiallyLoginOneRef.current)
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
    hasSkipped,
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
        wasInitiallyLoginOneRef.current ||
        hasSkipped ||
        (isMainVideoReady &&
          (playState === 'loop-completed' || playState === 'main-playing' || playState === 'main-completed'))
      }
    >
      {textOpacity < 0.9 && (
        <SkipButton onClick={handleSkip}>
          <IconBase className='icon-chat-delete' />
          <Trans>Skip</Trans>
        </SkipButton>
      )}
      <VideoPlayer
        playState={playState}
        mainVideoSrc={mainVideoSrc}
        loadError={loadError}
        isMobile={isMobile}
        loopVideoRef={loopVideoRef}
        mainVideoRef={mainVideoRef}
        isMainVideoLoading={isMainVideoLoading}
        login={wasInitiallyLoginOneRef.current || hasSkipped ? '1' : login}
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
          wasInitiallyLoginOneRef.current || hasSkipped
            ? 0 // login=1或已跳过时不显示滚动箭头
            : playState === 'loop-completed' && isMainVideoReady && isVideoFullyLoaded
              ? 1
              : 0 // 只在循环播放完成、主视频加载完成且视频完全加载时显示
        }
      />
      {/* 视频重试时显示 Pending 组件 */}
      <RetryOverlay $show={isRetrying}>
        <Pending isFetching={true} />
      </RetryOverlay>
    </HomeWrapper>
  )
}

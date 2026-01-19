import { Trans } from '@lingui/react/macro'
import { ANI_DURATION } from 'constants/index'
import { IconBase, IconChatStrategyBg } from 'components/Icons'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { useSetCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { useMyStrategies } from 'store/mystrategy/hooks/useMyStrategies'
import Pagination from '../Pagination'
import { formatPercent } from 'utils/format'
import { useTheme } from 'store/themecache/hooks'
import { useIsLogin } from 'store/login/hooks'
import Pending from 'components/Pending'
import createStrateVideo from 'assets/createstrategy/create-stratygy.mp4'

const MyStrategyWrapper = styled.div<{ $isShowDefaultStyle: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: calc((100% - 12px) / 2);
  height: 100%;
  padding: 16px;
  border-radius: 8px;
  transition: all ${ANI_DURATION}s;
  border: 1px solid ${({ theme }) => theme.black800};
  background-color: ${({ theme }) => theme.black1000};
  cursor: ${({ $isShowDefaultStyle }) => ($isShowDefaultStyle ? 'default' : 'pointer')};
  overflow: hidden;
  .icon-chat-strategy-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  &:hover {
    border-color: ${({ theme }) => theme.black600};
    .title-arrow .icon-arrow,
    .title-arrow {
      color: ${({ theme }) => theme.black0};
    }
  }
`

const Title = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3;
  .title-text {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    color: ${({ theme }) => theme.black0};
  }
  .title-arrow {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.black200};
    .icon-arrow {
      font-size: 18px;
      transition: all ${ANI_DURATION}s;
      color: ${({ theme }) => theme.black200};
      transform: rotate(90deg);
    }
  }
`

const MyStrategyList = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
  overflow: hidden;
  width: 366px;
  height: 88px;
  z-index: 2;
`

const PendingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const ListWrapper = styled.div<{ $translateX: number }>`
  display: flex;
  width: auto;
  height: 100%;
  transform: translateX(${({ $translateX }) => $translateX}px);
  transition: transform ${ANI_DURATION}s ease-in-out;
  .leaderboard-item {
    width: 366px;
  }
`

const StrategyItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 366px;
  height: 100%;
  padding-bottom: 16px;
`

const StrategyName = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
`

const AprItem = styled.div<{ $emptyVaule: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  span:first-child {
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    color: ${({ theme }) => theme.black300};
  }
  span:last-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.brand100};
  }
  ${({ $emptyVaule, theme }) =>
    $emptyVaule &&
    css`
      span:last-child {
        color: ${theme.black300};
      }
    `}
`

const DefaultContent = styled.div<{ $isShowDefaultStyle: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  z-index: 2;
  cursor: pointer;
  overflow: hidden;
  border-radius: 4px;
  ${({ $isShowDefaultStyle }) =>
    $isShowDefaultStyle &&
    css`
      display: flex;
    `}
  &:hover .sound-button {
    opacity: 1;
  }
`

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const SoundButton = styled.div`
  position: absolute;
  right: 12px;
  bottom: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  z-index: 4;
  opacity: 0;
  svg {
    width: 18px;
    height: 18px;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`

export default memo(function MyStrategy() {
  const theme = useTheme()
  const isLogin = useIsLogin()
  const setCurrentRouter = useSetCurrentRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const { myStrategies, isLoadingMyStrategies } = useMyStrategies()
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleVideoClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const video = videoRef.current
    if (!video) return

    const isFullscreen = document.fullscreenElement !== null
    if (isFullscreen) {
      document.exitFullscreen()
    } else {
      video.requestFullscreen()
    }
  }, [])

  const handleSoundToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }, [])

  // 监听全屏变化，同步 video 的 muted 状态到 React 状态
  useEffect(() => {
    const handleFullscreenChange = () => {
      const video = videoRef.current
      if (video) {
        setIsMuted(video.muted)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])
  const isShowDefaultStyle = true

  const goCreateStrategyPage = useCallback(
    (strategyId: string) => {
      return () => {
        if (isShowDefaultStyle || !strategyId) {
          return
        }
        setCurrentRouter(`${ROUTER.CREATE_STRATEGY}?strategyId=${strategyId}`)
      }
    },
    [isShowDefaultStyle, setCurrentRouter],
  )
  return (
    <MyStrategyWrapper
      $isShowDefaultStyle={isShowDefaultStyle}
      onClick={goCreateStrategyPage(myStrategies[currentIndex]?.strategy_id || '')}
    >
      <IconChatStrategyBg color={isShowDefaultStyle ? 'rgba(248, 70, 0, 0.2)' : theme.black900} />
      {!isShowDefaultStyle && (
        <Title>
          <span className='title-text'>
            <Trans>My strategies</Trans>
          </span>
          <span className='title-arrow'>
            <Trans>Continue</Trans>
            <IconBase className='icon-arrow' />
          </span>
        </Title>
      )}
      {!isShowDefaultStyle && (
        <MyStrategyList>
          {isLoadingMyStrategies ? (
            <PendingWrapper>
              <Pending />
            </PendingWrapper>
          ) : (
            <ListWrapper $translateX={-currentIndex * 366}>
              {myStrategies.map((strategy, index) => (
                <StrategyItem key={strategy.strategy_id}>
                  <StrategyName>{strategy.strategy_name}</StrategyName>
                  <AprItem $emptyVaule={!strategy.all_time_apr}>
                    <span>
                      <Trans>All-time APR:</Trans>
                    </span>
                    <span>{strategy.all_time_apr ? formatPercent({ value: strategy.all_time_apr }) : '--'}</span>
                  </AprItem>
                </StrategyItem>
              ))}
            </ListWrapper>
          )}
        </MyStrategyList>
      )}
      {!isShowDefaultStyle && (
        <Pagination currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} total={myStrategies.length} />
      )}
      <DefaultContent $isShowDefaultStyle={isShowDefaultStyle} onClick={handleVideoClick}>
        <VideoElement ref={videoRef} src={createStrateVideo} autoPlay loop muted playsInline />
        <SoundButton className='sound-button' onClick={handleSoundToggle}>
          {isMuted ? (
            <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M11 5L6 9H2V15H6L11 19V5Z'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path d='M23 9L17 15' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
              <path d='M17 9L23 15' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          ) : (
            <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M11 5L6 9H2V15H6L11 19V5Z'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          )}
        </SoundButton>
      </DefaultContent>
    </MyStrategyWrapper>
  )
})

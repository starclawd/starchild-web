import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import starchildVideoLoop from 'assets/home/starchild-loop.mp4'
import starchildVideo from 'assets/home/starchild.mp4'
import starchildVideoMobile from 'assets/home/starchild-mobile.mp4'
import { VideoPlayState } from '../../hooks/useVideoPlayback'
import Pending from 'components/Pending'

const VideoContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  z-index: 1;
`

const StarchildVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`

// 添加加载进度显示组件
const LoadingOverlay = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: ${(props) => (props.$show ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  color: white;
  font-family: 'PowerGrotesk';
  ${({ theme }) =>
    theme.isMobile
      ? `
          font-size: 0.12rem;
          line-height: 0.3rem;
        `
      : ``}
`

interface VideoPlayerProps {
  playState: VideoPlayState
  mainVideoSrc: string
  loadError: string
  isMobile: boolean
  loopVideoRef: React.RefObject<HTMLVideoElement | null>
  mainVideoRef: React.RefObject<HTMLVideoElement | null>
  isMainVideoLoading?: boolean
  login?: string
}

export default function VideoPlayer({
  playState,
  mainVideoSrc,
  loadError,
  isMobile,
  loopVideoRef,
  mainVideoRef,
  isMainVideoLoading = false,
  login,
}: VideoPlayerProps) {
  return (
    <VideoContainer>
      <StarchildVideo
        ref={loopVideoRef}
        src={starchildVideoLoop}
        muted
        autoPlay
        playsInline
        preload='metadata'
        crossOrigin='anonymous'
        style={{
          opacity: playState === 'main-playing' || playState === 'main-completed' ? 0 : 1,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />
      <StarchildVideo
        ref={mainVideoRef}
        src={mainVideoSrc || (isMobile ? starchildVideoMobile : starchildVideo)}
        muted
        playsInline
        preload='metadata'
        crossOrigin='anonymous'
        style={{
          opacity: playState === 'main-playing' || playState === 'main-completed' ? 1 : 0,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />
      <LoadingOverlay $show={!!loadError}>
        <div>
          {loadError && (
            <>
              <div>
                <Trans>❌ Main Video Load Failed</Trans>
              </div>
              <div style={{ fontSize: '12px', marginTop: '10px' }}>
                <Trans>Please refresh the page and try again.</Trans>
              </div>
            </>
          )}
        </div>
      </LoadingOverlay>

      {/* login=1 时主视频加载中显示 Pending */}
      {login === '1' && isMainVideoLoading && (
        <LoadingOverlay $show={true}>
          <Pending isFetching={true} />
        </LoadingOverlay>
      )}
    </VideoContainer>
  )
}

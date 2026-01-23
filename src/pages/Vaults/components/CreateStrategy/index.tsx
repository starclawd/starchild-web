import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import { ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import Modal from 'components/Modal'
import createStrategyBg from 'assets/vaults/create-strategy-bg.svg'
import { useSetCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { ANI_DURATION } from 'constants/index'
import createStrateVideo from 'assets/createstrategy/create-stratygy.mp4'

const BgImg = styled.img`
  position: absolute;
  top: 8px;
  right: 8px;
  object-fit: contain;
`

const CreateStrategyWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 158px;
  flex-shrink: 0;
  flex-grow: 0;
  gap: 12px;
  padding: 16px;
  width: 400px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.black800};
  background: ${({ theme }) => theme.black700};
`

const TopContent = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  z-index: 2;
`

const TopLeft = styled.div`
  display: flex;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  color: ${({ theme }) => theme.black0};
`

const TopRight = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.brand100};
  > span:first-child {
    display: inline-block;
    height: 64px;
    text-align: right;
    span:first-child {
      font-size: 48px;
      font-style: italic;
      font-weight: 700;
      line-height: 56px;
    }
    span:last-child {
      font-size: 20px;
      font-style: italic;
      font-weight: 700;
      line-height: 56px;
    }
  }
  > span:last-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
    text-align: right;
  }
`

const BottomContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  height: 32px;
  .bottom-content-text {
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    cursor: pointer;
    transition: color ${ANI_DURATION}s;
    color: ${({ theme }) => theme.black300};
    &:hover {
      color: ${({ theme }) => theme.black0};
    }
  }
`

const ButtonCreate = styled(ButtonCommon)`
  display: flex;
  align-items: center;
  width: 130px;
  height: 32px;
  gap: 4px;
  white-space: nowrap;
  .icon-create-strategy {
    font-size: 18px;
    color: ${({ theme }) => theme.black1000};
  }
`

const VideoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  video {
    max-width: 90vw;
    max-height: 90vh;
    border-radius: 8px;
  }
`

export default memo(function CreateStrategy() {
  const setCurrentRouter = useSetCurrentRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showVideo, setShowVideo] = useState(false)

  const goCreateStrategyPage = useCallback(() => {
    setCurrentRouter(ROUTER.CHAT)
  }, [setCurrentRouter])

  const handleOpenVideo = useCallback(() => {
    setShowVideo(true)
  }, [])

  const handleCloseVideo = useCallback(() => {
    setShowVideo(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [])

  return (
    <CreateStrategyWrapper>
      <BgImg src={createStrategyBg} alt='create-strategy-bg' width={120} />
      <TopContent>
        <TopLeft>
          <Trans>
            Launch your
            <br /> Strategy Agent
          </Trans>
        </TopLeft>
        <TopRight>
          <span>
            <span>10</span>
            <span>%</span>
          </span>
          <span>
            <Trans>Commission</Trans>
          </span>
        </TopRight>
      </TopContent>
      <BottomContent>
        <span className='bottom-content-text' onClick={handleOpenVideo}>
          <Trans>How to create a strategy?</Trans>
        </span>
        <ButtonCreate onClick={goCreateStrategyPage}>
          <IconBase className='icon-create-strategy' />
          <span>
            <Trans>Create strategy</Trans>
          </span>
        </ButtonCreate>
      </BottomContent>
      <Modal isOpen={showVideo} onDismiss={handleCloseVideo} useDismiss>
        <VideoWrapper>
          <video ref={videoRef} src={createStrateVideo} controls autoPlay />
        </VideoWrapper>
      </Modal>
    </CreateStrategyWrapper>
  )
})

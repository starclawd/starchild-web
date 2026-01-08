import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import { memo } from 'react'
import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import RhythmCanvas from '../RhythmCanvas'

const TvfSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 92px;
  border-radius: 4px;
  overflow: hidden;
`

const TopContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 32px;
  padding: 0 12px;
  span:first-child {
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    color: ${({ theme }) => theme.black200};
  }
  span:last-child {
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.black0};
  }
  background-color: ${({ theme }) => theme.black700};
`

const BottomContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
`

const BottomLeft = styled.div<{ $isFollowed: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  gap: 8px;
  background-color: ${({ $isFollowed, theme }) => ($isFollowed ? theme.black1000 : theme.brand100)};
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  .icon-boost {
    font-size: 28px;
    color: ${({ theme }) => theme.black1000};
  }
  span {
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
    color: ${({ theme }) => theme.black1000};
  }
  ${({ $isFollowed, theme }) =>
    $isFollowed
      ? css`
          cursor: default;
          span {
            color: ${theme.black200};
          }
          .icon-boost {
            color: ${theme.black200};
          }
        `
      : css`
          &:hover {
            opacity: 0.7;
          }
        `}
`

const BottomLeftContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  z-index: 2;
`

const ShareButton = styled(ButtonCommon)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 0;
  background-color: ${({ theme }) => theme.brand300};
  .icon-share {
    font-size: 24px;
    color: ${({ theme }) => theme.black0};
  }
`

export default memo(function TvfSection() {
  const isFollowed = false
  return (
    <TvfSectionWrapper>
      <TopContent>
        <span>TVF:</span>
        <span>--</span>
      </TopContent>
      <BottomContent>
        <BottomLeft $isFollowed={isFollowed}>
          <BottomLeftContent>
            <IconBase className='icon-boost' />
            <span>{isFollowed ? <Trans>Followed</Trans> : <Trans>Follow</Trans>}</span>
          </BottomLeftContent>
          <RhythmCanvas />
        </BottomLeft>
        <ShareButton>
          <IconBase className='icon-share' />
        </ShareButton>
      </BottomContent>
    </TvfSectionWrapper>
  )
})

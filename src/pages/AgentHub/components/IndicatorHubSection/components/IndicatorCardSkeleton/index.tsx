import styled, { css } from 'styled-components'
import { memo } from 'react'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { SkeletonAvatar, SkeletonText, SkeletonMultilineText } from 'components/Skeleton'

const IndicatorCardWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bgL1};
  overflow: hidden;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin: 0 ${vm(16)};
    `}
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 12px 12px 0 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(160)};
    `}
`

const AvatarContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      bottom: ${vm(12)};
      left: ${vm(12)};
    `}
`

const ContentContainer = styled.div`
  width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)};
      gap: ${vm(12)};
    `}
`

const StatsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(6)};
    `}
`

const StatItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.bgL2};
  padding: 8px 12px;
  border-radius: 6px;
  flex: 1;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(6)} ${vm(8)};
      border-radius: ${vm(4)};
    `}
`

const BottomContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`

export default memo(function IndicatorCardSkeleton() {
  return (
    <IndicatorCardWrapper $borderRadius={12} $borderColor='transparent'>
      {/* Top image container with avatar */}
      <ImageContainer>
        <AvatarContainer>
          <SkeletonAvatar size='60px' />
        </AvatarContainer>
      </ImageContainer>

      {/* Content container */}
      <ContentContainer>
        {/* Title skeleton */}
        <SkeletonText width='80%' height='20px' />

        {/* Description skeleton - 2 lines */}
        <SkeletonText width='100%' height='40px' />

        {/* Stats container */}
        <StatsContainer>
          <SkeletonText width='100%' height='20px' />
        </StatsContainer>

        {/* Bottom container */}
        <BottomContainer>
          {/* Creator info skeleton */}
          <SkeletonText width='80px' height='14px' />

          {/* Subscriber count skeleton */}
          <SkeletonText width='60px' height='14px' />
        </BottomContainer>
      </ContentContainer>
    </IndicatorCardWrapper>
  )
})

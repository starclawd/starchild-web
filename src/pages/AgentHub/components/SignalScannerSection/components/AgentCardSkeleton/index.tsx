import styled, { css } from 'styled-components'
import { memo } from 'react'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { vm } from 'pages/helper'
import { SkeletonAvatar, SkeletonText, SkeletonMultilineText } from 'components/Skeleton'

const CardWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  gap: 16px;
  padding: 20px;
  background: ${({ theme }) => theme.bgL1};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)};
      gap: ${vm(12)};
    `}
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(6)};
    `}
`

const BottomContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
`

const AvatarContainer = styled.div`
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(40)};
      height: ${vm(40)};
    `}
`

export default memo(function AgentCardSkeleton() {
  return (
    <CardWrapper $borderRadius={12} $borderColor='transparent'>
      <AvatarContainer>
        <SkeletonAvatar size='100px' />
      </AvatarContainer>
      <Content>
        {/* Title skeleton */}
        <SkeletonText width='70%' height='20px' />

        {/* Description skeleton - 2 lines */}
        <SkeletonMultilineText lines={2} />

        {/* Bottom container */}
        <BottomContainer>
          {/* Creator info skeleton */}
          <SkeletonText width='80px' height='14px' />

          {/* Subscriber count skeleton */}
          <SkeletonText width='60px' height='14px' />
        </BottomContainer>
      </Content>
    </CardWrapper>
  )
})

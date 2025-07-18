import styled, { css } from 'styled-components'
import { memo } from 'react'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { vm } from 'pages/helper'
import { SkeletonAvatar, SkeletonText, SkeletonMultilineText } from 'components/Skeleton'
import { useIsMobile } from 'store/application/hooks'

const CardWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  gap: 16px;
  padding: 8px;
  background: ${({ theme }) => theme.bgL1};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)};
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
  margin-top: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-top: ${vm(12)};
    `}
`

export default memo(function AgentCardSkeleton() {
  const isMobile = useIsMobile()

  return (
    <CardWrapper $borderRadius={12} $borderColor='transparent'>
      <SkeletonAvatar size={isMobile ? vm(44) : '100px'} />
      <Content>
        {/* Title skeleton */}
        <SkeletonText width='70%' height={isMobile ? vm(20) : '20px'} />

        {/* Description skeleton - 2 lines */}
        <SkeletonMultilineText lines={2} />

        {/* Bottom container */}
        <BottomContainer>
          {/* Creator info skeleton */}
          <SkeletonText width='80px' />

          {/* Subscriber count skeleton */}
          <SkeletonText width='60px' />
        </BottomContainer>
      </Content>
    </CardWrapper>
  )
})

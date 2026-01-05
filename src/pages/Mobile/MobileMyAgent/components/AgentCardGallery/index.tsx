import { memo, ReactNode, useState, useCallback } from 'react'
import { AgentInfo } from 'store/agenthub/agenthub'
import NoData from 'components/NoData'
import { styled, css } from 'styled-components'
import { vm } from 'pages/helper'
import AgentCardWithImage from 'pages/AgentHub/components/AgentCardList/components/AgentCardWithImage'
import Pending from 'components/Pending'
import { ANI_DURATION } from 'constants/index'
import { IconBase } from 'components/Icons'

type SkeletonType = 'default' | 'with-image'

const GalleryContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`

const GalleryWrapper = styled.div`
  display: flex;
  transition: transform ${ANI_DURATION}s ease;
  width: 100%;
`

const AgentCardContainer = styled.div`
  flex: 0 0 100%;
  width: 100%;
`

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-70%);
  width: ${vm(40)};
  height: ${vm(40)};
  border-radius: 50%;
  background: ${({ theme }) => theme.bgT20};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all ${ANI_DURATION}s ease;

  &:hover {
    background: ${({ theme }) => theme.bgT20};
    border-color: ${({ theme }) => theme.black600};
  }
`

const LeftButton = styled(NavigationButton)`
  left: 0;
  > i {
    color: ${({ theme }) => theme.black300};
    font-size: 0.24rem;
  }
`

const RightButton = styled(NavigationButton)`
  right: 0;
  > i {
    font-size: 0.24rem;
    color: ${({ theme }) => theme.black300};
    transform: rotate(180deg);
  }
`

const IndicatorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${vm(8)};
  margin-top: ${vm(16)};
`

const IndicatorDot = styled.div<{ $active: boolean }>`
  width: ${vm(8)};
  height: ${vm(8)};
  border-radius: 50%;
  background: ${({ theme, $active }) => ($active ? theme.brand100 : theme.black300)};
  transition: background ${ANI_DURATION}s ease;

  ${({ theme }) =>
    !theme.isMobile &&
    css`
      width: 8px;
      height: 8px;
    `}
`

interface AgentCardGalleryProps {
  agents: AgentInfo[]
  isLoading?: boolean
  maxAgents?: number
  skeletonType?: SkeletonType
  runAgentCard?: ReactNode
  showDescriptionButton?: boolean
  forceGoToDetail?: boolean
}

export default memo(function AgentCardGallery({
  agents,
  isLoading = false,
  maxAgents,
  showDescriptionButton = false,
  forceGoToDetail = false,
}: AgentCardGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // 限制显示的agents数量
  const displayAgents = maxAgents ? agents.slice(0, maxAgents) : agents

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }, [])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(displayAgents.length - 1, prev + 1))
  }, [displayAgents.length])

  if (isLoading) {
    return <Pending isNotButtonLoading />
  }

  // 如果没有数据，显示空状态
  if (!displayAgents.length) {
    return <NoData />
  }

  const isFirst = currentIndex === 0
  const isLast = currentIndex === displayAgents.length - 1

  return (
    <GalleryContainer>
      <GalleryWrapper style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {displayAgents.map((agent, index) => (
          <AgentCardContainer key={agent.agentId}>
            <AgentCardWithImage
              showDescriptionButton={showDescriptionButton}
              forceGoToDetail={forceGoToDetail}
              {...agent}
            />
          </AgentCardContainer>
        ))}
      </GalleryWrapper>

      {/* 左侧导航按钮 */}
      {!isFirst && (
        <LeftButton onClick={handlePrevious}>
          <IconBase className='icon-chat-back' />
        </LeftButton>
      )}

      {/* 右侧导航按钮 */}
      {!isLast && (
        <RightButton onClick={handleNext}>
          <IconBase className='icon-chat-back' />
        </RightButton>
      )}

      {/* 底部指示器 */}
      {displayAgents.length > 1 && (
        <IndicatorContainer>
          {displayAgents.map((_, index) => (
            <IndicatorDot key={index} $active={index === currentIndex} />
          ))}
        </IndicatorContainer>
      )}
    </GalleryContainer>
  )
})

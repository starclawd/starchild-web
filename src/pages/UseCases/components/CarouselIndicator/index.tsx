import { memo, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import { TAB_CONFIG, TabKey } from 'store/usecases/usecases.d'
import { useActiveTab, useCarouselPaused } from 'store/usecases/hooks/useUseCasesHooks'
import { vm } from 'pages/helper'
import { ANI_DURATION } from 'constants/index'

// 移动端轮播指示器容器
const CarouselIndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${vm(6)};
  margin-top: ${vm(8)};
  ${({ theme }) =>
    !theme.isMobile &&
    css`
      display: none;
    `}
`

// 轮播指示器点
const CarouselDot = styled.div<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? vm(20) : vm(8))};
  height: ${vm(2)};
  border-radius: ${vm(1)};
  background-color: ${({ $active, theme }) => ($active ? theme.brand100 : 'rgba(255, 255, 255, 0.2)')};
  transition: all ${ANI_DURATION}s;
`

interface CarouselIndicatorProps {}

const CarouselIndicator = memo<CarouselIndicatorProps>(() => {
  const [activeTab, setActiveTab] = useActiveTab()
  const [isPaused] = useCarouselPaused()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const tabKeys = TAB_CONFIG.map((tab) => tab.value as TabKey)
  const currentTabIndex = tabKeys.indexOf(activeTab)

  // 自动轮播逻辑
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // 2秒后切换到下一个tab
    intervalRef.current = setInterval(() => {
      const nextIndex = (currentTabIndex + 1) % tabKeys.length
      const nextTab = tabKeys[nextIndex]
      setActiveTab(nextTab)
    }, 2100)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused, currentTabIndex, tabKeys, setActiveTab])

  return (
    <CarouselIndicatorContainer>
      {tabKeys.map((tabKey, index) => (
        <CarouselDot key={tabKey} $active={index === currentTabIndex} />
      ))}
    </CarouselIndicatorContainer>
  )
})

CarouselIndicator.displayName = 'CarouselIndicator'

export default CarouselIndicator

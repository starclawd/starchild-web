import { vm } from 'pages/helper'
import { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useIsMobile } from 'store/application/hooks'
import { TAB_TYPE, TabListProps } from './types'

export { TAB_TYPE }
export type { TabListProps }

// MoveTabList 样式的 Wrapper
const MoveTabListWrapper = styled(BorderAllSide1PxBox)<{
  $forceWebStyle?: boolean
  $tabType?: TAB_TYPE
  $gap?: number
}>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: fit-content;
  height: 44px;
  padding: 4px;
  gap: ${({ $gap }) => $gap}px;
  position: relative;
  ${({ theme, $forceWebStyle, $gap }) =>
    theme.isMobile &&
    !$forceWebStyle &&
    css`
      padding: ${vm(4)};
    `}
  ${({ $tabType, $gap }) =>
    $tabType === TAB_TYPE.LINE &&
    css`
      padding: 0;
      gap: ${`${$gap}px`};
    `}
`

// SIMPLE 样式的 Wrapper（原来 TabList 的样式）
const SimpleTabListWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`

// SIMPLE 样式的 TabItem（原来 TabList 的样式）
const SimpleTabItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  gap: 4px;
  height: 100%;
  padding: 0 12px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  border-radius: 4px;
  transition: all ${ANI_DURATION}s;
  border: 1px solid ${({ theme, $active }) => ($active ? theme.black800 : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.black0 : theme.black200)};
  background-color: ${({ $active, theme }) => ($active ? theme.black600 : 'transparent')};
  cursor: pointer;
  i {
    transition: all ${ANI_DURATION}s;
    font-size: 18px;
    color: ${({ theme, $active }) => ($active ? theme.black0 : theme.black200)};
  }
  ${({ $active, theme }) =>
    !$active &&
    css`
      &:hover {
        opacity: 0.7;
      }
    `}
`

const ActiveIndicator = styled.div.attrs<{
  $translateX: string
  $width: number
  $forceWebStyle?: boolean
  $tabType?: TAB_TYPE
  $borderRadius?: number
  $background?: string
}>(({ $translateX, $width, $borderRadius, theme, $forceWebStyle }) => ({
  style: {
    transform: `translateX(${$translateX})`,
    width: `${$width}px`,
    borderRadius: theme.isMobile && !$forceWebStyle ? `${vm($borderRadius || 6)}` : `${$borderRadius || 8}px`,
  },
}))<{
  $translateX: string
  $width: number
  $forceWebStyle?: boolean
  $tabType?: TAB_TYPE
  $borderRadius?: number
  $background?: string
}>`
  position: absolute;
  top: 3px;
  left: 4px;
  height: 100%;
  background: ${({ theme, $background }) => $background || theme.brand200};
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
  ${({ theme, $forceWebStyle }) =>
    theme.isMobile &&
    !$forceWebStyle &&
    css`
      top: ${vm(3)};
    `}
  ${({ $tabType, theme, $forceWebStyle, $background }) =>
    $tabType === TAB_TYPE.LINE &&
    css`
      top: 0;
      left: 0;
      border-radius: 0 !important;
      background: transparent;
      border-bottom: 1px solid ${$background || theme.brand100};
    `}
`

const TabItem = styled.div<{
  $isActive: boolean
  $tabCount: number
  $forceWebStyle?: boolean
  $tabType?: TAB_TYPE
  $borderRadius?: number
  $gap?: number
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: ${({ $tabCount, $gap = 4 }) => `calc((100% - ${$gap * ($tabCount - 1)}px) / ${$tabCount})`};
  flex-shrink: 0;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  border-radius: ${({ $borderRadius }) => $borderRadius || 8}px;
  color: ${({ theme }) => theme.black0};
  background: transparent;
  position: relative;
  z-index: 1;
  transition: all ${ANI_DURATION}s;
  i {
    font-size: 18px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.black200};
  }
  ${({ theme, $forceWebStyle, $tabCount, $borderRadius, $gap = 4 }) =>
    theme.isMobile && !$forceWebStyle
      ? css`
          font-size: 0.13rem;
          line-height: 0.2rem;
          border-radius: ${vm($borderRadius || 6)};
          width: ${`calc((100% - ${$gap * ($tabCount - 1)}px) / ${$tabCount})`};
        `
      : css`
          cursor: pointer;
        `}
  ${({ $tabType, $isActive, theme }) =>
    $tabType === TAB_TYPE.LINE &&
    css`
      width: fit-content;
      padding: 0 16px;
      color: ${$isActive ? theme.black0 : theme.black200};
      i {
        color: ${$isActive ? theme.black0 : theme.black200};
      }
    `}
`

export default function TabList({
  className,
  tabKey,
  gap = 4,
  tabList,
  tabType = TAB_TYPE.LINE,
  borderRadius,
  itemBorderRadius,
  forceWebStyle = false,
  activeIndicatorBackground,
}: TabListProps) {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const tabRefs = useRef<(HTMLDivElement | null)[]>([])
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [tabDimensions, setTabDimensions] = useState<{ width: number; left: number }[]>([])
  const [wrapperWidth, setWrapperWidth] = useState<number>(0)

  const currentTabIndex = useMemo(() => {
    return tabList.findIndex((item) => item.key === tabKey) || 0
  }, [tabList, tabKey])

  // 测量TabItem的实际宽度和位置
  const measureTabs = useCallback(() => {
    const dimensions = tabRefs.current.map((ref, index) => {
      if (ref) {
        // 使用 offsetLeft 获取相对于定位父元素的偏移量
        // 这个值已经考虑了父元素的边框和padding
        const offsetLeft = ref.offsetLeft
        const width = ref.offsetWidth

        // 根据 tabType 决定 ActiveIndicator 的起始位置
        // LINE 模式下 left: 0px, BG 模式下 left: 4px
        const indicatorInitialLeft = tabType === TAB_TYPE.LINE ? 0 : 4
        const translateOffset = offsetLeft - indicatorInitialLeft

        return {
          width,
          left: translateOffset,
        }
      }
      return { width: 0, left: 0 }
    })
    setTabDimensions(dimensions)
  }, [tabType])

  // 测量包装器的宽度
  const measureWrapperWidth = () => {
    if (wrapperRef.current) {
      const newWidth = wrapperRef.current.offsetWidth
      setWrapperWidth(newWidth)
    }
  }

  // 初始化和窗口大小改变时重新测量
  useEffect(() => {
    // SIMPLE 模式不需要测量
    if (tabType === TAB_TYPE.SIMPLE) return

    // 使用 requestAnimationFrame 确保DOM渲染完成后再测量
    const measureAfterRender = () => {
      requestAnimationFrame(() => {
        measureWrapperWidth()
        setTimeout(() => {
          measureTabs()
        }, 300)
      })
    }

    measureAfterRender()

    const handleResize = () => {
      measureAfterRender()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [tabList, measureTabs, tabType])

  // 使用 ResizeObserver 监听包装器宽度变化
  useEffect(() => {
    // SIMPLE 模式不需要监听
    if (tabType === TAB_TYPE.SIMPLE) return
    if (!wrapperRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width
        if (newWidth !== wrapperWidth) {
          setWrapperWidth(newWidth)
          // 宽度变化时重新测量所有尺寸
          requestAnimationFrame(() => {
            measureTabs()
          })
        }
      }
    })

    resizeObserver.observe(wrapperRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [wrapperWidth, measureTabs, tabType])

  // 当tabIndex改变时也重新测量（确保获取最新的尺寸）
  useEffect(() => {
    // SIMPLE 模式不需要测量
    if (tabType === TAB_TYPE.SIMPLE) return

    requestAnimationFrame(() => {
      measureTabs()
    })
  }, [currentTabIndex, measureTabs, tabType])

  // 计算背景指示器的位置和宽度
  const { translateX, indicatorWidth } = useMemo(() => {
    const currentTab = tabDimensions[currentTabIndex]

    if (!currentTab) {
      // 如果还没有测量到尺寸，使用默认的百分比计算
      const translateDistance = `${100 * currentTabIndex}%`
      return {
        translateX: translateDistance,
        indicatorWidth: 0,
      }
    }
    return {
      translateX: `${currentTab.left}px`,
      indicatorWidth: currentTab.width,
    }
  }, [currentTabIndex, tabDimensions])

  // SIMPLE 模式：渲染原来 TabList 的简单样式
  if (tabType === TAB_TYPE.SIMPLE) {
    return (
      <SimpleTabListWrapper className={`tab-list-wrapper ${className || ''}`}>
        {tabList.map((item) => {
          const { key, text, icon, clickCallback } = item
          const isActive = tabKey === key
          return (
            <SimpleTabItem
              key={key}
              $active={isActive}
              className={`tab-item ${isActive ? 'active' : ''}`}
              onClick={clickCallback}
            >
              {icon}
              <span>{text}</span>
            </SimpleTabItem>
          )
        })}
      </SimpleTabListWrapper>
    )
  }

  // LINE 和 BG 模式：渲染带动画指示器的样式
  return (
    <MoveTabListWrapper
      ref={wrapperRef}
      $tabType={tabType}
      className={`tab-list-wrapper ${className ? className : ''}`}
      $gap={gap}
      $borderRadius={tabType === TAB_TYPE.LINE ? 0 : borderRadius || (isMobile ? 8 : 12)}
      $borderColor={tabType === TAB_TYPE.LINE ? 'transparent' : theme.black600}
      $forceWebStyle={forceWebStyle}
    >
      {tabList.length > 1 && (
        <ActiveIndicator
          className='active-indicator'
          $translateX={translateX}
          $width={indicatorWidth}
          $tabType={tabType}
          $borderRadius={itemBorderRadius}
          $forceWebStyle={forceWebStyle}
          $background={activeIndicatorBackground}
        />
      )}
      {tabList.map((item, index) => {
        const { key, text, icon, clickCallback } = item
        const isActive = tabKey === key
        return (
          <TabItem
            $borderRadius={itemBorderRadius}
            $tabType={tabType}
            $gap={gap}
            key={key}
            ref={(el) => {
              if (el) {
                tabRefs.current[index] = el
              }
            }}
            className={`tab-item ${isActive ? 'active' : ''}`}
            $forceWebStyle={forceWebStyle}
            $tabCount={tabList.length}
            $isActive={isActive}
            onClick={clickCallback}
          >
            {icon}
            {text}
          </TabItem>
        )
      })}
    </MoveTabListWrapper>
  )
}

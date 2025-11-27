import { vm } from 'pages/helper'
import { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useIsMobile } from 'store/application/hooks'

export enum MoveType {
  LINE = 'line',
  BG = 'bg',
}

const MoveTabListWrapper = styled(BorderAllSide1PxBox)<{ $forceWebStyle?: boolean; $moveType?: MoveType }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  height: 44px;
  padding: 4px;
  gap: 4px;
  position: relative;
  ${({ theme, $forceWebStyle }) =>
    theme.isMobile &&
    !$forceWebStyle &&
    css`
      height: ${vm(36)};
      padding: ${vm(4)};
      gap: ${vm(8)};
    `}
  ${({ $moveType }) =>
    $moveType === MoveType.LINE &&
    css`
      padding: 0;
      gap: 0;
    `}
`

const ActiveIndicator = styled.div.attrs<{
  $translateX: string
  $width: number
  $forceWebStyle?: boolean
  $moveType?: MoveType
  $borderRadius?: number
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
  $moveType?: MoveType
  $borderRadius?: number
}>`
  position: absolute;
  top: 3px;
  left: 4px;
  height: 36px;
  background: ${({ theme }) => theme.brand200};
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
  ${({ theme, $forceWebStyle }) =>
    theme.isMobile &&
    !$forceWebStyle &&
    css`
      top: ${vm(3)};
      height: ${vm(28)};
    `}
  ${({ $moveType, theme, $forceWebStyle }) =>
    $moveType === MoveType.LINE &&
    css`
      top: 0;
      left: 0;
      height: ${theme.isMobile && !$forceWebStyle ? vm(28) : '36px'};
      border-radius: 0 !important;
      background: transparent;
      border-bottom: 1px solid ${theme.textL1};
    `}
`

const TabItem = styled.div<{
  $isActive: boolean
  $tabCount: number
  $forceWebStyle?: boolean
  $moveType?: MoveType
  $borderRadius?: number
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $tabCount }) => `calc((100% - ${4 * ($tabCount - 1)}px) / ${$tabCount})`};
  flex-shrink: 0;
  height: 36px;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  border-radius: ${({ $borderRadius }) => $borderRadius || 8}px;
  color: ${({ theme }) => theme.textL1};
  background: transparent;
  position: relative;
  z-index: 1;
  transition: all ${ANI_DURATION}s;
  ${({ theme, $forceWebStyle, $tabCount, $borderRadius }) =>
    theme.isMobile && !$forceWebStyle
      ? css`
          height: ${vm(28)};
          font-size: 0.13rem;
          line-height: 0.2rem;
          border-radius: ${vm($borderRadius || 6)};
          width: ${`calc((100% - ${8 * ($tabCount - 1)}px) / ${$tabCount})`};
        `
      : css`
          cursor: pointer;
        `}
  ${({ $moveType, $isActive, theme }) =>
    $moveType === MoveType.LINE &&
    css`
      width: fit-content;
      padding: 0 16px;
      color: ${$isActive ? theme.textL1 : theme.textL4};
    `}
`

export default function MoveTabList({
  tabIndex,
  tabList,
  moveType = MoveType.BG,
  borderRadius,
  itemBorderRadius,
  forceWebStyle = false,
}: {
  tabIndex: number
  moveType?: MoveType
  borderRadius?: number
  itemBorderRadius?: number
  tabList: {
    key: number
    text: React.ReactNode
    clickCallback: () => void
  }[]
  forceWebStyle?: boolean
}) {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const tabRefs = useRef<(HTMLDivElement | null)[]>([])
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [tabDimensions, setTabDimensions] = useState<{ width: number; left: number }[]>([])
  const [wrapperWidth, setWrapperWidth] = useState<number>(0)

  // 测量TabItem的实际宽度和位置
  const measureTabs = useCallback(() => {
    const dimensions = tabRefs.current.map((ref, index) => {
      if (ref) {
        // 使用 offsetLeft 获取相对于定位父元素的偏移量
        // 这个值已经考虑了父元素的边框和padding
        const offsetLeft = ref.offsetLeft
        const width = ref.offsetWidth

        // 根据 moveType 决定 ActiveIndicator 的起始位置
        // LINE 模式下 left: 0px, BG 模式下 left: 4px
        const indicatorInitialLeft = moveType === MoveType.LINE ? 0 : 4
        const translateOffset = offsetLeft - indicatorInitialLeft

        return {
          width,
          left: translateOffset,
        }
      }
      return { width: 0, left: 0 }
    })
    setTabDimensions(dimensions)
  }, [moveType])

  // 测量包装器的宽度
  const measureWrapperWidth = () => {
    if (wrapperRef.current) {
      const newWidth = wrapperRef.current.offsetWidth
      setWrapperWidth(newWidth)
    }
  }

  // 初始化和窗口大小改变时重新测量
  useEffect(() => {
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
  }, [tabList, measureTabs])

  // 使用 ResizeObserver 监听包装器宽度变化
  useEffect(() => {
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
  }, [wrapperWidth, measureTabs])

  // 当tabIndex改变时也重新测量（确保获取最新的尺寸）
  useEffect(() => {
    requestAnimationFrame(() => {
      measureTabs()
    })
  }, [tabIndex, measureTabs])

  // 计算背景指示器的位置和宽度
  const { translateX, indicatorWidth } = useMemo(() => {
    const currentTab = tabDimensions[tabIndex]

    if (!currentTab) {
      // 如果还没有测量到尺寸，使用默认的百分比计算
      const translateDistance = `${100 * tabIndex}%`
      return {
        translateX: translateDistance,
        indicatorWidth: 0,
      }
    }
    return {
      translateX: `${currentTab.left}px`,
      indicatorWidth: currentTab.width,
    }
  }, [tabIndex, tabDimensions])

  return (
    <MoveTabListWrapper
      ref={wrapperRef}
      $moveType={moveType}
      className='tab-list-wrapper'
      $borderRadius={moveType === MoveType.LINE ? 0 : borderRadius || (isMobile ? 8 : 12)}
      $borderColor={moveType === MoveType.LINE ? 'transparent' : theme.bgT30}
      $forceWebStyle={forceWebStyle}
    >
      {tabList.length > 1 && (
        <ActiveIndicator
          className='active-indicator'
          $translateX={translateX}
          $width={indicatorWidth}
          $moveType={moveType}
          $borderRadius={itemBorderRadius}
          $forceWebStyle={forceWebStyle}
        />
      )}
      {tabList.map((item, index) => {
        const { key, text, clickCallback } = item
        const isActive = tabIndex === key
        return (
          <TabItem
            $borderRadius={itemBorderRadius}
            $moveType={moveType}
            key={key}
            ref={(el) => {
              if (el) {
                tabRefs.current[index] = el
              }
            }}
            className={`move-tab-item ${isActive ? 'active' : ''}`}
            $forceWebStyle={forceWebStyle}
            $tabCount={tabList.length}
            $isActive={isActive}
            onClick={clickCallback}
          >
            {text}
          </TabItem>
        )
      })}
    </MoveTabListWrapper>
  )
}

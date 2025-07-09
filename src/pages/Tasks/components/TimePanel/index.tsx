import { Trans } from '@lingui/react/macro'
import { Dispatch, SetStateAction, useCallback, useMemo, useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

export enum WEEKLY_VALUE {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

const TimePanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 34px;
  padding: 8px 20px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL4};
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 8px 20px 20px;
`
const Header = styled.div`
  display: flex;
  width: 100%;
  height: 18px;
  gap: 12px;
  span {
    width: 50%;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    text-align: center;
    color: ${({ theme }) => theme.textL2};
  }
`

const List = styled.div`
  display: flex;
  width: 100%;
  gap: 12px;
  height: 226px;
`

const HourContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 89px;
    left: 0;
    width: 100%;
    height: 1px;
    background: ${({ theme }) => theme.bgT20};
  }
  &::after {
    content: '';
    position: absolute;
    top: 137px;
    left: 0;
    width: 100%;
    height: 1px;
    background: ${({ theme }) => theme.bgT20};
  }
`

const MinuteContent = styled(HourContent)``

const HourList = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 12px;
  cursor: grab;
  overflow-y: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  /* 添加顶部和底部空白，使首尾项能滚动到中心 */
  padding-top: calc(50% - 28px);
  padding-bottom: calc(50% - 28px);
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  transition: scroll-behavior 0.1s ease; /* 添加scroll-behavior过渡 */
  &:active {
    cursor: grabbing;
  }
`

const MinuteList = styled(HourList)``

const HourItem = styled.div<{ $isSelected: boolean; $position: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
  height: ${({ $position }) => {
    // 位置 0 表示中心项，-3, -2, -1 表示上方项目，1, 2, 3 表示下方项目
    switch (Math.abs($position)) {
      case 0:
        return '48px' // 中心项
      case 1:
        return '20px' // 中心项上下相邻的项
      case 2:
        return '18px' // 再外层的项
      case 3:
        return '14px' // 最外层的项
      default:
        return '14px' // 默认值
    }
  }};
  font-size: ${({ $position }) => {
    // 位置 0 表示中心项，-3, -2, -1 表示上方项目，1, 2, 3 表示下方项目
    switch (Math.abs($position)) {
      case 0:
        return '16px' // 中心项
      case 1:
        return '14px' // 中心项上下相邻的项
      case 2:
        return '12px' // 再外层的项
      case 3:
        return '10px' // 最外层的项
      default:
        return '10px' // 默认值
    }
  }};
  user-select: none;
  color: ${({ theme, $isSelected }) => ($isSelected ? theme.textL1 : theme.textL3)};
  font-weight: ${({ $isSelected }) => ($isSelected ? 500 : 400)};
  transition:
    height 0.1s ease-out,
    color 0.1s ease-out,
    font-weight 0.1s ease-out,
    font-size 0.1s ease-out;
  scroll-snap-align: center; /* 所有项都设置为中心对齐 */
`

const MinuteItem = styled(HourItem)``

// 更简单的计算方式
const ITEM_HEIGHT = 48 // 中心项高度
const ITEM_GAP = 12 // 项目间距
const SCROLL_UNIT = ITEM_HEIGHT + ITEM_GAP // 单个滚动单位

export default function TimePanel({
  hours,
  minutes,
  setHours,
  setMinutes,
}: {
  hours: number
  minutes: number
  setHours: Dispatch<SetStateAction<number>>
  setMinutes: Dispatch<SetStateAction<number>>
}) {
  const hoursRef = useRef(hours)
  const minutesRef = useRef(minutes)
  const [currentHour, setCurrentHour] = useState(hours)
  const [currentMinute, setCurrentMinute] = useState(minutes)

  // 当props更新时，同步更新ref和state
  useEffect(() => {
    hoursRef.current = hours
    setCurrentHour(hours)
  }, [hours])

  useEffect(() => {
    minutesRef.current = minutes
    setCurrentMinute(minutes)
  }, [minutes])

  const hourListRef = useRef<HTMLDivElement>(null)
  const minuteListRef = useRef<HTMLDivElement>(null)

  const draggingHourRef = useRef(false)
  const draggingMinuteRef = useRef(false)
  const startYHourRef = useRef(0)
  const startYMinuteRef = useRef(0)
  const scrollTopHourRef = useRef(0)
  const scrollTopMinuteRef = useRef(0)

  const hoursList = useMemo(() => {
    return Array.from({ length: 24 }, (_, index) => index)
  }, [])
  const minutesList = useMemo(() => {
    return Array.from({ length: 60 }, (_, index) => index)
  }, [])

  const scrollToValue = useCallback(
    (ref: React.RefObject<HTMLDivElement | null>, value: number, listLength: number) => {
      if (ref.current) {
        // 考虑间距的滚动位置计算
        const targetScrollTop = value * SCROLL_UNIT
        ref.current.scrollTop = targetScrollTop
      }
    },
    [],
  )

  // 全局鼠标移动处理函数
  const handleGlobalMouseMove = useCallback((event: MouseEvent) => {
    if (draggingHourRef.current && hourListRef.current) {
      const deltaY = event.clientY - startYHourRef.current
      hourListRef.current.scrollTop = scrollTopHourRef.current - deltaY
    } else if (draggingMinuteRef.current && minuteListRef.current) {
      const deltaY = event.clientY - startYMinuteRef.current
      minuteListRef.current.scrollTop = scrollTopMinuteRef.current - deltaY
    }
  }, [])

  // 计算特定索引对应的滚动位置
  const getScrollTopForIndex = useCallback((targetIndex: number, listLength: number = 24) => {
    if (targetIndex === 0) return 0

    // 先按正常逻辑计算
    let scrollTop = 0
    const visibleHeights = [20, 18, 14]

    // 计算前面项目的高度
    for (let i = 0; i < targetIndex; i++) {
      if (i < 3) {
        scrollTop += visibleHeights[i]
      } else {
        scrollTop += 14
      }
    }

    // 添加间距
    scrollTop += targetIndex * 12

    // 对于接近末尾的索引，检查是否超出最大可滚动范围
    if (targetIndex >= listLength - 3) {
      // 计算理论上的最大scrollTop（所有内容高度 - 容器高度）
      let totalContentHeight = 0

      // 计算所有项目高度（这里使用实际的动态高度逻辑）
      for (let i = 0; i < listLength; i++) {
        const position = i - targetIndex // 相对于目标位置
        switch (Math.abs(position)) {
          case 0:
            totalContentHeight += 48
            break
          case 1:
            totalContentHeight += 20
            break
          case 2:
            totalContentHeight += 18
            break
          case 3:
            totalContentHeight += 14
            break
          default:
            totalContentHeight += 14
            break
        }
        if (i > 0) totalContentHeight += 12 // 间距
      }

      // 加上padding
      const containerHeight = 226
      const paddingTop = 113
      const paddingBottom = 113
      const maxPossibleScrollTop = totalContentHeight + paddingTop + paddingBottom - containerHeight

      // 如果计算的scrollTop超出了最大值，使用最大值
      if (scrollTop > maxPossibleScrollTop) {
        scrollTop = Math.max(0, maxPossibleScrollTop)
      }
    }

    return scrollTop
  }, [])

  // 通过观察DOM元素位置来获取实际的中心项索引
  const getCenterItemIndex = useCallback((containerRef: React.RefObject<HTMLDivElement | null>) => {
    if (!containerRef.current) return 0

    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    const containerCenterY = containerRect.top + containerRect.height / 2
    const scrollTop = container.scrollTop

    // 获取所有项目元素
    const items = container.children
    let centerIndex = 0
    let minDistance = Infinity

    // 特殊处理边界情况
    if (scrollTop <= 10) {
      return 0
    }

    // 计算最大可滚动距离
    const maxScrollTop = container.scrollHeight - container.clientHeight
    if (scrollTop >= maxScrollTop - 10) {
      return items.length - 1
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i] as HTMLElement
      const itemRect = item.getBoundingClientRect()
      const itemCenterY = itemRect.top + itemRect.height / 2
      const distance = Math.abs(itemCenterY - containerCenterY)

      if (distance < minDistance) {
        minDistance = distance
        centerIndex = i
      }
    }

    return centerIndex
  }, [])

  const handleDragEnd = useCallback(
    (type: 'hour' | 'minute') => {
      let currentRef: React.RefObject<HTMLDivElement | null> = hourListRef
      let list: number[] = []
      let setter: Dispatch<SetStateAction<number>> | null = null
      let currentDraggingRef: React.MutableRefObject<boolean> | null = null

      if (type === 'hour') {
        currentRef = hourListRef
        list = hoursList
        setter = setCurrentHour
        currentDraggingRef = draggingHourRef
      } else {
        currentRef = minuteListRef
        list = minutesList
        setter = setCurrentMinute
        currentDraggingRef = draggingMinuteRef
      }

      if (currentDraggingRef && currentDraggingRef.current && currentRef && currentRef.current) {
        currentDraggingRef.current = false
        const currentScrollTop = currentRef.current.scrollTop

        // 立即重新启用scroll-snap，让其自然捕捉
        if (currentRef.current) {
          currentRef.current.style.scrollSnapType = 'y mandatory'
          currentRef.current.style.scrollBehavior = 'smooth'

          const beforeSnapScrollTop = currentRef.current.scrollTop

          // 使用requestAnimationFrame等待下一帧，然后检测位置
          requestAnimationFrame(() => {
            setTimeout(() => {
              if (currentRef.current && setter) {
                const finalIndex = getCenterItemIndex(currentRef)

                // 更新状态
                setter(finalIndex)
                if (type === 'hour') setHours(finalIndex)
                else setMinutes(finalIndex)
              }
            }, 100) // 进一步减少延迟
          })
        }
      }
    },
    [hoursList, minutesList, setHours, setMinutes, getCenterItemIndex],
  )

  // 全局鼠标松开处理函数
  const handleGlobalMouseUp = useCallback(() => {
    if (draggingHourRef.current) {
      handleDragEnd('hour')
    } else if (draggingMinuteRef.current) {
      handleDragEnd('minute')
    }

    // 移除全局事件监听
    document.removeEventListener('mousemove', handleGlobalMouseMove)
    document.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [handleDragEnd, handleGlobalMouseMove])

  const handleMouseDown = useCallback(
    (type: 'hour' | 'minute', event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault() // 防止默认行为干扰拖动

      if (type === 'hour' && hourListRef.current) {
        draggingHourRef.current = true
        startYHourRef.current = event.clientY
        scrollTopHourRef.current = hourListRef.current.scrollTop
        // 拖动时禁用滚动捕捉，使拖动更流畅
        hourListRef.current.style.scrollSnapType = 'none'
        hourListRef.current.style.scrollBehavior = 'auto'

        // 添加全局鼠标事件处理
        document.addEventListener('mousemove', handleGlobalMouseMove)
        document.addEventListener('mouseup', handleGlobalMouseUp)
      } else if (type === 'minute' && minuteListRef.current) {
        draggingMinuteRef.current = true
        startYMinuteRef.current = event.clientY
        scrollTopMinuteRef.current = minuteListRef.current.scrollTop
        // 拖动时禁用滚动捕捉，使拖动更流畅
        minuteListRef.current.style.scrollSnapType = 'none'
        minuteListRef.current.style.scrollBehavior = 'auto'

        // 添加全局鼠标事件处理
        document.addEventListener('mousemove', handleGlobalMouseMove)
        document.addEventListener('mouseup', handleGlobalMouseUp)
      }
    },
    [handleGlobalMouseMove, handleGlobalMouseUp],
  )

  // 移除旧的鼠标事件处理函数，改用全局事件处理
  const handleMouseMove = () => {}
  const handleMouseUpAndLeave = () => {}

  const getVisibleRange = (currentIndex: number, listLength: number) => {
    const halfVisible = 3 // 设置为固定值，每侧显示3个项目
    let start = currentIndex - halfVisible
    let end = currentIndex + halfVisible

    if (start < 0) {
      end -= start // Add the difference to the end
      start = 0
    }
    if (end >= listLength) {
      start -= end - (listLength - 1) // Subtract the difference from the start
      end = listLength - 1
    }
    // Ensure start is not negative after adjustment
    start = Math.max(0, start)

    return { start, end }
  }

  const visibleHours = useMemo(() => {
    const { start, end } = getVisibleRange(currentHour, hoursList.length)
    return hoursList.slice(start, end + 1)
  }, [currentHour, hoursList])

  const visibleMinutes = useMemo(() => {
    const { start, end } = getVisibleRange(currentMinute, minutesList.length)
    return minutesList.slice(start, end + 1)
  }, [currentMinute, minutesList])

  const getItemPosition = useCallback((itemValue: number, currentValue: number, list: number[]) => {
    // 计算项目相对于当前选中项的位置（-3到+3）
    const itemIndex = list.indexOf(itemValue)
    const currentIndex = list.indexOf(currentValue)
    return itemIndex - currentIndex
  }, [])

  // 组件卸载时清理事件监听
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [handleGlobalMouseMove, handleGlobalMouseUp])

  // 初始化时设置滚动位置
  useEffect(() => {
    if (hourListRef.current) {
      hourListRef.current.style.scrollBehavior = 'auto'
      hourListRef.current.scrollTop = getScrollTopForIndex(hoursRef.current, 24)
      setTimeout(() => {
        if (hourListRef.current) {
          hourListRef.current.style.scrollBehavior = 'smooth'
        }
      }, 0)
    }
  }, [getScrollTopForIndex]) // 只在组件挂载时执行一次

  useEffect(() => {
    if (minuteListRef.current) {
      minuteListRef.current.style.scrollBehavior = 'auto'
      minuteListRef.current.scrollTop = getScrollTopForIndex(minutesRef.current, 60)
      setTimeout(() => {
        if (minuteListRef.current) {
          minuteListRef.current.style.scrollBehavior = 'smooth'
        }
      }, 0)
    }
  }, [getScrollTopForIndex]) // 只在组件挂载时执行一次

  return (
    <TimePanelWrapper onClick={(e) => e.stopPropagation()}>
      <Title>
        <Trans>Select time</Trans>
      </Title>
      <Content>
        <Header>
          <span>
            <Trans>Hour</Trans>
          </span>
          <span>
            <Trans>Minute</Trans>
          </span>
        </Header>
        <List>
          <HourContent onMouseDown={(e) => handleMouseDown('hour', e)}>
            <HourList ref={hourListRef}>
              {hoursList.map((hour) => (
                <HourItem
                  key={hour}
                  $isSelected={hour === currentHour}
                  $position={getItemPosition(hour, currentHour, hoursList)}
                >
                  {String(hour).padStart(2, '0')}
                </HourItem>
              ))}
            </HourList>
          </HourContent>
          <MinuteContent onMouseDown={(e) => handleMouseDown('minute', e)}>
            <MinuteList ref={minuteListRef}>
              {minutesList.map((minute) => (
                <MinuteItem
                  key={minute}
                  $isSelected={minute === currentMinute}
                  $position={getItemPosition(minute, currentMinute, minutesList)}
                >
                  {String(minute).padStart(2, '0')}
                </MinuteItem>
              ))}
            </MinuteList>
          </MinuteContent>
        </List>
      </Content>
    </TimePanelWrapper>
  )
}

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
  SUNDAY = 'Sunday'
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
  &:active {
    cursor: grabbing;
  }
`

const MinuteList = styled(HourList)``

const HourItem = styled.div<{isSelected: boolean, position: number}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
  height: ${({ position }) => {
    // 位置 0 表示中心项，-3, -2, -1 表示上方项目，1, 2, 3 表示下方项目
    switch (Math.abs(position)) {
      case 0: return '48px'; // 中心项
      case 1: return '20px'; // 中心项上下相邻的项
      case 2: return '18px'; // 再外层的项
      case 3: return '14px'; // 最外层的项
      default: return '14px'; // 默认值
    }
  }};
  font-size: ${({ position }) => {
    // 位置 0 表示中心项，-3, -2, -1 表示上方项目，1, 2, 3 表示下方项目
    switch (Math.abs(position)) {
      case 0: return '16px'; // 中心项
      case 1: return '14px'; // 中心项上下相邻的项
      case 2: return '12px'; // 再外层的项
      case 3: return '10px'; // 最外层的项
      default: return '10px'; // 默认值
    }
  }};
  user-select: none;
  color: ${({ theme, isSelected }) => isSelected ? theme.textL1 : theme.textL3};
  font-weight: ${({ isSelected }) => isSelected ? 500 : 400};
  transition: height 0.1s ease-out, color 0.1s ease-out, font-weight 0.1s ease-out, font-size 0.1s ease-out;
  scroll-snap-align: center; /* 所有项都设置为中心对齐 */
`

const MinuteItem = styled(HourItem)``

// 更简单的计算方式
const ITEM_HEIGHT = 48; // 中心项高度
const ITEM_GAP = 12; // 项目间距
const SCROLL_UNIT = ITEM_HEIGHT + ITEM_GAP; // 单个滚动单位

export default function TimePanel({
  hours,
  minutes,
  setHours,
  setMinutes
}: {
  hours: number
  minutes: number
  setHours: Dispatch<SetStateAction<number>>
  setMinutes: Dispatch<SetStateAction<number>>
}) {
  const [currentHour, setCurrentHour] = useState(hours);
  const [currentMinute, setCurrentMinute] = useState(minutes);

  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);

  const draggingHourRef = useRef(false);
  const draggingMinuteRef = useRef(false);
  const startYHourRef = useRef(0);
  const startYMinuteRef = useRef(0);
  const scrollTopHourRef = useRef(0);
  const scrollTopMinuteRef = useRef(0);


  const hoursList = useMemo(() => {
    return Array.from({ length: 24 }, (_, index) => index)
  }, [])
  const minutesList = useMemo(() => {
    return Array.from({ length: 60 }, (_, index) => index)
  }, [])

  const scrollToValue = useCallback((ref: React.RefObject<HTMLDivElement | null>, value: number, listLength: number) => {
    if (ref.current) {
      // 考虑间距的滚动位置计算
      const targetScrollTop = value * SCROLL_UNIT;
      ref.current.scrollTop = targetScrollTop;
    }
  }, []);

  // 全局鼠标移动处理函数
  const handleGlobalMouseMove = useCallback((event: MouseEvent) => {
    if (draggingHourRef.current && hourListRef.current) {
      const deltaY = event.clientY - startYHourRef.current;
      hourListRef.current.scrollTop = scrollTopHourRef.current - deltaY;
    } else if (draggingMinuteRef.current && minuteListRef.current) {
      const deltaY = event.clientY - startYMinuteRef.current;
      minuteListRef.current.scrollTop = scrollTopMinuteRef.current - deltaY;
    }
  }, []);

  // 计算特定索引对应的滚动位置
  const getScrollTopForIndex = useCallback((index: number) => {
    let scrollTop = 0;
    if (index > 0) {
      // 前三个可见项目的高度计算
      const visibleHeights = [20, 18, 14]; // 前三个可见项目的高度
      const visibleCount = Math.min(index, 3);
      
      // 计算可见项目的高度总和
      for (let i = 0; i < visibleCount; i++) {
        scrollTop += visibleHeights[i];
      }
      
      // 计算非可见项目的高度
      if (index > 3) {
        scrollTop += (index - 3) * 14; // 非可见项目固定14px高
      }
      
      // 添加所有间距
      scrollTop += index * ITEM_GAP;
    }
    return scrollTop;
  }, []);

  // 根据滚动位置计算索引
  const getIndexFromScrollTop = useCallback((scrollTop: number, listLength: number) => {
    // 对于scrollTop为0，返回索引0
    if (scrollTop <= 10) return 0;
    
    // 预先计算前几个索引的确切滚动位置
    const scrollPositions: number[] = [];
    for (let i = 0; i < listLength; i++) {
      scrollPositions.push(getScrollTopForIndex(i));
    }
    
    // 找到最接近当前滚动位置的索引
    let closestIndex = 0;
    let minDiff = Math.abs(scrollPositions[0] - scrollTop);
    
    for (let i = 1; i < scrollPositions.length; i++) {
      const diff = Math.abs(scrollPositions[i] - scrollTop);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    
    return closestIndex;
  }, [getScrollTopForIndex]);

  const handleDragEnd = useCallback((type: 'hour' | 'minute') => {
    let currentRef: React.RefObject<HTMLDivElement | null> = hourListRef;
    let list: number[] = [];
    let setter: Dispatch<SetStateAction<number>> | null = null;
    let currentDraggingRef: React.MutableRefObject<boolean> | null = null;

    if (type === 'hour') {
      currentRef = hourListRef;
      list = hoursList;
      setter = setCurrentHour;
      currentDraggingRef = draggingHourRef;
    } else {
      currentRef = minuteListRef;
      list = minutesList;
      setter = setCurrentMinute;
      currentDraggingRef = draggingMinuteRef;
    }

    if (currentDraggingRef && currentDraggingRef.current && currentRef && currentRef.current && setter) {
      currentDraggingRef.current = false;
      const currentScrollTop = currentRef.current.scrollTop;
      console.log('拖动结束时的scrollTop', currentScrollTop);
      
      // 使用新的计算方法获取索引
      const validatedIndex = getIndexFromScrollTop(currentScrollTop, list.length);
      console.log('计算的索引', validatedIndex);
      
      // 更新状态
      setter(validatedIndex);
      if (type === 'hour') setHours(validatedIndex);
      else setMinutes(validatedIndex);

      // 滚动到准确位置
      setTimeout(() => {
        if (currentRef.current) {
          // 暂时禁用滚动捕捉，确保我们可以精确设置滚动位置
          currentRef.current.style.scrollSnapType = 'none';
          currentRef.current.style.scrollBehavior = 'auto';
          
          // 使用函数计算准确的滚动位置
          const exactScrollTop = getScrollTopForIndex(validatedIndex);
          
          console.log('设置前exactScrollTop', exactScrollTop);
          currentRef.current.scrollTop = exactScrollTop;
          
          // 添加检查，确认是否设置成功
          console.log('设置后的scrollTop', currentRef.current.scrollTop);
          
          // 等待DOM更新后再启用滚动捕捉
          setTimeout(() => {
            if (currentRef.current) {
              // 再次检查滚动位置
              console.log('最终的scrollTop', currentRef.current.scrollTop);
              
              // 重新启用滚动捕捉和平滑滚动
              currentRef.current.style.scrollSnapType = 'y mandatory';
              currentRef.current.style.scrollBehavior = 'smooth';
            }
          }, 50);
        }
      }, 10);
    }
  }, [hoursList, minutesList, setHours, setMinutes, getIndexFromScrollTop, getScrollTopForIndex]);

  // 全局鼠标松开处理函数
  const handleGlobalMouseUp = useCallback(() => {
    if (draggingHourRef.current) {
      handleDragEnd('hour');
    } else if (draggingMinuteRef.current) {
      handleDragEnd('minute');
    }
    
    // 移除全局事件监听
    document.removeEventListener('mousemove', handleGlobalMouseMove);
    document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [handleDragEnd, handleGlobalMouseMove]);
  
  
  const handleMouseDown = useCallback((
    type: 'hour' | 'minute',
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault(); // 防止默认行为干扰拖动
    
    if (type === 'hour' && hourListRef.current) {
      draggingHourRef.current = true;
      startYHourRef.current = event.clientY;
      scrollTopHourRef.current = hourListRef.current.scrollTop;
      // 拖动时禁用滚动捕捉，使拖动更流畅
      hourListRef.current.style.scrollSnapType = 'none';
      hourListRef.current.style.scrollBehavior = 'auto';
      
      // 添加全局鼠标事件处理
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    } else if (type === 'minute' && minuteListRef.current) {
      draggingMinuteRef.current = true;
      startYMinuteRef.current = event.clientY;
      scrollTopMinuteRef.current = minuteListRef.current.scrollTop;
      // 拖动时禁用滚动捕捉，使拖动更流畅
      minuteListRef.current.style.scrollSnapType = 'none';
      minuteListRef.current.style.scrollBehavior = 'auto';
      
      // 添加全局鼠标事件处理
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [handleGlobalMouseMove, handleGlobalMouseUp]);

  console.log('currentHour', hourListRef.current?.scrollTop)

  // 移除旧的鼠标事件处理函数，改用全局事件处理
  const handleMouseMove = () => {};
  const handleMouseUpAndLeave = () => {};

  const getVisibleRange = (currentIndex: number, listLength: number) => {
    const halfVisible = 3; // 设置为固定值，每侧显示3个项目
    let start = currentIndex - halfVisible;
    let end = currentIndex + halfVisible;

    if (start < 0) {
        end -= start; // Add the difference to the end
        start = 0;
    }
    if (end >= listLength) {
        start -= (end - (listLength - 1)); // Subtract the difference from the start
        end = listLength - 1;
    }
    // Ensure start is not negative after adjustment
    start = Math.max(0, start);

    return { start, end };
  };


  const visibleHours = useMemo(() => {
    const { start, end } = getVisibleRange(currentHour, hoursList.length);
    return hoursList.slice(start, end + 1);
  }, [currentHour, hoursList]);

  const visibleMinutes = useMemo(() => {
    const { start, end } = getVisibleRange(currentMinute, minutesList.length);
    return minutesList.slice(start, end + 1);
  }, [currentMinute, minutesList]);


  const getItemPosition = useCallback((itemValue: number, currentValue: number, list: number[]) => {
    // 计算项目相对于当前选中项的位置（-3到+3）
    const itemIndex = list.indexOf(itemValue);
    const currentIndex = list.indexOf(currentValue);
    return itemIndex - currentIndex;
  }, []);


  // 组件卸载时清理事件监听
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleGlobalMouseMove, handleGlobalMouseUp]);


  useEffect(() => {
    if (hourListRef.current) {
      // 临时禁用平滑滚动
      hourListRef.current.style.scrollBehavior = 'auto';
      // 设置初始滚动位置
      hourListRef.current.scrollTop = getScrollTopForIndex(currentHour);
      // 重新启用平滑滚动
      setTimeout(() => {
        if (hourListRef.current) {
          hourListRef.current.style.scrollBehavior = 'smooth';
        }
      }, 0);
    }
  }, [currentHour, getScrollTopForIndex]);

  useEffect(() => {
    if (minuteListRef.current) {
      // 临时禁用平滑滚动
      minuteListRef.current.style.scrollBehavior = 'auto';
      // 设置初始滚动位置
      minuteListRef.current.scrollTop = getScrollTopForIndex(currentMinute);
      // 重新启用平滑滚动
      setTimeout(() => {
        if (minuteListRef.current) {
          minuteListRef.current.style.scrollBehavior = 'smooth';
        }
      }, 0);
    }
  }, [currentMinute, getScrollTopForIndex]);


  return <TimePanelWrapper onClick={e => e.stopPropagation()}>
    <Title><Trans>Select time</Trans></Title>
    <Content>
      <Header>
        <span><Trans>Hour</Trans></span>
        <span><Trans>Minute</Trans></span>
      </Header>
      <List>
        <HourContent
          onMouseDown={(e) => handleMouseDown('hour', e)}
        >
          <HourList ref={hourListRef}>
            {hoursList.map((hour) => (
              <HourItem 
                key={hour} 
                isSelected={hour === currentHour}
                position={getItemPosition(hour, currentHour, hoursList)}
              >
                {String(hour).padStart(2, '0')}
              </HourItem>
            ))}
          </HourList>
        </HourContent>
        <MinuteContent
          onMouseDown={(e) => handleMouseDown('minute', e)}
        >
          <MinuteList ref={minuteListRef}>
            {minutesList.map((minute) => (
              <MinuteItem 
                key={minute} 
                isSelected={minute === currentMinute}
                position={getItemPosition(minute, currentMinute, minutesList)}
              >
                {String(minute).padStart(2, '0')}
              </MinuteItem>
            ))}
          </MinuteList>
        </MinuteContent>
      </List>
    </Content>
  </TimePanelWrapper>
}

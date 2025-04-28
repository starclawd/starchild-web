import { t } from '@lingui/core/macro'
import { vm } from 'pages/helper'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSendAiContent } from 'store/tradeai/hooks'
import styled, { css } from 'styled-components'

const ShortcutsListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  gap: 12px;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(10)};
    padding-bottom: ${vm(24)};
  `}
`

const ShortcutsItem = styled.div<{ $isPaused: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  ${({ theme }) => theme.isMobile
  ? css`
    gap: ${vm(8)};
  `
  : css`
    cursor: pointer;
  `}
`

const ScrollContainer = styled.div<{ $isPaused: boolean; speed: number }>`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding-right: 12px;
  will-change: transform;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
    padding-right: ${vm(12)};
  `}
`

const ShortcutsItemItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 36px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  padding: 8px 12px;
  border-radius: 12px;
  color: ${({ theme }) => theme.textL2};
  background: ${({ theme }) => theme.bgT20};
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(36)};
    padding: ${vm(8)} ${vm(12)};
    border-radius: ${vm(12)};
    font-size: .14rem;
    font-weight: 400;
    line-height: .2rem;
    color: ${theme.textL1};
    background: ${theme.brand6};
  `}
`

export default function ShortcutsList() {
  const sendAiContent = useSendAiContent()
  const [isPaused, setIsPaused] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const containerRefs = useRef<Array<HTMLDivElement | null>>([])
  const animationRefs = useRef<Array<number | null>>([null, null, null])
  const positionRefs = useRef<Array<{currentPosition: number, lastTimestamp: number | null}>>([
    {currentPosition: 0, lastTimestamp: null},
    {currentPosition: 0, lastTimestamp: null},
    {currentPosition: 0, lastTimestamp: null}
  ])
  
  const shortcutsList = useMemo(() => {
    return [
      {
        key: '1',
        list: [
          {
            key: 'What security incidents have happened recently in crypto?',
            text: t`What security incidents have happened recently in crypto?`,
          },
          {
            key: 'Which sectors are outperforming in the crypto market?',
            text: t`Which sectors are outperforming in the crypto market?`,
          },
        ]
      },
      {
        key: '2',
        list: [
          {
            key: 'What s the correlation between crypto and traditional markets?',
            text: t`What's the correlation between crypto and traditional markets?`,
          },
          {
            key: 'What security incidents have happened recently in crypto?',
            text: t`What security incidents have happened recently in crypto?`,
          },
        ]
      },
      {
        key: '3',
        list: [
          {
            key: 'What are the biggest whales buying or selling?',
            text: t`What are the biggest whales buying or selling?`,
          },
          {
            key: 'What s the latest news about Bitcoin ETFs?',
            text: t`What's the latest news about Bitcoin ETFs?`,
          },
          {
            key: 'How is AI being integrated with blockchain technology?',
            text: t`How is AI being integrated with blockchain technology?`,
          },
        ]
      },
    ]
  }, [])
  
  // 每行的滚动速度，px/s
  const speeds = useMemo(() => [40, 35, 30], []); 
  
  // 启动和停止滚动
  useEffect(() => {
    // 在组件初始化时为每一行设置滚动动画
    const startScrolling = (rowIndex: number) => {
      const container = containerRefs.current[rowIndex];
      if (!container) return;
      
      const position = positionRefs.current[rowIndex];
      
      const scrollStep = (timestamp: number) => {
        if (isPaused) {
          // 如果暂停，直接停止计算，保持当前位置
          animationRefs.current[rowIndex] = requestAnimationFrame(scrollStep);
          return;
        }
        
        // 计算时间差和位置
        if (position.lastTimestamp === null) {
          // 首次执行或从暂停恢复后的第一帧，不计算移动
          position.lastTimestamp = timestamp;
        } else {
          // 正常帧，计算位置增量
          const elapsed = timestamp - position.lastTimestamp;
          const speed = speeds[rowIndex] || 40; // 默认速度
          const increment = (elapsed * speed / 1000);
          
          // 更新位置
          position.currentPosition += increment;
          
          // 如果到达一半宽度（第一组内容的宽度），重置位置
          if (position.currentPosition >= container.scrollWidth / 2) {
            position.currentPosition = 0;
          }
        }
        
        // 更新时间戳
        position.lastTimestamp = timestamp;
        
        // 应用变换
        container.style.transform = `translateX(-${position.currentPosition}px)`;
        
        // 继续下一帧
        animationRefs.current[rowIndex] = requestAnimationFrame(scrollStep);
      };
      
      animationRefs.current[rowIndex] = requestAnimationFrame(scrollStep);
    };
    
    // 启动所有行的滚动
    shortcutsList.forEach((_, index) => {
      startScrolling(index);
    });

    const currentAni = animationRefs.current
    
    return () => {
      // 清理所有动画
      currentAni.forEach((ref, index) => {
        if (ref !== null) {
          cancelAnimationFrame(ref);
          currentAni[index] = null;
        }
      });
    };
  }, [shortcutsList, isPaused, speeds]);
  
  // 处理暂停状态变化
  useEffect(() => {
    // 当暂停状态改变时，重置lastTimestamp，确保恢复滚动时从当前位置平滑继续
    if (!isPaused) {
      positionRefs.current.forEach(position => {
        position.lastTimestamp = null;
      });
    }
  }, [isPaused]);
  
  const sendContent = useCallback((text: string) => {
    sendAiContent({
      value: text,
    })
  }, [sendAiContent])
  
  // 处理PC端鼠标悬停和移动端触摸事件
  useEffect(() => {
    const listElement = listRef.current
    if (!listElement) return
    
    const handleMouseEnter = () => {
      setIsPaused(true)
    }
    
    const handleMouseLeave = () => {
      setIsPaused(false)
    }
    
    const handleTouchStart = () => {
      setIsPaused(true)
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      // 触摸移动时保持暂停状态
      setIsPaused(true)
    }
    
    const handleTouchEnd = () => {
      setIsPaused(false)
    }
    
    // 根据设备类型添加不同的事件监听器
    if (window.matchMedia('(pointer: fine)').matches) {
      // PC端
      listElement.addEventListener('mouseenter', handleMouseEnter)
      listElement.addEventListener('mouseleave', handleMouseLeave)
    } else {
      // 移动端
      listElement.addEventListener('touchstart', handleTouchStart)
      listElement.addEventListener('touchmove', handleTouchMove)
      listElement.addEventListener('touchend', handleTouchEnd)
    }
    
    return () => {
      // 清理事件监听器
      if (window.matchMedia('(pointer: fine)').matches) {
        listElement.removeEventListener('mouseenter', handleMouseEnter)
        listElement.removeEventListener('mouseleave', handleMouseLeave)
      } else {
        listElement.removeEventListener('touchstart', handleTouchStart)
        listElement.removeEventListener('touchmove', handleTouchMove)
        listElement.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [])
  
  return (
    <ShortcutsListWrapper ref={listRef}>
      {shortcutsList.map((item, rowIndex) => (
        <ShortcutsItem key={item.key} $isPaused={isPaused}>
          <ScrollContainer 
            ref={(el: HTMLDivElement | null) => { containerRefs.current[rowIndex] = el }}
            $isPaused={isPaused}
            speed={speeds[rowIndex]}
          >
            {item.list.map((subItem) => (
              <ShortcutsItemItem key={subItem.key} onClick={() => sendContent(subItem.text)}>
                {subItem.text}
              </ShortcutsItemItem>
            ))}
            {/* 复制内容以实现无缝循环 */}
            {item.list.map((subItem) => (
              <ShortcutsItemItem key={`duplicate-${subItem.key}`} onClick={() => sendContent(subItem.text)}>
                {subItem.text}
              </ShortcutsItemItem>
            ))}
          </ScrollContainer>
        </ShortcutsItem>
      ))}
    </ShortcutsListWrapper>
  )
}

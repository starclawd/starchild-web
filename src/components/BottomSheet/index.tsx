/**
 * BottomSheet组件
 * 从底部滑出的弹层组件，支持向下拖动关闭
 * 使用Portal实现，不受父元素overflow影响
 */
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import Portal from 'components/Portal'
import { vm } from 'pages/helper'

// 淡入动画
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

// 淡出动画
const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`

// 遮罩层样式
const Overlay = styled.div<{ $isClosing: boolean, $top: number, $showFromBottom: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  animation: ${props => props.$isClosing 
    ? css`${fadeOut} ${ANI_DURATION}s forwards` 
    : css`${fadeIn} ${ANI_DURATION}s forwards`};
`

// 弹层容器样式
const SheetContainer = styled.div<{ 
  $isClosing: boolean, 
  $isEntering: boolean,
  $left: number, 
  $width: number,
  $top: number,
  $showFromBottom: boolean,
  $hideDragHandle: boolean
}>`
  display: flex;
  flex-direction: column;
  border-radius: 32px 32px 0 0;
  width: ${props => props.$showFromBottom ? '100%' : `${props.$width}px`};
  overflow: hidden;
  position: fixed;
  left: ${props => props.$showFromBottom ? 0 : `${props.$left}px`};
  z-index: 100;
  background-color: ${({ theme }) => theme.bgL0};
  transform-origin: bottom center;
  
  /* 位置计算 */
  bottom: ${props => props.$showFromBottom 
    ? 0 
    : `calc(100vh - ${props.$top}px)`};
  
  /* 动画效果 */
  transition: all ${ANI_DURATION}s;
  
  ${props => {
    if (props.$isClosing) {
      return css`
        transform: translateY(100px);
        opacity: 0;
      `
    } else if (props.$isEntering) {
      return css`
        transform: translateY(100px);
        opacity: 0;
      `
    } else {
      return css`
        transform: translateY(0);
        opacity: 1;
      `
    }
  }}
  ${({ theme }) => theme.isMobile && css`
    border-radius: ${vm(32)} ${vm(32)} 0 0;
  `}
  ${({ $hideDragHandle }) => $hideDragHandle && css`
    border-radius: 0;
    background-color: transparent;
  `}
`

// 拖动句柄样式
const DragHandle = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 31px;
  flex-shrink: 0;
  padding-top: 8px;
  span {
    width: 44px;
    height: 4px;
    border-radius: 3px;
    background-color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(31)};
    padding-top: ${vm(8)};
    span {
      width: ${vm(44)};
      height: ${vm(4)};
      border-radius: ${vm(3)};
    }
  `}
`

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  positionRef?: any
  showFromBottom?: boolean
  rootStyle?: React.CSSProperties
  hideDragHandle?: boolean
}

const BottomSheet = ({
  isOpen,
  onClose,
  children,
  hideDragHandle = false,
  rootStyle,
  positionRef,
  showFromBottom = true,
}: BottomSheetProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isEntering, setIsEntering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef<number | null>(null)
  const currentYRef = useRef<number | null>(null)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 })
  
  // 计算位置
  const calculatePosition = useCallback(() => {
    if (!showFromBottom && positionRef?.current) {
      // 如果不是从底部显示，则基于positionRef计算位置
      const rect = positionRef.current.getBoundingClientRect()
      
      // 获取元素的位置信息
      setPosition({
        top: rect.top, // 父元素顶部位置
        left: rect.left, // 左侧位置（左对齐）
        width: rect.width // 宽度（与父元素相同）
      })
    } else if (showFromBottom) {
      // 从body底部显示，使用窗口宽度
      setPosition({
        top: window.innerHeight, // 使用窗口高度
        left: 0,
        width: window.innerWidth // 使用窗口宽度
      })
    }
  }, [positionRef, showFromBottom])
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setIsClosing(false)
      setIsEntering(true)
      // 计算父元素位置
      calculatePosition()
      
      // 添加窗口调整大小监听器
      window.addEventListener('resize', calculatePosition)
      window.addEventListener('scroll', calculatePosition, true)
      
      // 入场动画完成后，重置isEntering状态
      const timer = setTimeout(() => {
        setIsEntering(false)
      }, 50) // 给一个短暂延迟，确保动画效果可见
      
      return () => clearTimeout(timer)
    } else {
      setIsClosing(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, ANI_DURATION * 1000)
      
      // 移除事件监听器
      window.removeEventListener('resize', calculatePosition)
      window.removeEventListener('scroll', calculatePosition, true)
      
      return () => clearTimeout(timer)
    }
    
    return () => {
      window.removeEventListener('resize', calculatePosition)
      window.removeEventListener('scroll', calculatePosition, true)
    }
  }, [isOpen, calculatePosition])
  
  // 处理点击遮罩层关闭
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    // 只有点击遮罩层本身才关闭
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])
  
  // 处理触摸开始
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation()
    startYRef.current = e.touches[0].clientY
    currentYRef.current = e.touches[0].clientY
  }, [])
  
  // 处理触摸移动
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.stopPropagation()
    if (startYRef.current === null) return
    
    const currentY = e.touches[0].clientY
    currentYRef.current = currentY
    
    // 计算拖动距离
    const deltaY = currentY - startYRef.current
    
    // 只有向下拖动才处理
    if (deltaY > 0) {
      // 应用拖动的变换
      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(${deltaY}px)`
        containerRef.current.style.transition = 'none'
      }
    }
  }, [])
  
  // 处理触摸结束
  const handleTouchEnd = useCallback(() => {
    if (startYRef.current === null || currentYRef.current === null) return
    
    const deltaY = currentYRef.current - startYRef.current
    
    // 如果拖动距离超过100px或拖动速度较快，则关闭弹层
    if (deltaY > 100) {
      onClose()
    } else {
      // 恢复原位
      if (containerRef.current) {
        containerRef.current.style.transform = 'translateY(0)'
        containerRef.current.style.transition = 'transform 0.3s'
      }
    }
    
    // 重置参考点
    startYRef.current = null
    currentYRef.current = null
  }, [onClose])
  
  return isVisible ? (
      <Portal>
        <Overlay 
          onClick={handleOverlayClick}
          $isClosing={isClosing}
          $top={position.top}
          $showFromBottom={showFromBottom}
        />
        <SheetContainer 
          style={rootStyle}
          ref={containerRef}
          $isClosing={isClosing}
          $isEntering={isEntering}
          $left={position.left}
          $width={position.width}
          $top={position.top}
          $hideDragHandle={hideDragHandle}
          $showFromBottom={showFromBottom}
        >
          {!hideDragHandle && <DragHandle 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <span></span>
          </DragHandle>}
          {children}
        </SheetContainer>
      </Portal>
    ): null
}

export default BottomSheet 
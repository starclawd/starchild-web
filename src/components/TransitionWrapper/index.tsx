/**
 * TransitionWrapper过渡动画组件
 * 提供多种过渡动画效果的包装组件
 * 支持高度、宽度和透明度三种过渡方式
 */
import React, { useRef, useState, useMemo, useCallback, useLayoutEffect } from 'react'
import { ANI_DURATION } from 'constants/index'
import styled, { css } from 'styled-components'

/**
 * 动画组件属性接口
 */
interface AnimationProps {
  disabled?: boolean // 禁用
  duration?: number // 动画持续时间
  delay?: number // 动画延迟时间
  disabledOverflow?: boolean
  visible?: boolean // 是否显示
  display?: string // 显示方式
  className?: string
  animation?: string // 自定义动画效果
  transitionType?: 'opacity' | 'height' | 'width' // 动画过渡方式
  onTransitionEnd?: () => void // 动画结束回调函数
  rootStyle?: { [props: string]: any } // 根元素样式
  children: React.ReactNode // 子元素
}

/**
 * 过渡动画容器样式组件
 * 处理不同类型的过渡动画效果
 */
const TransitionWrapper = styled.div<{
  disabled: boolean
  visible: boolean
  display: string
  animation: string
  duration: number
  openOverflow: boolean
  delay: number
  width?: number
  height?: number
  opacity?: number
  transitionType?: 'opacity' | 'height' | 'width'
}>`
  ${({ visible, display }) =>
    !visible &&
    css`
      display: ${display};
    `}
  ${({ transitionType, height, openOverflow }) =>
    transitionType === 'height' &&
    height !== undefined &&
    css`
      height: ${height}px;
      overflow: ${openOverflow ? 'hidden' : 'unset'};
    `}
  ${({ transitionType, width }) =>
    transitionType === 'width' &&
    width !== undefined &&
    css`
      width: ${width}px;
    `}
  ${({ transitionType, opacity }) =>
    transitionType === 'opacity' &&
    opacity !== undefined &&
    css`
      opacity: ${opacity};
    `}
  flex-shrink: 0;
  ${({ disabled }) =>
    !disabled &&
    css`
      transition: all ${ANI_DURATION}s;
    `
  }
`

/**
 * Transition组件
 * 提供可定制的过渡动画效果
 */
const Transition: React.FC<AnimationProps> = ({
  disabled = false,
  duration = ANI_DURATION,
  delay = 0,
  visible = false,
  display = 'block',
  animation = 'fadeIn',
  transitionType = 'height',
  onTransitionEnd,
  rootStyle = {},
  className = '',
  disabledOverflow = false,
  children,
}: AnimationProps) => {
  const [openOverflow, setOpenOverflow] = useState(true)
  const [shouldRender, setShouldRender] = useState(visible)
  const [width, setWidth] = useState<number | undefined>(undefined)
  const [height, setHeight] = useState<number | undefined>(undefined)
  const [opacity, setOpacity] = useState<number | undefined>(undefined)
  const animationRef = useRef<HTMLDivElement>(null)
  const preVisibleRef = useRef<boolean>(visible)
  useLayoutEffect(() => {
    if (visible && visible !== preVisibleRef.current) {
      const timer = setTimeout(() => {
        clearTimeout(timer)
        setShouldRender(true)
      }, 0)
    }
    if (visible !== preVisibleRef.current) {
      setOpenOverflow(true)
    }
    preVisibleRef.current = visible
  }, [visible])

  useLayoutEffect(() => {
    if (animationRef.current && shouldRender && visible) {
      if (transitionType === 'height') {
        const childHeight = (animationRef.current.firstChild as HTMLElement).offsetHeight
        setHeight(childHeight)
        setWidth(undefined)
        setOpacity(undefined)
      } else if (transitionType === 'width') {
        const childWidth = (animationRef.current.firstChild as HTMLElement).offsetWidth
        setWidth(childWidth)
        setHeight(undefined)
        setOpacity(undefined)
      } else {
        setHeight(undefined)
        setWidth(undefined)
        setOpacity(1)
      }
    } else {
      setWidth(0)
      setHeight(0)
      setOpacity(0)
    }
  }, [visible, shouldRender, children, transitionType])
  const handleTransitionEnd = useCallback(() => {
    if (!visible) {
      setShouldRender(false)
      setHeight(undefined)
      setOpacity(undefined)
      setWidth(undefined)
    }
    if (disabledOverflow) {
      setOpenOverflow(false)
    }
    onTransitionEnd && onTransitionEnd()
  }, [visible, disabledOverflow, onTransitionEnd])
  return useMemo(() => shouldRender ? (
    <TransitionWrapper
      disabled={disabled}
      className={`transition-wrapper ${className}`}
      style={ rootStyle ? rootStyle : {} }
      ref={animationRef}
      visible={visible}
      display={display}
      animation={animation}
      duration={duration}
      delay={delay}
      width={disabled ? undefined : width}
      height={disabled ? undefined : height}
      opacity={opacity}
      openOverflow={openOverflow}
      transitionType={transitionType}
      onTransitionEnd={handleTransitionEnd}
    >
      {React.Children.only(children)}
    </TransitionWrapper>
  ) : null, [disabled, className, openOverflow, width, children, rootStyle, shouldRender, visible, display, animation, duration, delay, height, opacity, transitionType, handleTransitionEnd])
}

export default React.memo(Transition);
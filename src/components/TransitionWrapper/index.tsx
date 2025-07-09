/**
 * TransitionWrapper过渡动画组件
 * 提供多种过渡动画效果的包装组件
 * 支持高度、宽度和透明度三种过渡方式
 */
import React, { useRef, useState, useMemo, useCallback, useLayoutEffect, useEffect } from 'react'
import { ANI_DURATION } from 'constants/index'
import styled, { css } from 'styled-components'

/**
 * 动画组件属性接口
 */
interface AnimationProps {
  disabled?: boolean // 禁用
  disabledOverflow?: boolean
  visible?: boolean // 是否显示
  display?: string // 显示方式
  className?: string
  transitionType?: 'height' | 'transform' | 'width' // 动画过渡方式
  direction?: 'left' | 'right' | 'top' | 'bottom' // 过渡方向，仅在transitionType为transform时有效
  onTransitionEnd?: () => void // 动画结束回调函数
  rootStyle?: { [props: string]: any } // 根元素样式
  children: React.ReactNode // 子元素
  defaultWidth?: number // 默认宽度，当transitionType为width时有效
}

/**
 * 过渡动画容器样式组件
 * 处理不同类型的过渡动画效果
 */
const TransitionWrapper = styled.div<{
  $disabled: boolean
  $visible: boolean
  $display: string
  $openOverflow: boolean
  $height?: number
  $width?: number
  $transitionType?: 'height' | 'transform' | 'width'
  $direction?: 'left' | 'right' | 'top' | 'bottom'
}>`
  ${({ $visible, $display }) =>
    !$visible &&
    css`
      display: ${$display};
    `}
  ${({ $transitionType, $height, $openOverflow }) =>
    $transitionType === 'height' &&
    $height !== undefined &&
    css`
      height: ${$height}px;
      overflow: ${$openOverflow ? 'hidden' : 'unset'};
    `}
  ${({ $transitionType, $width, $openOverflow }) =>
    $transitionType === 'width' &&
    $width !== undefined &&
    css`
      width: ${$width}px;
      overflow: ${$openOverflow ? 'hidden' : 'unset'};
    `}
  ${({ $transitionType, $visible, $direction }) =>
    $transitionType === 'transform' &&
    css`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: ${$visible ? 1 : 0};
      z-index: 1;
      ${$direction === 'right' &&
      css`
        transform: translateX(${$visible ? '0' : '100%'});
      `}
      ${$direction === 'left' &&
      css`
        transform: translateX(${$visible ? '0' : '-100%'});
      `}
      ${$direction === 'top' &&
      css`
        transform: translateY(${$visible ? '0' : '-100%'});
      `}
      ${$direction === 'bottom' &&
      css`
        transform: translateY(${$visible ? '0' : '100%'});
      `}
    `}
  flex-shrink: 0;
  ${({ $disabled }) =>
    !$disabled &&
    css`
      transition: all ${ANI_DURATION}s;
    `}
`

/**
 * Transition组件
 * 提供可定制的过渡动画效果
 */
const Transition: React.FC<AnimationProps> = ({
  disabled = false,
  visible = false,
  display = 'block',
  transitionType = 'height',
  direction = 'right',
  onTransitionEnd,
  rootStyle = {},
  className = '',
  disabledOverflow = false,
  defaultWidth,
  children,
}: AnimationProps) => {
  const [openOverflow, setOpenOverflow] = useState(true)
  const [shouldRender, setShouldRender] = useState(visible)
  const [height, setHeight] = useState<number | undefined>(undefined)
  const [width, setWidth] = useState<number | undefined>(
    transitionType === 'width' && defaultWidth ? defaultWidth : undefined,
  )
  const animationRef = useRef<HTMLDivElement>(null)
  const preVisibleRef = useRef<boolean>(visible)
  const hasSetInitialDimensionsRef = useRef<boolean>(false)

  // 确保在初始渲染时，即使visible为false也先渲染一次内容以便测量尺寸
  useEffect(() => {
    if (!hasSetInitialDimensionsRef.current && transitionType === 'width') {
      setShouldRender(true)
    }
  }, [transitionType])

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

  // 优化的尺寸计算逻辑
  useLayoutEffect(() => {
    // 只有当元素已渲染，才进行尺寸计算
    if (animationRef.current && animationRef.current.firstChild) {
      if (transitionType === 'height') {
        const childHeight = (animationRef.current.firstChild as HTMLElement).offsetHeight
        setHeight(childHeight)
        setWidth(undefined)
      } else if (transitionType === 'width') {
        try {
          const childWidth = (animationRef.current.firstChild as HTMLElement).offsetWidth
          // 如果childWidth为0，可能是因为元素还未完全渲染，尝试使用父元素宽度或默认宽度
          if (childWidth === 0) {
            const parentWidth = animationRef.current.parentElement?.offsetWidth || defaultWidth
            if (parentWidth) {
              setWidth(parentWidth)
            }
          } else {
            setWidth(childWidth)
          }
          setHeight(undefined)
          hasSetInitialDimensionsRef.current = true
        } catch (error) {
          console.error('Error measuring width', error)
          // 发生错误时，使用默认宽度
          if (defaultWidth) {
            setWidth(defaultWidth)
          }
        }
      } else {
        setHeight(undefined)
        setWidth(undefined)
      }
    }

    // 处理不可见状态下的尺寸
    if (!visible && shouldRender) {
      if (transitionType === 'height') {
        setHeight(0)
      } else if (transitionType === 'width') {
        setWidth(width === undefined && defaultWidth ? defaultWidth : 0)
      }
    }
  }, [visible, shouldRender, width, children, transitionType, defaultWidth])

  const handleTransitionEnd = useCallback(() => {
    if (!visible) {
      // 当不可见时，只有在转换完成后才移除渲染
      // 但保留初始测量的标志，这样当再次可见时可以更快地恢复
      setShouldRender(false)
      // 不要在这里重置width和height，这会导致闪烁
    }
    if (disabledOverflow) {
      setOpenOverflow(false)
    }
    onTransitionEnd && onTransitionEnd()
  }, [visible, disabledOverflow, onTransitionEnd])

  return (
    <TransitionWrapper
      $disabled={disabled}
      className={`transition-wrapper ${className}`}
      style={rootStyle ? rootStyle : {}}
      ref={animationRef}
      $visible={visible}
      $display={display}
      $height={disabled ? undefined : height}
      $width={disabled ? undefined : width}
      $openOverflow={openOverflow}
      $transitionType={transitionType}
      $direction={direction}
      onTransitionEnd={handleTransitionEnd}
    >
      {shouldRender ? React.Children.only(children) : null}
    </TransitionWrapper>
  )
}

export default React.memo(Transition)

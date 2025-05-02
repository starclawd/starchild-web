/**
 * Popover弹出提示组件
 * 基于@popperjs/core实现的弹出提示组件
 * 提供丰富的定位选项和动画效果
 */
import { Options, Placement } from '@popperjs/core'
import { MouseEventHandler, useMemo, useState, ReactNode, useEffect, memo, useRef, useCallback } from 'react'
import { usePopper } from 'react-popper'
import styled, { css, CSSProperties } from 'styled-components'
import Portal from 'components/Portal'
import { useActiveLocale } from 'hooks/useActiveLocale'
import usePrevious from 'hooks/usePrevious'
import { ANI_DURATION } from 'constants/index'
import { opacityTopShow, opacityLeftShow, opacityRightShow, opacityBottomShow, opacityDisappear } from 'styles/animationStyled'
/**
 * Popover外层容器样式组件
 * 支持自动和固定宽度两种模式
 */
const PopoverWrapper = styled.div<{ $widthAuto: boolean }>`
  display: flex;
  align-items: center;
  width: auto;
  height: 100%;
  ${({ $widthAuto }) =>
    !$widthAuto && css`
      width: 100%;
    `
  }
`

/**
 * Popover内容容器样式组件
 * 处理显示/隐藏状态和动画效果
 */
const PopoverContainer = styled.div<{ $show: boolean, $begainToHide: boolean }>`
  z-index: 102;
  visibility: ${(props) => (props.$show ? 'visible' : 'hidden')};
  transition: visibility 150ms linear, opacity 150ms linear;
  padding: 7px 0;
  /* 顶部弹出动画 */
  &.top,
  &.top-start,
  &.top-end {
    animation: ${opacityTopShow} ${ANI_DURATION}s;
  }

  /* 左侧弹出动画 */
  &.left,
  &.left-start,
  &.left-end {
    animation: ${opacityLeftShow} ${ANI_DURATION}s;
  }

  /* 右侧弹出动画 */
  &.right,
  &.right-start,
  &.right-end {
    animation: ${opacityRightShow} ${ANI_DURATION}s;
  }

  /* 底部弹出动画 */
  &.bottom,
  &.bottom-start,
  &.bottom-end {
    animation: ${opacityBottomShow} ${ANI_DURATION}s;
  }

  /* 消失动画 */
  ${({ $begainToHide }) =>
    $begainToHide &&
    css`
      opacity: 0;
      animation: ${opacityDisappear} ${ANI_DURATION}s;
    `
  }
`

/**
 * 参考元素容器样式组件
 * 用于定位Popover的目标元素
 */
const ReferenceElement = styled.div`
  display: inline-block;
  width: 100%;
`

/**
 * Popover组件属性接口
 */
export interface PopoverProps {
  content: ReactNode              // 弹出内容
  show: boolean                   // 是否显示
  children: ReactNode             // 触发元素
  placement?: Placement           // 弹出位置
  offsetTop?: number             // 顶部偏移量
  offsetLeft?: number            // 左侧偏移量
  widthAuto?: boolean            // 是否自动宽度
  begainToHide?: boolean         // 是否开始隐藏动画
  rootClass?: string             // 根元素类名
  popoverContainerStyle?: CSSProperties   // 容器样式
  onClick?: MouseEventHandler<HTMLElement>        // 点击事件
  onMouseEnter?: MouseEventHandler<HTMLElement>   // 鼠标进入事件
  onMouseLeave?: MouseEventHandler<HTMLElement>   // 鼠标离开事件
  onClickOutside?: () => void    // 点击外部区域回调
}

/**
 * Popover组件
 * 提供可定制的弹出提示功能
 */
export default memo(function Popover({
  content,
  show,
  children,
  begainToHide = false,
  widthAuto = true,
  placement = 'auto',
  popoverContainerStyle = {},
  onClick,
  offsetTop,
  offsetLeft,
  rootClass,
  onMouseEnter,
  onMouseLeave,
  onClickOutside,
}: PopoverProps) {
  /* hooks调用 */
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
  const local = useActiveLocale()
  const preLocal = usePrevious(local)
  const popoverRef = useRef<HTMLDivElement>(null)

  /* popper配置项 */
  const options = useMemo(
    (): Options => ({
      placement,
      strategy: 'fixed',
      modifiers: [
        { name: 'offset', options: { offset: [offsetLeft || 0, offsetTop || 0] } },
        { name: 'arrow', options: { element: arrowElement } },
        { name: 'preventOverflow', options: { padding: 8 } },
      ],
    }),
    [arrowElement, placement, offsetLeft, offsetTop]
  )

  const { styles, update, attributes } = usePopper(referenceElement, popperElement, options)

  /* 语言变化时更新位置 */
  useEffect(() => {
    if (local !== preLocal) {
      setTimeout(() => {
        update && update()
      }, 400)
    }
  }, [local, preLocal, update])

  /* 内容变化时更新位置 */
  useEffect(() => {
    if (show && content) {
      update && update()
    }
  }, [show, content, update])

  /* 监听点击外部事件 */
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (show && popoverRef.current && !popoverRef.current.contains(event.target as Node) && 
        popperElement && !popperElement.contains(event.target as Node) && onClickOutside) {
      onClickOutside()
    }
  }, [show, popperElement, onClickOutside])

  /* 添加和移除点击事件监听 */
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

  return (
    <PopoverWrapper 
      className={`popover-wrapper ${rootClass}`} 
      $widthAuto={widthAuto} 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave} 
      onClick={onClick}
      ref={popoverRef}
    >
      <ReferenceElement
        className="pop-wrapper"
        ref={setReferenceElement as any}
      >
        {children}
      </ReferenceElement>
      {show && <Portal>
        <PopoverContainer 
          key={local} 
          className={attributes.popper?.['data-popper-placement'] ?? ''} 
          $begainToHide={begainToHide} 
          $show={show && !!styles.popper.transform} 
          ref={setPopperElement as any} 
          style={{...styles.popper, ...popoverContainerStyle}} 
          {...attributes.popper}
        >
          {content}
        </PopoverContainer>
      </Portal>}
    </PopoverWrapper>
  )
})

/**
 * Popover弹出提示组件
 * 基于@popperjs/core实现的弹出提示组件
 * 提供丰富的定位选项和动画效果
 */
import { Options, Placement } from '@popperjs/core'
import { MouseEventHandler, useMemo, useState, ReactNode, useEffect, memo } from 'react'
import { usePopper } from 'react-popper'
import styled, { css, CSSProperties } from 'styled-components'
import Portal from 'components/Portal'
import { useActiveLocale } from 'hooks/useActiveLocale'
import usePrevious from 'hooks/usePrevious'
import { ANI_DURATION } from 'constants/index'

/**
 * Popover外层容器样式组件
 * 支持自动和固定宽度两种模式
 */
const PopoverWrapper = styled.div<{ $widthAuto: boolean }>`
  width: auto;
  height: auto;
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
  @keyframes opacityTopShow {
    0% {
      opacity: 0;
      bottom: -10px;
    }
    100% {
      opacity: 1;
      bottom: 0;
    }
  }
  @keyframes opacityLeftShow {
    0% {
      opacity: 0;
      right: -10px;
    }
    100% {
      opacity: 1;
      right: 0;
    }
  }
  @keyframes opacityRightShow {
    0% {
      opacity: 0;
      left: -10px;
    }
    100% {
      opacity: 1;
      left: 0;
    }
  }
  @keyframes opacityBottomShow {
    0% {
      opacity: 0;
      top: -10px;
    }
    100% {
      opacity: 1;
      top: 0;
    }
  }
  @keyframes opacityDisappear {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  /* 顶部弹出动画 */
  &.top,
  &.top-start,
  &.top-end {
    animation: opacityTopShow ${ANI_DURATION}s;
  }

  /* 左侧弹出动画 */
  &.left,
  &.left-start,
  &.left-end {
    animation: opacityLeftShow ${ANI_DURATION}s;
  }

  /* 右侧弹出动画 */
  &.right,
  &.right-start,
  &.right-end {
    animation: opacityRightShow ${ANI_DURATION}s;
  }

  /* 底部弹出动画 */
  &.bottom,
  &.bottom-start,
  &.bottom-end {
    animation: opacityBottomShow ${ANI_DURATION}s;
  }

  /* 消失动画 */
  ${({ $begainToHide }) =>
    $begainToHide &&
    css`
      opacity: 0;
      animation: opacityDisappear ${ANI_DURATION}s;
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
 * 箭头样式组件
 * 支持不同方向的箭头样式和颜色定制
 */
const Arrow = styled.div<{ arrowGreen: boolean, arrowBackground?: string }>`
  width: 8px;
  height: 8px;
  z-index: 98;

  ::before {
    position: absolute;
    width: 9px;
    height: 9px;
    z-index: 98;
    content: '';
    transform: rotate(45deg);
    ${({ arrowGreen }) =>
      arrowGreen &&
      css`
        background: #6BEAB6;
      `
    }
  }

  /* 顶部箭头样式 */
  &.arrow-top,
  &.arrow-top-start,
  &.arrow-top-end {
    bottom: 3px;
    ::before {
      border-top: none;
      border-left: none;
      border-radius: 0 0 2px 0;
    }
  }

  /* 底部箭头样式 */
  &.arrow-bottom,
  &.arrow-bottom-start,
  &.arrow-bottom-end {
    top: 3px;
    ::before {
      border-bottom: none;
      border-right: none;
      border-radius: 2px 0 0 0;
    }
  }

  /* 左侧箭头样式 */
  &.arrow-left {
    right: -3px;
    ::before {
      border-bottom: none;
      border-left: none;
      border-radius: 0 2px 0 0;
    }
  }

  /* 右侧箭头样式 */
  &.arrow-right {
    left: -3px;
    ::before {
      border-right: none;
      border-top: none;
      border-radius: 0 0 0 2px;
    }
  }
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
}: PopoverProps) {
  /* hooks调用 */
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
  const local = useActiveLocale()
  const preLocal = usePrevious(local)

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

  return (
    <PopoverWrapper 
      className={`popover-wrapper ${rootClass}`} 
      $widthAuto={widthAuto} 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave} 
      onClick={onClick}
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

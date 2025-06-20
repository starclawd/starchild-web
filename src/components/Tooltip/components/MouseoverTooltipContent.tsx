/**
 * MouseoverTooltipContent组件
 * 用于Web端的悬浮提示内容
 * 支持鼠标悬浮显示和自动隐藏
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { ANI_DURATION } from 'constants/index'
import TooltipContent, { ChildrenWrapper, TooltipContentProps } from './TooltipContent'
import { useIsWindowVisible } from 'store/application/hooks'

/**
 * Web端悬浮提示内容组件
 */
export default function MouseoverTooltipContent({
  outSetShow,
  useOutShow,
  outShow = false,
  content,
  children,
  widthAuto,
  emptyContent,
  disabledDisappearAni = false,
  onOpen,
  disableHover,
  ...rest
}: Omit<TooltipContentProps, 'show'>) {
  const childrenWrapRef = useRef<HTMLDivElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [begainToHide, setBegainToHide] = useState(false)
  const [isWindowVisible] = useIsWindowVisible()
  
  let [show, setShow] = useState(false)
  if (useOutShow) {
    show = outShow
    setShow = outSetShow || setShow
  }

  /**
   * 打开提示
   */
  const open = useCallback(() => {
    setShow && setShow(true)
    onOpen?.()
  }, [onOpen, setShow])

  /**
   * 关闭提示
   */
  const close = useCallback(() => {
    if (disabledDisappearAni) {
      setShow && setShow(false)
      return
    }
    setBegainToHide(true)
    timeoutRef.current && clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current && clearTimeout(timeoutRef.current)
      setBegainToHide(false)
      setShow && setShow(false)
    }, ANI_DURATION)
  }, [disabledDisappearAni, setShow])

  /**
   * 鼠标移动事件处理
   */
  const mouseMoveEvent = useCallback((e: any) => {
    const childrenEl = childrenWrapRef.current
    if (childrenEl && !childrenEl.contains(e.target)) {
      setShow && setShow(false)
    }
  }, [setShow])

  /**
   * 处理快速变化导致的tooltip不消失
   */
  useEffect(() => {
    if (disabledDisappearAni) {
      if (show) {
        document.addEventListener('mousemove', mouseMoveEvent)
      } else {
        document.removeEventListener('mousemove', mouseMoveEvent)
      }
    }
  }, [show, disabledDisappearAni, mouseMoveEvent])

  /**
   * 窗口不可见时关闭提示
   */
  useEffect(() => {
    if (!isWindowVisible) {
      setShow && setShow(false)
    }
  }, [isWindowVisible, setShow])

  return (
    <TooltipContent 
      begainToHide={begainToHide} 
      widthAuto={widthAuto} 
      onMouseEnter={open} 
      onMouseLeave={close} 
      {...rest} 
      show={show && !emptyContent} 
      content={disableHover ? null : content}
    >
      <ChildrenWrapper 
        ref={childrenWrapRef as any} 
        className={`pop-children ${show && !begainToHide ? 'show' : ''}`}
      >
        {children}
      </ChildrenWrapper>
    </TooltipContent>
  )
} 
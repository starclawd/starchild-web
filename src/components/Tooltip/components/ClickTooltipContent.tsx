/**
 * ClickTooltipContent组件
 * 用于移动端的点击提示内容
 * 支持点击显示和自动隐藏
 */
import { useCallback, useRef, useState } from 'react'
import TooltipContent, { ChildrenWrapper, TooltipContentProps } from './TooltipContent'
import { ANI_DURATION } from 'constants/index'

/**
 * 移动端点击提示内容组件
 */
export default function ClickTooltipContent({
  useOutShow,
  outShow = false,
  outSetShow,
  content,
  children,
  emptyContent,
  disableHover,
  stopPropagation,
  ...rest
}: Omit<TooltipContentProps, 'show'>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [begainToHide, setBegainToHide] = useState(false)
  
  let [isShow, setShow] = useState(false)
  if (useOutShow && outSetShow) {
    isShow = outShow
    setShow = outSetShow
  }

  /**
   * 切换提示显示状态
   */
  const toggle = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (stopPropagation) {
      e.stopPropagation()
    }
    if (isShow) {
      setBegainToHide(true)
      timeoutRef.current && clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current && clearTimeout(timeoutRef.current)
        setBegainToHide(false)
        setShow && setShow(false)
      }, ANI_DURATION)
    } else {
      setShow(true)
    }
  }, [isShow, stopPropagation, setShow])

  return (
    <TooltipContent 
      begainToHide={begainToHide} 
      onClick={toggle} 
      onMouseLeave={() => setShow(false)} 
      {...rest} 
      show={isShow && !emptyContent} 
      content={disableHover ? null : content}
    >
      <ChildrenWrapper className={`pop-children ${isShow && !begainToHide ? 'show' : ''}`}>
        {children}
      </ChildrenWrapper>
    </TooltipContent>
  )
} 
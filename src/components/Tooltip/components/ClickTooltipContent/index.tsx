/**
 * ClickTooltipContent组件
 * 用于移动端的点击提示内容
 * 支持点击显示和 3 秒后自动隐藏
 */
import { useCallback, useRef, useState, useEffect } from 'react'
import TooltipContent, { ChildrenWrapper, TooltipContentProps } from 'components/Tooltip/components/TooltipContent'
import { ANI_DURATION } from 'constants/index'

const DISAPPEAR_TIME = 2000

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
  const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [begainToHide, setBegainToHide] = useState(false)

  let [isShow, setShow] = useState(false)
  if (useOutShow && outSetShow) {
    isShow = outShow
    setShow = outSetShow
  }

  /**
   * 隐藏提示框
   */
  const hideTooltip = useCallback(() => {
    setBegainToHide(true)
    timeoutRef.current && clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current && clearTimeout(timeoutRef.current)
      setBegainToHide(false)
      setShow && setShow(false)
    }, ANI_DURATION)
  }, [setShow])

  /**
   * 切换提示显示状态
   */
  const toggle = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (stopPropagation) {
        e.stopPropagation()
      }
      if (isShow) {
        // 清除自动隐藏定时器
        autoHideTimeoutRef.current && clearTimeout(autoHideTimeoutRef.current)
        hideTooltip()
      } else {
        setShow(true)
        // 设置 3 秒后自动隐藏
        autoHideTimeoutRef.current && clearTimeout(autoHideTimeoutRef.current)
        autoHideTimeoutRef.current = setTimeout(() => {
          hideTooltip()
        }, DISAPPEAR_TIME)
      }
    },
    [isShow, stopPropagation, setShow, hideTooltip],
  )

  /**
   * 处理外部控制的显示状态变化
   */
  useEffect(() => {
    if (useOutShow && isShow) {
      // 外部控制显示时，也设置 3 秒自动隐藏
      autoHideTimeoutRef.current && clearTimeout(autoHideTimeoutRef.current)
      autoHideTimeoutRef.current = setTimeout(() => {
        hideTooltip()
      }, DISAPPEAR_TIME)
    } else if (useOutShow && !isShow) {
      // 外部控制隐藏时，清除自动隐藏定时器
      autoHideTimeoutRef.current && clearTimeout(autoHideTimeoutRef.current)
    }
  }, [isShow, useOutShow, hideTooltip])

  /**
   * 组件卸载时清理定时器
   */
  useEffect(() => {
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current)
      autoHideTimeoutRef.current && clearTimeout(autoHideTimeoutRef.current)
    }
  }, [])

  return (
    <TooltipContent
      begainToHide={begainToHide}
      onClick={toggle}
      {...rest}
      show={isShow && !emptyContent}
      content={disableHover ? null : content}
    >
      <ChildrenWrapper className={`pop-children ${isShow && !begainToHide ? 'show' : ''}`}>{children}</ChildrenWrapper>
    </TooltipContent>
  )
}

/**
 * Tooltip内容组件
 * 提供基础的气泡提示内容展示
 */
import styled from 'styled-components'
import Popover from 'components/Popover'
import { ANI_DURATION } from 'constants/index'
import { TooltipContentProps, TriggerMethod } from 'components/Tooltip/types'

export { TriggerMethod }
export type { TooltipContentProps }

/**
 * 气泡容器样式组件
 */
export const TooltipContainer = styled.div`
  max-width: 240px;
  padding: 8px;
  font-weight: 400;
  word-break: break-word;
  border-radius: 8px;
`

/**
 * 子元素包装器样式组件
 */
export const ChildrenWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: help;
  transition: all ${ANI_DURATION}s;
`

/**
 * Tooltip内容基础组件
 */
export default function TooltipContent({ content, wrap = false, widthAuto = true, ...rest }: TooltipContentProps) {
  return (
    <Popover
      showArrow
      widthAuto={widthAuto}
      {...rest}
      content={wrap ? <TooltipContainer>{content}</TooltipContainer> : content}
    />
  )
}

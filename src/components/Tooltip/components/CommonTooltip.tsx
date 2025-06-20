/**
 * 内容样式组件
 */

import { TooltipContentProps } from "./TooltipContent"
import MouseoverTooltipContent from "./MouseoverTooltipContent"
import { ContentWrapper } from "../styles"

/**
 * PC端气泡提示组件
 * 基于MouseoverTooltipContent实现的悬浮提示组件
 * 提供丰富的定制选项和交互效果
 */
export function CommonTooltip({
  content,
  children,
  childClick,
  outSetShow,
  disabledDisappearAni = false,
  useOutShow,
  contentClass,
  outShow = false,
  canOperator = false,
  contentStyle = {},
  placement = 'bottom',
  widthAuto = true,
  ignoreTooltipConfig = false,
  showTooltipWrapper = true,
  ...rest
}: Omit<TooltipContentProps, 'show'>) {

  /**
   * 根据配置决定是否显示提示
   */
  if (!showTooltipWrapper) {
    return <>{children}</>
  }
  
  return (
    <MouseoverTooltipContent
      {...rest}
      disabledDisappearAni={disabledDisappearAni}
      useOutShow={useOutShow}
      outShow={outShow}
      outSetShow={outSetShow}
      widthAuto={widthAuto}
      placement={placement}
      emptyContent={!content}
      content={
        <ContentWrapper
          canOperator={canOperator}
          className={contentClass}
          style={{...contentStyle}}
          onClick={childClick}
        >
          {content}
        </ContentWrapper>
      }
    >
      {children}
    </MouseoverTooltipContent>
  )
}

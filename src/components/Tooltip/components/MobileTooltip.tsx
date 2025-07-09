/**
 * 移动端气泡提示组件
 * 基于ClickTooltipContent实现的点击提示组件
 * 提供移动端友好的交互体验
 */
import { TooltipContentProps } from './TooltipContent'
import ClickTooltipContent from './ClickTooltipContent'
import { ContentWrapper } from '../styles'

/**
 * 移动端气泡提示组件
 * @param content - 提示内容
 * @param children - 触发元素
 * @param childClick - 内容点击回调
 * @param outSetShow - 外部控制显示状态的函数
 * @param useOutShow - 是否使用外部显示状态
 * @param outShow - 外部显示状态
 * @param contentStyle - 内容容器样式
 * @param placement - 提示框位置
 * @param widthAuto - 是否自动宽度
 * @param ignoreTooltipConfig - 是否忽略全局配置
 * @param showTooltipWrapper - 是否显示提示包装器
 */
export function MobileTooltip({
  content,
  children,
  childClick,
  outSetShow,
  useOutShow,
  outShow = false,
  contentStyle = {},
  placement = 'top',
  widthAuto = true,
  ignoreTooltipConfig = false,
  showTooltipWrapper = true,
  ...rest
}: Omit<TooltipContentProps, 'show'>) {
  return (
    <ClickTooltipContent
      {...rest}
      useOutShow={useOutShow}
      outShow={outShow}
      outSetShow={outSetShow}
      widthAuto={widthAuto}
      placement={placement}
      emptyContent={!content}
      content={
        <ContentWrapper onClick={childClick} style={{ ...contentStyle }}>
          {content}
        </ContentWrapper>
      }
    >
      {children}
    </ClickTooltipContent>
  )
}

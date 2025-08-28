/**
 * 内容样式组件
 */

import { TooltipContentProps, TriggerMethod } from './components/TooltipContent'
import MouseoverTooltipContent from './components/MouseoverTooltipContent'
import { ContentWrapper } from './styles'
import { useIsMobile } from 'store/application/hooks'
import ClickTooltipContent from './components/ClickTooltipContent'

export default function Tooltip({
  content,
  children,
  childClick,
  outSetShow,
  triggerMethod = TriggerMethod.HOVER,
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
  const isMobile = useIsMobile()
  /**
   * 根据配置决定是否显示提示
   */
  if (!showTooltipWrapper) {
    return <>{children}</>
  }

  if (isMobile || triggerMethod === TriggerMethod.CLICK) {
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
          $canOperator={canOperator}
          className={contentClass}
          style={{ ...contentStyle }}
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

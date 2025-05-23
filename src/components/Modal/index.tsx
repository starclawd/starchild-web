/**
 * 弹窗基础组件
 * 基于@reach/dialog实现的模态框组件,支持移动端和桌面端
 * 提供丰富的自定义选项,如背景、动画、缩放等
 */
import { memo, MouseEventHandler, ReactNode, useCallback, useEffect } from 'react'
import { DialogContent, DialogOverlay } from '@reach/dialog'
import { useIsMobile } from 'store/application/hooks'
import styled, { css, CSSProperties } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import { useScrollbarClass } from 'hooks/useScrollbarClass'

/**
 * 弹窗遮罩层样式组件
 * 支持自定义z-index、背景色、动画等
 */
const StyledDialogOverlay = styled(DialogOverlay)<{
  $openAnimation: string,
  $zIndex: number
}>`
  &[data-reach-dialog-overlay] {
    z-index: ${({ $zIndex }) => $zIndex};
    background-color: transparent;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.60);

    /* 开启动画效果 */
    ${({ $openAnimation, theme }) =>
      $openAnimation === 'true' &&
      css`
        animation: ${
          theme.isMobile
            ? `opacityTopShow ${ANI_DURATION}s`
            : `opacityBottomShow ${ANI_DURATION}s`};
      `
    }
  }
`

/**
 * 桌面端弹窗内容样式组件
 */
const StyledDialogContent = styled(DialogContent).attrs({
  'aria-label': 'dialog',
})<{ $cancelOverflow: string }>`
  overflow-y: auto;

  &[data-reach-dialog-content] {
    border: none;
    position: relative;
    padding: 0px;
    width: auto;
    overflow-y: auto;
    overflow-x: hidden;
    align-self: center;
    display: flex;
    margin: 0;
    background-color: transparent;
  }

  /* 取消滚动条 */
  ${({ $cancelOverflow }) =>
    $cancelOverflow === 'true' &&
    css`
      &[data-reach-dialog-content] {
        overflow-y: unset;
        overflow-x: unset;
      }
    `
  }
`

/**
 * 移动端弹窗内容样式组件
 */
const MobileStyledDialogContent = styled(DialogContent).attrs({
  'tabIndex': undefined,
  'aria-label': 'dialog',
})<{ $cancelOverflow: string }>`
  overflow-y: auto;

  &[data-reach-dialog-content] {
    display: flex;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    z-index: 101;
    padding: 0;
    margin: 0;
    background-color: transparent;
  }

  /* 取消滚动条 */
  ${({ $cancelOverflow }) =>
    $cancelOverflow === 'true' &&
    css`
      overflow-y: unset;
    `
  }
`

const CloseWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 28px;
  height: 28px;
  top: 20px;
  right: 20px;
  z-index: 2;
  .icon-chat-close {
    font-size: 28px;
    color: ${({ theme }) => theme.textL4};
  }
  ${({ theme }) => theme.isMobile
  ? css`
    width: ${vm(28)};
    height: ${vm(28)};
    top: ${vm(20)};
    right: ${vm(20)};
    .icon-chat-close {
      font-size: 0.28rem;
    }
  ` : css`
    cursor: pointer;
  `}
`

/**
 * Modal组件属性接口
 */
interface ModalProps {
  isOpen: boolean                  // 是否显示弹窗
  hideClose?: boolean              // 是否隐藏关闭按钮
  forceWeb?: boolean              // 是否强制使用web样式
  useDismiss?: boolean            // 是否允许点击空白处关闭
  openTouchMove?: boolean         // 是否允许触摸移动
  onDismiss?: () => void          // 关闭回调函数
  children?: ReactNode            // 子元素
  contentStyle?: CSSProperties    // 内容样式
  cancelOverflow?: boolean        // 是否取消溢出
  zIndex?: number                 // z-index层级
  openAnimation?: boolean         // 是否开启动画
  onClick?: MouseEventHandler<HTMLElement>  // 点击事件处理
}

export { CloseWrapper }

/**
 * Modal组件实现
 * 支持移动端和桌面端,提供丰富的自定义选项
 */
export default memo(function Modal({
  isOpen,
  onDismiss,
  children,
  hideClose,
  zIndex = 100,
  forceWeb,
  onClick,
  useDismiss,
  openAnimation = true,
  contentStyle,
  openTouchMove,
  cancelOverflow,
}: ModalProps) {
  // 判断是否为移动端
  const isMobile = useIsMobile() && !forceWeb
  // 根据平台选择内容组件
  const ContentCom = isMobile ? MobileStyledDialogContent : StyledDialogContent
  const scrollRef = useScrollbarClass<HTMLDivElement>()

  // 处理触摸移动事件
  const touchMove = useCallback((e: any) => {
    if (openTouchMove) return
    e.stopPropagation()
  }, [openTouchMove])

  // 处理ESC按键关闭
  const escClick = useCallback((e: any) => {
    if (e.keyCode === 27 && useDismiss) {
      if (isOpen) {
        onDismiss?.()
      }
    }
  }, [isOpen, useDismiss, onDismiss])

  // 添加键盘事件监听
  useEffect(() => {
    document.addEventListener('keydown', escClick)
    return () => {
      document.removeEventListener('keydown', escClick)
    }
  }, [escClick])

  // 渲染弹窗
  return isOpen ? (
    <StyledDialogOverlay
      $zIndex={zIndex}
      $openAnimation={openAnimation ? 'true' : 'false'}
      onClick={onClick}
      onDismiss={onDismiss}
      dangerouslyBypassFocusLock
      dangerouslyBypassScrollLock
      onTouchMove={touchMove}
    >
      <ContentCom
        style={contentStyle}
        ref={scrollRef}
        className="styled-dialog-content scroll-style"
        $cancelOverflow={cancelOverflow ? 'true' : 'false'}
      >
        {!hideClose && <CloseWrapper>
          <IconBase onClick={onDismiss} className="icon-chat-close" />
        </CloseWrapper>}
        {children}
      </ContentCom>
    </StyledDialogOverlay>
  ) : null
})

/**
 * 弹窗基础组件
 * 基于@reach/dialog实现的模态框组件,支持移动端和桌面端
 * 提供丰富的自定义选项,如背景、动画、缩放等
 */
import { memo, MouseEventHandler, ReactNode, useCallback, useEffect } from 'react'
import { DialogContent, DialogOverlay } from '@reach/dialog'
import { useIsMobile } from 'store/application/hooks'
import styled, { css, CSSProperties } from 'styled-components'
import CloseWrapper from 'components/Close'
import { ANI_DURATION } from 'constants/index'

/**
 * 弹窗遮罩层样式组件
 * 支持自定义z-index、背景色、动画等
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(DialogOverlay)<{
  hidebg?: string,
  ismobile: string,
  mobileexchange: string,
  usemodalbutton: string,
  openanimation: string,
  ismobilesinglinetitle: string,
  overlayopacity?: number,
  zindex: number
}>`
  &[data-reach-dialog-overlay] {
    z-index: ${({ zindex }) => zindex};
    background-color: transparent;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    /* 开启动画效果 */
    ${({ openanimation, theme }) =>
      openanimation === 'true' &&
      css`
        animation: ${
          theme.isMobile
            ? `opacityTopShow ${ANI_DURATION}s`
            : `opacityBottomShow ${ANI_DURATION}s`};
      `
    }

    /* 背景色设置 */
    background: ${({ hidebg, overlayopacity }) => hidebg === 'true' ? 'transparent' : `rgba(0, 0, 0, ${overlayopacity ? overlayopacity : '0.5'})`};

    /* 移动端样式 */
    ${({ ismobile }) =>
      ismobile === 'true' &&
      css`
        align-items: flex-end;
      `
    }

    /* 移动端交易弹窗样式 */
    ${({ mobileexchange }) =>
      mobileexchange === 'true' &&
      css`
        background: rgba(0, 0, 0, 0.2);
      `
    }

    /* 移动端单行标题样式 */
    ${({ theme, ismobilesinglinetitle }) =>
      theme.isMobile &&
      css`
        .fake-close-wrapper {
          padding-top: ${ismobilesinglinetitle === 'true' ? '18px' : '14px'};
        }
      `
    }

    /* 移动端按钮样式 */
    ${({ usemodalbutton }) =>
      usemodalbutton === 'true' &&
      css`
        top: unset;
        height: 44px;
        bottom: 16px;
        overflow: visible;
        padding: 0 14px;
        background: transparent;
        .styled-dialog-content {
          position: relative;
          overflow: visible;
          @supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) { 
            padding-bottom: constant(safe-area-inset-bottom);
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
      `
    }
  }
`

/**
 * 桌面端弹窗内容样式组件
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled(DialogContent).attrs({
  'aria-label': 'dialog',
})<{ canceloverflow: string, rate: number, usefullsceen: string, diabledbg: string, modalscalerate: number, hideborderradio: string, innerheight: number }>`
  overflow-y: auto;

  &[data-reach-dialog-content] {
    background-color: ${({ theme, diabledbg }) => diabledbg === 'true' ? 'transparent' : theme.bg2};
    border: none;
    position: relative;
    padding: 0px;
    width: auto;
    overflow-y: auto;
    overflow-x: hidden;
    align-self: center;
    display: flex;
    border-radius: 20px;
  }

  /* 取消滚动条 */
  ${({ canceloverflow }) =>
    canceloverflow === 'true' &&
    css`
      &[data-reach-dialog-content] {
        overflow-y: unset;
        overflow-x: unset;
      }
    `
  }

  /* 隐藏圆角 */
  ${({ hideborderradio }) =>
    hideborderradio === 'true' &&
    css`
      &[data-reach-dialog-content] {
        border-radius: 0;
      }
    `
  }

  /* 缩放比例 */
  ${({ modalscalerate }) =>
    css`
      transform: scale(${modalscalerate});
    `
  }

  /* 全屏模式 */
  ${({ usefullsceen, innerheight }) =>
    usefullsceen === 'true' &&
    css`
      &[data-reach-dialog-content] {
        position: fixed;
        width: ${innerheight}px;
        height: 100vw;
        top: 0;
        left: 0;
        bottom: unset;
        right: unset;
        margin: 0;
        transform: rotate(90deg);
        transform-origin: 50vw;
        @media screen and (orientation:landscape) {
          width: 100vw;
          height: ${innerheight}px;
          transform: rotate(0);
        }
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
})<{ canceloverflow: string, rate: number, usefullsceen: string, diabledbg: string, modalscalerate: number, usefixstyle: string, hideborderradio: string, innerheight: number }>`
  overflow-y: auto;

  &[data-reach-dialog-content] {
    display: flex;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    z-index: 100;
    padding: 0;
    margin: 0;
    background-color: transparent;
  }

  /* 固定样式 */
  ${({ usefixstyle }) =>
    usefixstyle === 'true' &&
    css`
      &[data-reach-dialog-content] {
        position: fixed;
        bottom: unset;
        top: 100px;
      }
    `
  }

  /* 取消滚动条 */
  ${({ canceloverflow }) =>
    canceloverflow === 'true' &&
    css`
      overflow-y: unset;
    `
  }

  /* 缩放比例 */
  ${({ rate }) =>
    css`
      transform: scale(${rate});
      transform-origin: left bottom;
    `
  }

  /* 全屏模式 */
  ${({ usefullsceen }) =>
    usefullsceen === 'true' &&
    css`
      height: 100%;
    `
  }

  /* 模态框缩放 */
  ${({ modalscalerate }) =>
    css`
      transform: scale(${modalscalerate});
    `
  }
`

/**
 * Modal组件属性接口
 */
interface ModalProps {
  rate?: number                    // 缩放比例
  isOpen: boolean                  // 是否显示弹窗
  hideClose?: boolean              // 是否隐藏关闭按钮
  hideBg?: boolean                // 是否隐藏背景
  forceWeb?: boolean              // 是否强制使用web样式
  useDismiss?: boolean            // 是否允许点击空白处关闭
  openTouchMove?: boolean         // 是否允许触摸移动
  useFullSceen?: boolean          // 是否使用全屏模式
  onDismiss?: () => void          // 关闭回调函数
  children?: ReactNode            // 子元素
  contentStyle?: CSSProperties    // 内容样式
  mobileExchange?: boolean        // 是否为移动端交易弹窗
  useModalButton?: boolean        // 是否使用模态按钮
  cancelOverflow?: boolean        // 是否取消溢出
  overlayOpacity?: number         // 遮罩层透明度
  zindex?: number                 // z-index层级
  diabledBg?: boolean            // 是否禁用背景
  handleIosDesk?: boolean        // 是否处理iOS桌面版
  hideBorderRadio?: boolean      // 是否隐藏圆角
  openAnimation?: boolean         // 是否开启动画
  useFixStyle?: boolean          // 是否使用固定样式
  modalScaleRate?: number        // 模态框缩放比例
  closeStyle?: CSSProperties     // 关闭按钮样式
  closeIconStyle?: CSSProperties // 关闭图标样式
  onClick?: MouseEventHandler<HTMLElement>  // 点击事件处理
  isMobileSingLineTitle?: boolean // 是否为移动端单行标题
}

export { CloseWrapper }

/**
 * Modal组件实现
 * 支持移动端和桌面端,提供丰富的自定义选项
 */
export default memo(function Modal({
  rate,
  isOpen,
  onDismiss,
  useModalButton,
  children,
  hideClose,
  hideBg,
  zindex = 100,
  forceWeb,
  onClick,
  diabledBg,
  useDismiss,
  closeStyle,
  hideBorderRadio = false,
  useFixStyle = false,
  handleIosDesk = false,
  closeIconStyle,
  isMobileSingLineTitle = true,
  useFullSceen = false,
  openAnimation = true,
  contentStyle,
  openTouchMove,
  modalScaleRate,
  mobileExchange,
  cancelOverflow,
  overlayOpacity,
}: ModalProps) {
  // 判断是否为移动端
  const isMobile = useIsMobile() && !forceWeb
  // 根据平台选择内容组件
  const ContentCom = isMobile ? MobileStyledDialogContent : StyledDialogContent

  // 处理触摸移动事件
  const touchMove = useCallback((e: any) => {
    if (openTouchMove) return
    e.stopPropagation()
  }, [openTouchMove])

  // 处理ESC按键关闭
  const escClick = useCallback((e: any) => {
    if (e.keyCode === 27 && (isMobile || useDismiss)) {
      if (isOpen) {
        onDismiss?.()
      }
    }
  }, [isOpen, isMobile, useDismiss, onDismiss])

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
      onClick={onClick}
      zindex={zindex}
      overlayopacity={overlayOpacity}
      ismobilesinglinetitle={isMobileSingLineTitle ? 'true' : 'false'}
      openanimation={openAnimation ? 'true' : 'false'}
      usemodalbutton={useModalButton ? 'true' : 'false'}
      mobileexchange={mobileExchange ? 'true' : 'false'}
      ismobile={isMobile ? 'true' : 'false'}
      onDismiss={(isMobile || useDismiss) ? onDismiss : undefined}
      hidebg={hideBg ? 'true' : 'false'}
      dangerouslyBypassFocusLock
      dangerouslyBypassScrollLock
      onTouchMove={touchMove}
    >
      <ContentCom
        modalscalerate={modalScaleRate || 1}
        diabledbg={diabledBg ? 'true' : 'false'}
        style={contentStyle}
        usefixstyle={useFixStyle ? 'true' : 'false'}
        hideborderradio={hideBorderRadio ? 'true' : 'false'}
        rate={rate ? rate : 1}
        className="styled-dialog-content"
        usefullsceen={useFullSceen ? 'true' : 'false'}
        innerheight={window.innerHeight}
        canceloverflow={cancelOverflow ? 'true' : 'false'}
      >
        {children}
        {!hideClose && <CloseWrapper handleIosDesk={handleIosDesk} closeStyle={closeStyle} closeIconStyle={closeIconStyle} rate={rate} onClick={onDismiss} />}
      </ContentCom>
    </StyledDialogOverlay>
  ) : null
})

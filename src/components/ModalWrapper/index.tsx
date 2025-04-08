/**
 * ModalWrapper移动端弹窗容器组件
 * 提供统一的弹窗样式和交互处理
 * 支持iOS安全区域、键盘交互和滚动处理
 */
import { useIsMobile, useMobileHtmlScrollTop } from 'store/application/hooks'
import styled, { css } from 'styled-components'
import { ReactNode, useEffect, useRef } from 'react'
import { isIosDesk, isSafari } from 'utils/userAgent'

/**
 * 弹窗内容基础样式组件
 * 提供底部安全区域适配和圆角样式
 */
export const ModalContentWrapper = styled.div`
  width: 100%;
  padding-bottom: 14px;
  border-radius: 16px 16px 0px 0px;
  background-color: ${({ theme }) => theme.bg3};
  ${!isIosDesk &&
    css`
      @supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) { 
        padding-bottom: calc(14px + constant(safe-area-inset-bottom));
        padding-bottom: calc(14px + env(safe-area-inset-bottom));
      }
    `
  }
`

/**
 * 弹窗内容容器样式组件
 * 支持滚动位置、高度限制和内容最小宽度
 */
const Content = styled(ModalContentWrapper)<{ 
  htmlScrollTop: number,        // HTML滚动位置
  innerHeight: number,          // 视口高度
  isOrderboardModal: boolean,   // 是否为订单板弹窗
  disabledPaddingBottom: boolean, // 是否禁用底部内边距
  openMinContent: boolean       // 是否启用最小内容宽度
}>`
  position: relative;
  background-color: ${({ theme }) => theme.bg3};
  ${({ htmlScrollTop }) =>
    htmlScrollTop > 0 && css`
      padding-bottom: 14px;
    `
  }
  ${({ disabledPaddingBottom }) =>
    disabledPaddingBottom && css`
      padding-bottom: 0 !important;
    `
  }
  ${({ innerHeight, isOrderboardModal }) =>
    css`
      max-height: ${isOrderboardModal ? 'calc(100vh - 200px)' : `calc(${innerHeight}px - 100px)`};
      flex-grow: 0;
    `
  }
  ${({ openMinContent }) =>
    openMinContent && css`
      min-width: 375px;
    `
  }
`

/**
 * MobileWrapper组件属性接口
 */
interface MobileWrapperProps {
  isShow: boolean              // 是否显示弹窗
  className?: string          // 自定义类名
  children: ReactNode         // 弹窗内容
  openMinContent?: boolean    // 是否启用最小内容宽度
  touchmoveSelector?: string  // 支持滚动的元素选择器
  isOrderboardModal?: boolean // 是否为订单板弹窗
  disabledPaddingBottom?: boolean // 是否禁用底部内边距
}

/**
 * MobileWrapper组件
 * 提供移动端弹窗的容器功能
 * 处理键盘交互、滚动行为和安全区域适配
 */
export default function MobileWrapper({
  isShow,
  children,
  className,
  openMinContent = false,
  touchmoveSelector,
  isOrderboardModal,
  disabledPaddingBottom = false,
}: MobileWrapperProps) {
  const isMobile = useIsMobile()
  const startScroll = useRef(false)
  const contentStartScroll = useRef(false)
  const [htmlScrollTop] = useMobileHtmlScrollTop()

  // iOS键盘吸底处理
  useEffect(() => {
    if (htmlScrollTop > 0 && !isOrderboardModal && !(isMobile && isSafari)) {
      document.documentElement.scrollTo(0, Math.max(document.body.clientHeight, document.documentElement.clientHeight))
    }
  }, [isMobile, htmlScrollTop, isOrderboardModal])

  // 滑动失焦处理，用于隐藏键盘
  useEffect(() => {
    // 内容区域触摸开始事件
    const contentTouchStartCallback = (e: any) => {
      contentStartScroll.current = true
    }

    // 文档触摸开始事件
    const touchstartCallback = () => {
      startScroll.current = false
      if (touchmoveSelector) {
        const contentEl = document.querySelector(touchmoveSelector)
        contentEl?.addEventListener('touchstart', contentTouchStartCallback, true)
      }
    }

    // 文档触摸移动事件
    const touchmoveCallback = (e: TouchEvent) => {
      startScroll.current = true
    }

    // 文档触摸结束事件
    const touchendCallback = (e: TouchEvent) => {
      if (startScroll.current && !contentStartScroll.current) {
        const focusEl = document.activeElement
        if (focusEl?.tagName === 'INPUT') {
          (focusEl as any).blur()
          startScroll.current = false
        }
      } else {
        contentStartScroll.current = false
      }
      if (touchmoveSelector) {
        const contentEl = document.querySelector(touchmoveSelector)
        contentEl?.removeEventListener('touchstart', contentTouchStartCallback)
      }
    }

    // 弹窗显示时添加事件监听
    if (isShow) {
      document.addEventListener('touchstart', touchstartCallback, true)
      document.addEventListener('touchmove', touchmoveCallback, true)
      document.addEventListener('touchend', touchendCallback)
      return () => {
        document.removeEventListener('touchstart', touchstartCallback)
        document.removeEventListener('touchmove', touchmoveCallback)
        document.removeEventListener('touchend', touchendCallback)
      }
    }
    return
  }, [isShow, touchmoveSelector])

  return (
    <Content
      openMinContent={!!openMinContent}
      disabledPaddingBottom={disabledPaddingBottom}
      htmlScrollTop={htmlScrollTop}
      innerHeight={window.ethereum?.isTrust ? window.innerHeight : window.visualViewport?.height || window.innerHeight}
      isOrderboardModal={!!isOrderboardModal}
      className={className}
    >
      {children}
    </Content>
  )
}

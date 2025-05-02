/**
 * ModalWrapper移动端弹窗容器组件
 * 提供统一的弹窗样式和交互处理
 * 支持iOS安全区域、键盘交互和滚动处理
 */
import styled from 'styled-components'
import { vm } from 'pages/helper'

export const BottomSafeArea = styled.div`
  height: 100%;
  @supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) or (top: constant(safe-area-inset-top)) or (top: env(safe-area-inset-top)) { 
    height: calc(100% - constant(safe-area-inset-bottom));
    height: calc(100% - env(safe-area-inset-bottom));
    padding-bottom: calc(constant(safe-area-inset-bottom));
    padding-bottom: calc(env(safe-area-inset-bottom));
    padding-top: calc(constant(safe-area-inset-top));
    padding-top: calc(env(safe-area-inset-top));
  }
`

/**
 * 弹窗内容基础样式组件
 * 提供底部安全区域适配和圆角样式
 */
export const ModalSafeAreaWrapper = styled.div`
  width: 100%;
  border-radius: ${vm(32)} ${vm(32)} 0 0;
  @supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) { 
    padding-bottom: calc(constant(safe-area-inset-bottom));
    padding-bottom: calc(env(safe-area-inset-bottom));
  }
`
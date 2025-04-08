/**
 * ButtonLoading Component
 * 
 * 一个通用的按钮加载状态组件,支持三种不同类型的加载样式:
 * 1. GREEN_BUTTON - 绿色按钮加载样式
 * 2. TRANSPARENT_BUTTON - 透明按钮加载样式  
 * 3. SECONDARY_BUTTON - 次要按钮加载样式(带文字)
 *
 * @example
 * ```tsx
 * // 基础用法
 * <ButtonLoading type={BUTTON_LOADING_TYPE.GREEN_BUTTON} />
 * 
 * // 带文字的加载
 * <ButtonLoading 
 *   type={BUTTON_LOADING_TYPE.SECONDARY_BUTTON}
 *   showText
 *   secondaryText="Loading..."
 * />
 * ```
 */

import { memo, ReactNode } from 'react'
import styled, { CSSProperties } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconDepPending } from 'components/Icons'

// 按钮加载类型枚举
export enum BUTTON_LOADING_TYPE {
  GREEN_BUTTON = 'GREEN_BUTTON',
  TRANSPARENT_BUTTON = 'TRANSPARENT_BUTTON', 
  SECONDARY_BUTTON = 'SECONDARY_BUTTON'
}

// 组件Props类型定义
interface ButtonLoadingProps {
  /** 加载类型 */
  type: BUTTON_LOADING_TYPE
  /** 是否显示文字 */
  showText?: boolean
  /** 自定义加载文字 */
  secondaryText?: ReactNode
  /** 根元素样式 */
  rootStyle?: CSSProperties
}

// 带文字的加载样式
const PendingWrapper = styled.div`
  display: flex;
  align-items: center;
  
  span {
    margin-left: 4px;
  }
`

// 旋转加载图标样式
const ButtonLoadingWrapper = styled.img`
  width: 18px;
  animation: rotates 1s linear infinite;
`

/**
 * ButtonLoading 组件
 * 
 * @param props - 组件属性
 * @returns React组件
 */
const ButtonLoading = memo(function ButtonLoading({
  type,
  showText = false,
  secondaryText,
  rootStyle,
}: ButtonLoadingProps) {
  // 根据类型渲染不同的加载样式
  const renderLoading = () => {
    switch (type) {
      case BUTTON_LOADING_TYPE.GREEN_BUTTON:
        return (
          <ButtonLoadingWrapper
            style={rootStyle}
            className="button-loading-wrapper"
            src={''}
            alt="Loading"
          />
        )
      
      case BUTTON_LOADING_TYPE.TRANSPARENT_BUTTON:
        return (
          <ButtonLoadingWrapper
            style={rootStyle}
            className="button-loading-wrapper"
            src={''}
            alt="Loading"
          />
        )
      
      case BUTTON_LOADING_TYPE.SECONDARY_BUTTON:
        return (
          <PendingWrapper style={rootStyle} className="pending-wrapper">
            <IconDepPending className="icon-dep-pending" />
            {showText && (
              <span>
                {secondaryText || <Trans>Pending</Trans>}
              </span>
            )}
          </PendingWrapper>
        )
      
      default:
        return null
    }
  }

  return renderLoading()
})

export default ButtonLoading
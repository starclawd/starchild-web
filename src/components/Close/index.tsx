/**
 * 关闭按钮组件
 * 支持15s倒计时功能
 * 支持移动端和桌面端适配
 */
import styled, { CSSProperties, css } from 'styled-components'
import { useMemo, useState } from 'react'
import { useWindowSize } from 'hooks/useWindowSize'
import { isIosDesk } from 'utils/userAgent'
import { div } from 'utils/calc'
import { IconBase } from 'components/Icons'

/**
 * 关闭按钮外层容器样式
 * @param gap - 间距大小
 * @param handleIosDesk - 是否处理iOS桌面版样式
 */
const FakeWrapper = styled.div<{ gap: number, handleIosDesk: boolean }>`
  position: absolute;
  top: 20px;
  right: 24px;
  display: flex;
  justify-content: flex-end;
  width: 48px;
  height: 48px;
  ${({ theme, gap }) =>
    theme.isMobile &&
    css`
      top: 0;
      right: calc(14px - ${gap}px);
      padding-top: 14px;
    `
  }
  ${({ theme, handleIosDesk }) =>
    theme.isMobile && isIosDesk && handleIosDesk &&
    css`
      @supports (top: constant(safe-area-inset-top)) or (top: env(safe-area-inset-top)) { 
        top: constant(safe-area-inset-top);
        top: env(safe-area-inset-top);
      }
    `
  }
`

/**
 * 关闭按钮样式
 */
const CloseWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  padding: 0;
  z-index: 2;
  flex-shrink: 0;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  ${({ theme }) =>
    theme.isMobile
    ? css`
        &:active {
          .icon-close {
            color: ${({ theme }) => theme.green};
          }
        }
      `
    : css`
        &:hover {
          .icon-close {
            color: ${({ theme }) => theme.green};
          }
        }
    `
  }
  .icon-close {
    /* color: ${({ theme }) => theme.text1}; */
    font-size: 12px;
  }
  &::before,
  &::after {
    border-radius: 50%;
  }
`

/**
 * 关闭按钮组件属性接口
 */
interface CloseWrapperProps {
  time?: number               // 倒计时时间
  handleIosDesk?: boolean     // 是否处理iOS桌面版样式
  closeStyle?: CSSProperties  // 关闭按钮容器样式
  closeIconStyle?: CSSProperties  // 关闭图标样式
  removeAfterMs?: number | undefined | null  // 自动移除时间
  onClick: any // 点击回调函数
}

/**
 * 关闭按钮组件
 * @param time - 倒计时时间
 * @param onClick - 点击回调函数
 * @param closeStyle - 关闭按钮容器样式
 * @param handleIosDesk - 是否处理iOS桌面版样式
 * @param closeIconStyle - 关闭图标样式
 * @param removeAfterMs - 自动移除时间
 */
export default function CloseWrapper({
  time,
  onClick,
  closeStyle,
  handleIosDesk = false,
  closeIconStyle,
  removeAfterMs,
}: CloseWrapperProps) {
  const [showClose, setShowClose] = useState(false)  // 是否显示关闭按钮
  const { width } = useWindowSize()  // 窗口尺寸

  // 计算间距
  const gap = useMemo(() => {
    if (width && width < 375) {
      const originWidth = 375 - width
      return originWidth
    }
    return 0
  }, [width])

  return (
    <FakeWrapper handleIosDesk={handleIosDesk} style={closeStyle ? closeStyle : {}} gap={gap} className="fake-close-wrapper" onClick={onClick}>
      <CloseWrap
        className="close-wrapper"
        onMouseLeave={() => setShowClose(false)}
        onMouseOver={() => setShowClose(true)}
      >
        {time && !showClose && removeAfterMs !== null ? div(time, 1000) : <IconBase style={closeIconStyle ? closeIconStyle : {}} className="icon-close" />}
      </CloseWrap>
    </FakeWrapper>
  )
}
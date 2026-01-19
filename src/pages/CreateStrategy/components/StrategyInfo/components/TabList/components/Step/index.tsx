import { IconBase } from 'components/Icons'
import { memo } from 'react'
import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'

const StepWrapper = styled.div<{ $isActive: boolean; $isComplete: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  width: 32px;
  span {
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.black200};
  }
  .icon-double-right {
    font-size: 18px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.black200};
  }
  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      span {
        color: ${theme.black0};
      }
      .icon-double-right {
        color: ${theme.black0};
      }
    `}
`

interface StepProps {
  /** 当前步骤 1-4，表示有几段显示 fillColor */
  step: number
  /** 进度填充颜色 */
  fillColor: string
  /** 背景轨道颜色 */
  trackColor: string
  /** 是否完成，完成时全部显示 trackColor */
  isComplete: boolean
  /** 是否激活 */
  isActive: boolean
  /** 是否正在加载 */
  isLoading: boolean
}

export default memo(function Step({
  isActive = false,
  step = 0,
  fillColor,
  trackColor,
  isLoading = false,
  isComplete = false,
}: StepProps) {
  return (
    <StepWrapper $isActive={isActive} $isComplete={isComplete} style={{ width: 40, height: 40 }}>
      <span>{step}</span>
      {isComplete && <IconBase className='icon-double-right' />}
    </StepWrapper>
  )
})

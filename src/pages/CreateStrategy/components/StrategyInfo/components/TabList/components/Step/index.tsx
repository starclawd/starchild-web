import { IconBase } from 'components/Icons'
import { memo } from 'react'
import styled, { css } from 'styled-components'

const StepWrapper = styled.div<{ $isActive: boolean; $isComplete: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px;
    color: ${({ theme }) => theme.black300};
    .icon-complete {
      font-size: 18px;
      color: ${({ theme }) => theme.brand100};
    }
  }
  ${({ $isActive, $isComplete, theme }) =>
    ($isComplete || $isActive) &&
    css`
      span {
        color: ${theme.brand100};
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

// 4 个分段的 path 数据（从右上角开始，顺时针顺序：右上 -> 右下 -> 左下 -> 左上）
const SEGMENT_PATHS = [
  // 右上
  'M39.9734 18.9683C39.7194 14.0518 37.661 9.40162 34.1922 5.90814C30.7235 2.41466 26.088 0.323299 21.1734 0.0344533L20.9974 3.02929C25.1748 3.2748 29.1149 5.05246 32.0634 8.02192C35.0119 10.9914 36.7615 14.944 36.9774 19.123L39.9734 18.9683Z',
  // 右下
  'M20.7679 39.9853C25.714 39.7952 30.4139 37.7778 33.9587 34.3233C37.5035 30.8687 39.6413 26.2224 39.9588 21.2829L36.965 21.0904C36.6951 25.289 34.8779 29.2384 31.8649 32.1748C28.8518 35.1112 24.8569 36.8259 20.6527 36.9875L20.7679 39.9853Z',
  // 左下
  'M0.0452479 21.3446C0.366864 26.1177 2.38873 30.6174 5.74403 34.0274C9.09932 37.4374 13.5658 39.5317 18.3331 39.9304L18.5831 36.9408C14.5309 36.6019 10.7344 34.8217 7.88242 31.9233C5.03042 29.0248 3.31183 25.2 3.03846 21.1429L0.0452479 21.3446Z',
  // 左上
  'M18.6402 0.0462777C13.7469 0.379739 9.14669 2.49967 5.71416 6.00304C2.28163 9.50642 0.256107 14.149 0.0226661 19.0481L3.01927 19.1909C3.21769 15.0266 4.93938 11.0805 7.85704 8.10259C10.7747 5.12472 14.6849 3.32278 18.8442 3.03934L18.6402 0.0462777Z',
]

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
      <svg xmlns='http://www.w3.org/2000/svg' width={40} height={40} viewBox='0 0 40 40' fill='none'>
        {SEGMENT_PATHS.map((d, index) => {
          let color: string
          if (!isComplete && !isLoading) {
            // 完成时全部显示 trackColor
            color = trackColor
          } else if (index < step) {
            // 未完成时，前 step 段显示 fillColor
            color = fillColor
          } else {
            color = trackColor
          }
          return <path key={index} d={d} fill={color} />
        })}
      </svg>
      <span>{isComplete ? <IconBase className='icon-complete' /> : step}</span>
    </StepWrapper>
  )
})

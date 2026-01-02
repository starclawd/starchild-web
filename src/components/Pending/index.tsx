import { t } from '@lingui/core/macro'
import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import styled, { css } from 'styled-components'
import { rotate } from 'styles/animationStyled'

const PendingWrapper = styled.div<{ $isNotButtonLoading: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  .icon-loading {
    font-size: 18px;
    color: ${({ theme }) => theme.brand100};
    animation: ${rotate} 1s linear infinite;
  }
  span {
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.brand100};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      .icon-loading {
        font-size: 0.18rem;
        animation: ${rotate} 1s linear infinite;
      }
      span {
        font-size: 0.12rem;
        font-weight: 500;
        line-height: 0.18rem;
      }
    `}
  ${({ $isNotButtonLoading, theme }) =>
    $isNotButtonLoading &&
    css`
      justify-content: center;
      width: 100%;
      height: 100%;
      .icon-loading {
        font-size: 36px;
      }
      ${theme.isMobile &&
      css`
        .icon-loading {
          font-size: 0.36rem;
        }
      `}
    `}
`

export default function Pending({
  text = '',
  iconStyle,
  isNotButtonLoading = false,
}: {
  text?: string
  iconStyle?: React.CSSProperties
  // 按钮false，大容器组件 true
  isNotButtonLoading?: boolean
}) {
  return (
    <PendingWrapper className='pending-wrapper' $isNotButtonLoading={isNotButtonLoading}>
      <IconBase className='icon-loading' style={iconStyle} />
      {text && <span>{text}</span>}
    </PendingWrapper>
  )
}

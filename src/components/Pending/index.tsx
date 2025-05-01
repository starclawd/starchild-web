import { t } from '@lingui/core/macro'
import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import styled, { css, keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const PendingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  .icon-loading {
    font-size: 18px;
    color: ${({ theme }) => theme.brand6};
    animation: ${rotate} 1s linear infinite;
  }
  span {
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.brand6};
  }
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(4)};
    .icon-loading {
      font-size: .18rem;
      animation: ${rotate} 1s linear infinite;
    }
    span {
      font-size: .12rem;
      font-weight: 500;
      line-height: .18rem;
    }
  `}
`

export default function Pending({
  text = '',
  iconStyle
}: {
  text?: string
  iconStyle?: React.CSSProperties
}) {
  return (
    <PendingWrapper>
      <IconBase className="icon-loading" style={iconStyle} />
      {text && <span>{text}</span>}
    </PendingWrapper>
  )
}

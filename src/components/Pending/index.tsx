import { t } from '@lingui/core/macro'
import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import styled, { css } from 'styled-components'

const PendingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  .icon-loading {
    font-size: 18px;
    color: ${({ theme }) => theme.brand6};
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
    }
    span {
      font-size: .12rem;
      font-weight: 500;
      line-height: .18rem;
    }
  `}
`

export default function Pending({
  text = t`Pending`,
}: {
  text?: string
}) {
  return (
    <PendingWrapper>
      <IconBase className="icon-loading" />
      <span>{text}</span>
    </PendingWrapper>
  )
}

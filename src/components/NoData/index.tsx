import { vm } from 'pages/helper'
import { css } from 'styled-components'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import noDataImg from 'assets/chat/no-data.png'
import { IconBase } from 'components/Icons'

const NoDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: fit-content;
  min-height: 170px;
  gap: 8px;
  border-radius: 36px;
  .icon-no-data {
    font-size: 32px;
    color: ${({ theme }) => theme.black400};
  }
  span {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.black400};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
      border-radius: 0;
      background-color: transparent;
      min-height: ${vm(146)};
      img {
        width: ${vm(64)};
      }
      span {
        font-size: 0.12rem;
        font-weight: 400;
        line-height: 0.18rem;
      }
    `}
`

export default function NoData({ text }: { text?: React.ReactNode }) {
  return (
    <NoDataWrapper className='no-data-wrapper'>
      <IconBase className='icon-no-data' />
      <span>{text || <Trans>No results found.</Trans>}</span>
    </NoDataWrapper>
  )
}

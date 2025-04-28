import { vm } from 'pages/helper'
import { css } from 'styled-components'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import noDataImg from 'assets/tradeai/no-data.png'

const NoDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 20px;
  img {
    width: 195px;
  }
  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(20)};
    img {
      width: ${vm(195)};
    }
    span {
      font-size: 0.16rem;
      font-weight: 500;
      line-height: 0.24rem;
    }
  `}
`

export default function NoData() {
  return <NoDataWrapper>
    <img src={noDataImg} alt="no-data" />
    <span><Trans>No data</Trans></span>
  </NoDataWrapper>
}

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
  height: 304px;
  gap: 20px;
  border-radius: 36px;
  background-color: ${({ theme }) => theme.bgL1};
  img {
    width: 180px;
  }
  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(20)};
    border-radius: 0;
    background-color: transparent;
    height: 100%;
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

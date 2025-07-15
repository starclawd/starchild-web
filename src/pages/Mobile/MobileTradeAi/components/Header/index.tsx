import styled from 'styled-components'
import { vm } from 'pages/helper'
import MobileMenuIcon from 'pages/Mobile/components/MobileMenuIcon'
import { Trans } from '@lingui/react/macro'

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: ${vm(44)};
  padding: 0 ${vm(12)};
  > span {
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.textDark98};
  }
`

export default function Header() {
  return (
    <HeaderWrapper>
      <MobileMenuIcon />
      <span>
        <Trans>Agent</Trans>
      </span>
      <span></span>
    </HeaderWrapper>
  )
}

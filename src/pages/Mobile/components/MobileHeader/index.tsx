import styled from 'styled-components'
import { vm } from 'pages/helper'
import MobileMenuIcon from 'pages/Mobile/components/MobileMenuIcon'
import { Trans } from '@lingui/react/macro'

const MobileHeaderWrapper = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
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

const MenuWrapper = styled.div`
  position: absolute;
  left: ${vm(12)};
  height: 100%;
`

const RightSection = styled.div`
  position: absolute;
  right: ${vm(12)};
`

export default function MobileHeader({
  title,
  rightSection,
}: {
  title: React.ReactNode
  rightSection?: React.ReactNode
}) {
  return (
    <MobileHeaderWrapper>
      <MenuWrapper>
        <MobileMenuIcon />
      </MenuWrapper>
      <span>{title}</span>
      <RightSection>{rightSection}</RightSection>
    </MobileHeaderWrapper>
  )
}

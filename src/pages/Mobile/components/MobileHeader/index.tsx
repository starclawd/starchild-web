import styled from 'styled-components'
import { vm } from 'pages/helper'
import MobileMenuIcon from 'pages/Mobile/components/MobileMenuIcon'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'

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
    color: ${({ theme }) => theme.black0};
  }
`

const MenuWrapper = styled.div`
  position: absolute;
  left: ${vm(12)};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  .icon-chat-back {
    font-size: 0.24rem;
    color: ${({ theme }) => theme.black100};
  }
`

const LeftSection = styled.div`
  position: absolute;
  left: ${vm(12)};
`

const RightSection = styled.div`
  position: absolute;
  right: ${vm(12)};
`

export default function MobileHeader({
  title,
  hideMenu = false,
  rightSection,
  leftSection,
  showBackIcon = false,
  backIconCallback,
}: {
  hideMenu?: boolean
  title: React.ReactNode
  rightSection?: React.ReactNode
  leftSection?: React.ReactNode
  showBackIcon?: boolean
  backIconCallback?: () => void
}) {
  return (
    <MobileHeaderWrapper>
      {!hideMenu && (
        <MenuWrapper>
          {showBackIcon ? <IconBase className='icon-chat-back' onClick={backIconCallback} /> : <MobileMenuIcon />}
        </MenuWrapper>
      )}
      {hideMenu && leftSection && <LeftSection>{leftSection}</LeftSection>}
      <span>{title}</span>
      <RightSection>{rightSection}</RightSection>
    </MobileHeaderWrapper>
  )
}

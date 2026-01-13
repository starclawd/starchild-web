import { memo, useCallback, useState } from 'react'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'
import styled from 'styled-components'
import MobileHeader from 'pages/Mobile/components/MobileHeader'

const HeaderRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 30px;
  justify-content: center;

  > i {
    font-size: 24px;
    color: ${({ theme }) => theme.black200};
  }
`

interface MobileAgentHubHeaderProps {
  title: React.ReactNode
  onSearchClick: () => void
}

export default memo(function MobileAgentHubHeader({ title, onSearchClick }: MobileAgentHubHeaderProps) {
  return (
    <MobileHeader
      title={title}
      rightSection={
        <HeaderRightSection>
          <IconBase className='icon-search' onClick={onSearchClick} />
        </HeaderRightSection>
      }
    />
  )
})

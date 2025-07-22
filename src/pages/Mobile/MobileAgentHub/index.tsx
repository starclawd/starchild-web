import AgentHub from 'pages/AgentHub'
import { memo, useCallback, useState } from 'react'
import MobileHeader from '../components/MobileHeader'
import { IconBase } from 'components/Icons'
import BottomSheet from 'components/BottomSheet'
import { Trans } from '@lingui/react/macro'
import styled, { useTheme } from 'styled-components'
import IndicatorHub from 'pages/AgentHub/IndicatorHub'
import { vm } from 'pages/helper'

const HeaderRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 30px;
  justify-content: center;

  > i {
    font-size: 24px;
    color: ${({ theme }) => theme.textDark54};
  }
`

export default memo(function MobileAgentHub() {
  const [isOpen, setIsOpen] = useState(false)
  const theme = useTheme()

  const handleFilterClick = useCallback(() => {
    setIsOpen(true)
  }, [])
  return (
    <>
      <MobileHeader
        title={<Trans>Agent marketplace</Trans>}
        rightSection={
          <HeaderRightSection>
            <IconBase className='icon-search' onClick={handleFilterClick} />
          </HeaderRightSection>
        }
      />
      <AgentHub showSearchBar={false} />
      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        hideDragHandle={true}
        hideClose={false}
        isCloseText={true}
        rootStyle={{ overflowY: 'hidden', height: `calc(100vh - ${vm(44)})`, background: theme.black800 }}
      >
        <AgentHub showSearchBar={true} />
      </BottomSheet>
    </>
  )
})

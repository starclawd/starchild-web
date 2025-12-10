import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo } from 'react'
import { vm } from 'pages/helper'
import MobileHeader from '../components/MobileHeader'
import { BottomSafeArea } from 'components/SafeAreaWrapper'
import LiveChat from 'pages/Insights/components/LiveChat'

const MobileWrapper = styled(BottomSafeArea)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - ${vm(44)});
`

function MobileLiveChat() {
  return (
    <>
      <MobileHeader title={<Trans>Live chat</Trans>} />
      <MobileWrapper>
        <LiveChat />
      </MobileWrapper>
    </>
  )
}

export default memo(MobileLiveChat)

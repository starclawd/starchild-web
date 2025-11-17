import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo } from 'react'
import { vm } from 'pages/helper'
import MobileHeader from '../components/MobileHeader'
import { BottomSafeArea } from 'components/SafeAreaWrapper'
import Insights from 'pages/Insights'

const MobileWrapper = styled(BottomSafeArea)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - ${vm(44)});
`

function MobileInsights() {
  return (
    <>
      <MobileHeader title={<Trans>Insights</Trans>} />
      <MobileWrapper>
        <Insights />
      </MobileWrapper>
    </>
  )
}

export default memo(MobileInsights)

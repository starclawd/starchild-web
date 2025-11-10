import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo } from 'react'
import { vm } from 'pages/helper'
import MobileHeader from '../components/MobileHeader'
import { BottomSafeArea } from 'components/SafeAreaWrapper'
import Content from '../../Documents/components/Content'

const MobileDocumentsWrapper = styled(BottomSafeArea)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - ${vm(44)});
  padding: 0 ${vm(12)};
`

function MobileDocuments() {
  return (
    <>
      <MobileHeader title={<Trans>Documents</Trans>} />
      <MobileDocumentsWrapper>
        <Content />
      </MobileDocumentsWrapper>
    </>
  )
}

export default memo(MobileDocuments)

import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo } from 'react'
import Content from './components/Content'

const DocumentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 40px 20px;
`
function Documents() {
  return (
    <DocumentsWrapper>
      <Content />
    </DocumentsWrapper>
  )
}

export default memo(Documents)

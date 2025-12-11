import styled from 'styled-components'
import ActionLayer from '../ActionLayer'
import { Trans } from '@lingui/react/macro'
import { useCallback } from 'react'

const CodeWrapper = styled.div`
  display: flex;
  width: 100%;
`

export default function Code() {
  const createSuccess = false
  const handleGenerateCode = useCallback(async () => {
    console.log('handleGenerateCode')
  }, [])
  return (
    <CodeWrapper>
      <ActionLayer
        iconCls='icon-view-code'
        title={<Trans>Generate Code</Trans>}
        description={
          createSuccess ? (
            <Trans>
              Click [Generate Code] to let the Agent write the script and transform your text strategy into executable
              logic. Once generated, you can Simulation with virtual funds or deploy with real funds.
            </Trans>
          ) : (
            <Trans>Strategy Not Defined. Please describe and confirm your strategy logic first.</Trans>
          )
        }
        rightText={<Trans>Generate code</Trans>}
        rightButtonClickCallback={handleGenerateCode}
        rightButtonDisabled={!createSuccess}
      />
    </CodeWrapper>
  )
}

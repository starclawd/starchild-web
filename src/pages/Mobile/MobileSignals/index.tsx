import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useState, useCallback } from 'react'
import { vm } from 'pages/helper'
import MobileHeader from '../components/MobileHeader'
import { BottomSafeArea } from 'components/SafeAreaWrapper'
import SystemSignalOverview from 'pages/Insights/components/Signals'
import AgentList from '../MobileMyAgent/components/AgentList'

const MobileWrapper = styled(BottomSafeArea)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - ${vm(44)});
`

const AgentListButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${vm(6)} ${vm(12)};
  font-size: ${vm(14)};
  font-weight: 500;
  line-height: ${vm(20)};
  color: ${({ theme }) => theme.brand200};
  cursor: pointer;
`

function MobileSignals() {
  const [isAgentListOpen, setIsAgentListOpen] = useState(false)

  const handleAgentListClick = useCallback(() => {
    setIsAgentListOpen(true)
  }, [])

  const handleAgentListClose = useCallback(() => {
    setIsAgentListOpen(false)
  }, [])

  return (
    <>
      <MobileHeader
        title={<Trans>Signals</Trans>}
        rightSection={
          <AgentListButton onClick={handleAgentListClick}>
            <Trans>Agent list</Trans>
          </AgentListButton>
        }
      />
      <MobileWrapper>
        <SystemSignalOverview />
      </MobileWrapper>
      <AgentList isOpen={isAgentListOpen} onClose={handleAgentListClose} type='signals' />
    </>
  )
}

export default memo(MobileSignals)

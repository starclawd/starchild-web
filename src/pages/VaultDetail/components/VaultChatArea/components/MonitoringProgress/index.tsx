import { Trans } from '@lingui/react/macro'
import Pending from 'components/Pending'
import { memo } from 'react'
import styled from 'styled-components'

const MonitoringProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 4px;
  height: 18px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.brand100};
`

export default memo(function MonitoringProgress() {
  return (
    <MonitoringProgressWrapper>
      <Pending />
      <span>
        <Trans>Monitoring in progress...</Trans>
      </span>
    </MonitoringProgressWrapper>
  )
})

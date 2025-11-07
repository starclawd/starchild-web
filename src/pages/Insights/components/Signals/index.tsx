import { memo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'

const SignalsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.bgL0};
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  color: ${({ theme }) => theme.textL1};
  margin-bottom: 20px;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textL2};
  font-size: 16px;
`

const Signals = memo(() => {
  return (
    <SignalsWrapper>
      <Title>
        <Trans>Signals</Trans>
      </Title>
      <Content>
        <Trans>Signals content coming soon...</Trans>
      </Content>
    </SignalsWrapper>
  )
})

Signals.displayName = 'Signals'

export default Signals

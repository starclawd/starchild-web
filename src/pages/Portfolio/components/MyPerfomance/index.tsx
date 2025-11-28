import { Trans } from '@lingui/react/macro'
import styled from 'styled-components'

const MyPerfomanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
`

export default function MyPerfomance() {
  return (
    <MyPerfomanceWrapper>
      <Title>
        <Trans>My performance</Trans>
      </Title>
    </MyPerfomanceWrapper>
  )
}

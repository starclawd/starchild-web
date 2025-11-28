import { Trans } from '@lingui/react/macro'
import styled from 'styled-components'

const TransactionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.bgT30};
`

const Title = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.textL1};
`

export default function Transactions() {
  return (
    <TransactionsWrapper>
      <Title>
        <Trans>History</Trans>
      </Title>
    </TransactionsWrapper>
  )
}

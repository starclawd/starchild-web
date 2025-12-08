import styled from 'styled-components'

const SummaryWrapper = styled.div`
  display: flex;
  color: ${({ theme }) => theme.textDark98};
`

export default function Summary() {
  return <SummaryWrapper>summary</SummaryWrapper>
}

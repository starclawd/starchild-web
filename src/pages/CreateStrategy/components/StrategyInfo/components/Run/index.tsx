import styled from 'styled-components'

const RunWrapper = styled.div`
  display: flex;
  color: ${({ theme }) => theme.textDark98};
`

export default function Run() {
  return <RunWrapper>run</RunWrapper>
}

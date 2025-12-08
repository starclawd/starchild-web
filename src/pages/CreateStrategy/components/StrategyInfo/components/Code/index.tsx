import styled from 'styled-components'

const CodeWrapper = styled.div`
  display: flex;
  color: ${({ theme }) => theme.textDark98};
`

export default function Code() {
  return <CodeWrapper>code</CodeWrapper>
}

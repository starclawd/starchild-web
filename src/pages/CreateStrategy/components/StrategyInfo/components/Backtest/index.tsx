import styled from 'styled-components'

const BacktestWrapper = styled.div`
  display: flex;
  color: ${({ theme }) => theme.textDark98};
`

export default function Backtest() {
  return <BacktestWrapper>backtest</BacktestWrapper>
}

import styled from 'styled-components'
import { StrategySignalType } from 'api/strategy'
import { IconBase } from 'components/Icons'

const SignalAlertItemWrapper = styled.div`
  display: flex;
  gap: 4px;
  i {
    font-size: 18px;
    color: ${({ theme }) => theme.black100};
  }
`

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Signal = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.black200};
`

const Des = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.black0};
`

export default function SignalAlertItem({ signal }: { signal: StrategySignalType }) {
  const { name, description } = signal || { name: '', description: '' }
  return (
    <SignalAlertItemWrapper>
      <IconBase className='icon-signals' />
      <Right>
        <Signal>{name}</Signal>
        <Des>{description}</Des>
      </Right>
    </SignalAlertItemWrapper>
  )
}

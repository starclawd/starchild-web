import dayjs from 'dayjs'
import styled from 'styled-components'
import { StrategySignalType } from 'api/strategy'
import { useTimezone } from 'store/timezonecache/hooks'
import { IconBase } from 'components/Icons'

const SignalAlertItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.black800};
`

const Time = styled.div`
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  color: ${({ theme }) => theme.black300};
`

const Content = styled.div`
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
  const [timezone] = useTimezone()
  const { content, timestamp } = signal
  const { name, description } = content || { name: '', description: '' }
  return (
    <SignalAlertItemWrapper>
      <Time>{dayjs.tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')}</Time>
      <Content>
        <IconBase className='icon-signals' />
        <Right>
          <Signal>{name}</Signal>
          <Des>{description}</Des>
        </Right>
      </Content>
    </SignalAlertItemWrapper>
  )
}

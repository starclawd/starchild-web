import dayjs from 'dayjs'
import styled from 'styled-components'
import { StrategySignalType } from 'api/strategy'
import { useTimezone } from 'store/timezonecache/hooks'

const SignalAlertItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px;
  gap: 8px;
  background-color: ${({ theme }) => theme.black800};
  border-left: 2px solid ${({ theme }) => theme.black600};
`

const Signal = styled.div`
  width: fit-content;
  padding: 4px 8px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  border-radius: 4px;
  color: ${({ theme }) => theme.textL2};
  background-color: ${({ theme }) => theme.bgT20};
`

const Des = styled.div`
  display: flex;
  align-items: flex-start;
  padding-left: 8px;
  gap: 8px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  color: ${({ theme }) => theme.textL2};

  &::before {
    content: '•';
    flex-shrink: 0;
  }
`

const Time = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  margin-top: 12px;
  color: ${({ theme }) => theme.textL3};
`

export default function SignalAlertItem({ signal }: { signal: StrategySignalType }) {
  const [timezone] = useTimezone()
  const { content, timestamp } = signal
  const { name, description } = content || { name: '', description: '' }
  return (
    <SignalAlertItemWrapper>
      <Signal>{name}</Signal>
      <Des>{description}</Des>
      <Time>{dayjs.tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')}</Time>
    </SignalAlertItemWrapper>
  )
}

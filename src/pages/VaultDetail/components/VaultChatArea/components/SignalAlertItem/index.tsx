import dayjs from 'dayjs'
import { Trans } from '@lingui/react/macro'
import styled from 'styled-components'
import { StrategySignalDataType } from 'api/strategy'
import { useTimezone } from 'store/timezonecache/hooks'

const SignalAlertItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px;
  gap: 8px;
  background-color: ${({ theme }) => theme.black800};
`

const Title = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
  .icon-signal-warn {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
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

export default function SignalAlertItem({ signal }: { signal: StrategySignalDataType }) {
  const [timezone] = useTimezone()
  const { event_data } = signal
  const { name, description, timestamp } = event_data || {
    name: '',
    description: '',
    timestamp: '',
  }
  return (
    <SignalAlertItemWrapper>
      <Title>
        <Trans>🔔 SIGNAL ALERT:</Trans>
      </Title>
      <Signal>{name}</Signal>
      <Des>{description}</Des>
      <Time>{dayjs.tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')}</Time>
    </SignalAlertItemWrapper>
  )
}

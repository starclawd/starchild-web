import dayjs from 'dayjs'
import styled from 'styled-components'
import { LogType } from 'api/strategy'
import { useTimezone } from 'store/timezonecache/hooks'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'

const LogItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.black800};
  &:last-child {
    border-bottom: none;
  }
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

export default function LogItem({ log }: { log: LogType }) {
  const [timezone] = useTimezone()
  const { content, timestamp } = log
  const { log: logContent } = content || { log: '' }
  return (
    <LogItemWrapper>
      <Time>{dayjs.tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')}</Time>
      <Content>
        <IconBase className='icon-signal-log' />
        <Right>
          <Signal>
            <Trans>Check signal:</Trans>
          </Signal>
          <Des>{logContent}</Des>
        </Right>
      </Content>
    </LogItemWrapper>
  )
}

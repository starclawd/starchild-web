import dayjs from 'dayjs'
import { Trans } from '@lingui/react/macro'
import { StrategyThoughtType } from 'api/strategy'
import styled from 'styled-components'
import { useTimezone } from 'store/timezonecache/hooks'

const ChainOfThoughtWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background-color: ${({ theme }) => theme.black800};
`

const Title = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
`

const Des = styled.div`
  display: flex;
  flex-direction: column;
`

const DesItem = styled.div`
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

export default function ChainOfThought({ thought }: { thought: StrategyThoughtType }) {
  const [timezone] = useTimezone()
  const { content, timestamp } = thought
  const { reasoning } = content
  return (
    <ChainOfThoughtWrapper>
      <Title>
        <Trans>Chain of Thought</Trans>
      </Title>
      <Des>
        <DesItem>{reasoning}</DesItem>
      </Des>
      <Time>{dayjs.tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')}</Time>
    </ChainOfThoughtWrapper>
  )
}

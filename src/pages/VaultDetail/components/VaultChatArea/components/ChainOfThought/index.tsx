import dayjs from 'dayjs'
import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { StrategyThoughtType } from 'api/strategy'
import styled from 'styled-components'
import { useTimezone } from 'store/timezonecache/hooks'
import Markdown from 'components/Markdown'
import { ANI_DURATION } from 'constants/index'

const ChainOfThoughtWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background-color: ${({ theme }) => theme.black800};
  border-left: 2px solid ${({ theme }) => theme.black600};
  transition: all ${ANI_DURATION}s;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
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

const MarkdownContainer = styled.div<{ $expanded: boolean }>`
  position: relative;
  overflow: hidden;
  ${({ $expanded }) =>
    !$expanded &&
    `
    max-height: 120px; /* 5 lines * 24px line-height */
  `}

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 24px;
    background: ${({ $expanded, theme }) =>
      $expanded ? 'transparent' : `linear-gradient(transparent, ${theme.black800})`};
    pointer-events: none;
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
  const [expanded, setExpanded] = useState(false)
  const { content, timestamp } = thought
  const { reasoning } = content || { reasoning: '' }

  const handleToggle = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <ChainOfThoughtWrapper onClick={handleToggle}>
      <Title>
        <Trans>Chain of Thought</Trans>
      </Title>
      <Des>
        <DesItem>
          <MarkdownContainer $expanded={expanded}>
            <Markdown>{reasoning}</Markdown>
          </MarkdownContainer>
        </DesItem>
      </Des>
      <Time>{dayjs.tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')}</Time>
    </ChainOfThoughtWrapper>
  )
}

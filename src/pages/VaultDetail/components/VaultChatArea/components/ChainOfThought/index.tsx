import dayjs from 'dayjs'
import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { StrategyThoughtType } from 'api/strategy'
import styled from 'styled-components'
import { useTimezone } from 'store/timezonecache/hooks'
import Markdown from 'components/Markdown'
import { ANI_DURATION } from 'constants/index'
import { IconBase } from 'components/Icons'
import { css } from 'styled-components'

const ChainOfThoughtWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.black800};
  transition: all ${ANI_DURATION}s;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
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

const Title = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black100};
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
  color: ${({ theme }) => theme.black100};

  &::before {
    content: '•';
    flex-shrink: 0;
  }
`

const MarkdownContainer = styled.div<{ $expanded: boolean }>`
  position: relative;
  overflow: hidden;
  .markdown-wrapper {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.black0};
  }
  ${({ $expanded }) =>
    !$expanded &&
    css`
      max-height: 120px; /* 5 lines * 24px line-height */
    `}
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
      <Time>{dayjs.tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')}</Time>
      <Content>
        <IconBase className='icon-chain-of-thought' />
        <Right>
          <Title>
            <Trans>Chain of Thought</Trans>
          </Title>
          <MarkdownContainer $expanded={expanded}>
            <Markdown>{reasoning}</Markdown>
          </MarkdownContainer>
        </Right>
      </Content>
    </ChainOfThoughtWrapper>
  )
}

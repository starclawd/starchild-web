import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { StrategyThoughtType } from 'api/strategy'
import styled from 'styled-components'
import { useTimezone } from 'store/timezonecache/hooks'
import Markdown from 'components/Markdown'
import { IconBase } from 'components/Icons'
import { css } from 'styled-components'

const ChainOfThoughtWrapper = styled.div`
  display: flex;
  gap: 4px;
  cursor: pointer;
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
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.black200};
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
    ul {
      padding-left: 20px;
    }
  }
  ${({ $expanded }) =>
    !$expanded &&
    css`
      max-height: 120px; /* 5 lines * 24px line-height */
    `}
`

export default function ChainOfThought({ thought }: { thought: StrategyThoughtType }) {
  const [showReasoning, setShowReasoning] = useState(false)
  const { reasoning, summary } = thought || { reasoning: '', summary: '' }

  const handleToggle = () => {
    setShowReasoning((prev) => !prev)
  }

  return (
    <ChainOfThoughtWrapper onClick={handleToggle}>
      <IconBase className='icon-chain-of-thought' />
      <Right>
        <Title>
          <Trans>Chain of Thought</Trans>
        </Title>
        <MarkdownContainer $expanded={showReasoning}>
          <Markdown>{showReasoning ? reasoning : summary}</Markdown>
        </MarkdownContainer>
      </Right>
    </ChainOfThoughtWrapper>
  )
}

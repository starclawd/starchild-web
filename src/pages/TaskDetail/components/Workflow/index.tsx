import { IconBase } from 'components/Icons'
import Markdown from 'components/Markdown'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { vm } from 'pages/helper'
import styled, { css } from 'styled-components'

const WorkflowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 20px;
  max-height: 100%;
  overflow-y: auto;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
    `}
`

const ThinkItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
  .markdown-wrapper {
    font-size: 14px;
  }
  .icon-chat-tell-more {
    margin-top: 2px;
    flex-shrink: 0;
    font-size: 18px;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      font-size: 0.12rem;
      line-height: 0.18rem;
      .icon-chat-tell-more {
        margin-top: ${vm(2)};
        font-size: 0.16rem;
      }
    `}
`

export default function Workflow({
  renderedContent,
  scrollRef,
}: {
  renderedContent: any[]
  scrollRef: React.RefObject<HTMLDivElement> | null
}) {
  return (
    <WorkflowWrapper ref={scrollRef} className='scroll-style'>
      {renderedContent.map((item, index) => {
        if (item.type === 'tool_result') {
          return (
            <ThinkItem key={index}>
              <IconBase className='icon-chat-tell-more' />
              <Markdown>{item.content}</Markdown>
            </ThinkItem>
          )
        } else if (item.type === 'todo_item') {
          return (
            <ThinkItem key={index}>
              <IconBase className='icon-chat-tell-more' />
              <Markdown>{item.content}</Markdown>
            </ThinkItem>
          )
        }
        return null
      })}
    </WorkflowWrapper>
  )
}

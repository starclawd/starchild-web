import { IconBase } from 'components/Icons'
import Markdown from 'components/Markdown'
import { vm } from 'pages/helper'
import { useMemo } from 'react'
import { useIsCodeTaskType, useAgentDetailData } from 'store/agentdetail/hooks'
import styled, { css } from 'styled-components'

const WorkflowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 20px;
  max-height: 100%;
  margin-top: 16px;
  overflow-y: auto;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
      margin-top: ${vm(16)};
    `}
`

const WorkflowList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  const isCodeTaskType = useIsCodeTaskType()
  const [{ workflow }] = useAgentDetailData()
  const workflowList: {
    type: string
    content: string
  }[] = useMemo(() => {
    if (!workflow) return []
    try {
      return JSON.parse(workflow)
    } catch (error) {
      return []
    }
  }, [workflow])
  if (workflowList.length > 0 && !isCodeTaskType) {
    return (
      <WorkflowWrapper ref={scrollRef} className='scroll-style'>
        <WorkflowList>
          {workflowList.map((item, index) => {
            const { content } = item
            return <Markdown key={index}>{content}</Markdown>
          })}
        </WorkflowList>
      </WorkflowWrapper>
    )
  }
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
        } else if (item.type === 'todo_item' || item.type === 'text') {
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

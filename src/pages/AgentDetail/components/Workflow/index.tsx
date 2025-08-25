import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import Markdown from 'components/Markdown'
import { vm } from 'pages/helper'
import { useMemo } from 'react'
import { AgentDetailDataType, WORKFLOW_STATUS } from 'store/agentdetail/agentdetail'
import { useIsCodeTaskType } from 'store/agentdetail/hooks'
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

const ContentWithStatus = styled.div<{ $hasStatus: boolean }>`
  .markdown-wrapper {
    h2:first-child {
      margin-top: 0;
    }
  }
  ${({ $hasStatus }) =>
    $hasStatus &&
    css`
      display: inline;
      .markdown-wrapper {
        display: inline;
        width: auto;

        /* 让所有的块级元素变成内联 */
        p,
        div,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        ul,
        ol,
        li {
          display: inline;
          margin: 0;
          padding: 0;
        }

        /* 保持列表的基本样式但内联显示 */
        ul,
        ol {
          list-style: none;
        }

        li {
          display: inline;
          &:not(:last-child)::after {
            content: ', ';
          }
        }

        /* 段落之间用空格分隔 */
        p:not(:last-child)::after {
          content: ' ';
        }
      }
    `}
`

const ButtonStatus = styled.span<{ $status: WORKFLOW_STATUS }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: 20px;
  padding: 0 8px;
  margin-left: 4px;
  border-radius: 4px;
  color: ${({ theme }) => theme.textL2};
  vertical-align: top;
  transform: translateY(2px);
  font-size: 12px;
  line-height: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(20)};
      padding: 0 ${vm(8)};
      margin-left: ${vm(4)};
      border-radius: ${vm(4)};
      font-size: 0.1rem;
      line-height: ${vm(20)};
      transform: translateY(${vm(2)});
    `}
  ${({ $status }) =>
    $status === WORKFLOW_STATUS.PENDING &&
    css`
      background: ${({ theme }) => theme.blue200};
    `}
  ${({ $status }) =>
    $status === WORKFLOW_STATUS.IN_PROGRESS &&
    css`
      background: ${({ theme }) => theme.brand200};
    `}
  ${({ $status }) =>
    $status === WORKFLOW_STATUS.COMPLETED &&
    css`
      background: ${({ theme }) => theme.text20};
    `}
`

export default function Workflow({
  renderedContent,
  scrollRef,
  agentDetailData,
}: {
  renderedContent: any[]
  scrollRef: React.RefObject<HTMLDivElement> | null
  agentDetailData: AgentDetailDataType
}) {
  const { workflow } = agentDetailData
  const isCodeTaskType = useIsCodeTaskType(agentDetailData)
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
        const { type, content, status } = item
        if (type === 'tool_result' || type === 'todo_item' || type === 'text' || type === 'markdown') {
          return (
            <ThinkItem key={index}>
              <IconBase className='icon-chat-tell-more' />
              <ContentWithStatus $hasStatus={!!status}>
                <Markdown>{content}</Markdown>
                {status && <ButtonStatus $status={status}>{status}</ButtonStatus>}
              </ContentWithStatus>
            </ThinkItem>
          )
        }
        return null
      })}
    </WorkflowWrapper>
  )
}

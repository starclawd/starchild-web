import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import Markdown from 'components/Markdown'
import { ThoughtContentDataType } from 'store/chat/chat.d'
import styled, { css } from 'styled-components'
import { useRef } from 'react'

const ThinkListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
    `}
`

const ThinkItem = styled.div<{ $isLast?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  .icon-chat-tell-more {
    margin-top: 2px;
    flex-shrink: 0;
    font-size: 18px;
    color: ${({ theme, $isLast }) => ($isLast ? theme.black100 : theme.black300)};
  }
  .markdown-wrapper {
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme, $isLast }) => ($isLast ? theme.black100 : theme.black300)};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      .icon-chat-tell-more {
        margin-top: ${vm(2)};
        font-size: 0.18rem;
      }
      .markdown-wrapper {
        font-size: 0.13rem;
        line-height: 0.2rem;
      }
    `}
`

export default function ThinkList({ thoughtList }: { thoughtList: ThoughtContentDataType[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  return (
    <ThinkListWrapper ref={scrollRef} className='think-list-wrapper scroll-style'>
      {thoughtList.map((item, index) => {
        const { tool_name, tool_type, tool_description } = item
        const isLast = index === thoughtList.length - 1
        return (
          <ThinkItem className='think-item' key={`${tool_type}-${tool_name}-${index}`} $isLast={isLast}>
            <IconBase className='icon-chat-tell-more' />
            <Markdown>{tool_description}</Markdown>
          </ThinkItem>
        )
      })}
    </ThinkListWrapper>
  )
}

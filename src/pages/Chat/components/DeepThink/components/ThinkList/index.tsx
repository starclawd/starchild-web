import { IconBase } from 'components/Icons'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { vm } from 'pages/helper'
import Markdown from 'components/Markdown'
import { TempAiContentDataType, ThoughtContentDataType } from 'store/chat/chat.d'
import styled, { css } from 'styled-components'

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

const ThinkItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
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
      font-size: 0.14rem;
      line-height: 0.2rem;
      .icon-chat-tell-more {
        margin-top: ${vm(2)};
        font-size: 0.18rem;
      }
    `}
`

export default function ThinkList({ thoughtList }: { thoughtList: ThoughtContentDataType[] }) {
  const scrollRef = useScrollbarClass<HTMLDivElement>()
  return (
    <ThinkListWrapper ref={scrollRef} className='think-list-wrapper scroll-style'>
      {thoughtList.map((item, index) => {
        const { tool_name, tool_type, tool_description } = item
        return (
          <ThinkItem key={`${tool_type}-${tool_name}-${index}`}>
            <IconBase className='icon-chat-tell-more' />
            <Markdown>{tool_description}</Markdown>
          </ThinkItem>
        )
      })}
    </ThinkListWrapper>
  )
}

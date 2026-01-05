import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import AgentOperator from 'pages/MyAgent/components/AgentOperator'
import { useCallback, useState } from 'react'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import styled, { css } from 'styled-components'
import { rotateSlowDown } from 'styles/animationStyled'

const RightSectionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${vm(12)};
  height: 100%;
  .icon-chat-more {
    color: ${({ theme }) => theme.black100};
  }
`

const ThinkIconWrapper = styled.div<{ $isAnimating: boolean }>`
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 0.18rem;
  color: ${({ theme }) => theme.brand100};
  cursor: pointer;

  .icon-chat-thinking {
    transition: transform 0.2s ease;
    line-height: 0.18rem;
    ${({ $isAnimating }) =>
      $isAnimating &&
      css`
        animation: ${rotateSlowDown} 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      `}
  }
`

export default function RightSection({
  data,
  isOpenBottomSheet,
  setIsOpenBottomSheet,
}: {
  data: AgentDetailDataType
  isOpenBottomSheet: boolean
  setIsOpenBottomSheet: (isOpen: boolean) => void
}) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleThinkIconClick = useCallback(() => {
    // 触发动画
    setIsAnimating(true)
    setIsOpenBottomSheet(true)

    // 动画结束后打开底部弹窗
    setTimeout(() => {
      setIsAnimating(false)
    }, 2000) // 2.5秒动画时长
  }, [setIsOpenBottomSheet])

  return (
    <RightSectionWrapper>
      <ThinkIconWrapper $isAnimating={isAnimating} onClick={handleThinkIconClick}>
        <IconBase className='icon-chat-thinking' />
      </ThinkIconWrapper>
      <AgentOperator offsetLeft={12} showTriggerTimes={false} data={data} />
    </RightSectionWrapper>
  )
}

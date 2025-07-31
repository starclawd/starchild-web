import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import AgentItem from 'pages/MyAgent/components/AgentItem'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { useCreateAgentModalToggle } from 'store/application/hooks'
import { useSubscribedAgents, useCurrentAgentDetailData } from 'store/myagent/hooks'
import styled from 'styled-components'
import { useEffect, useRef, useState, useCallback } from 'react'

const MyAgentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  gap: 8px;
  outline: none;
  &:focus {
    outline: none;
  }
`

const CreateTask = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  flex-shrink: 0;
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  cursor: pointer;
  color: ${({ theme }) => theme.textL3};
  border: 1px dashed ${({ theme }) => theme.bgT20};
  .icon-chat-upload {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }
`

const AgentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: calc(100% - 52px);
`

export default function MyAgent() {
  const toggleCreateAgentModal = useCreateAgentModalToggle()
  const [subscribedAgents] = useSubscribedAgents()
  const [currentAgentDetailData, setCurrentAgentDetailData] = useCurrentAgentDetailData()
  const wrapperRef = useRef<HTMLDivElement>(null)

  // 获取当前选中项的索引
  const getCurrentSelectedIndex = useCallback(() => {
    if (!currentAgentDetailData || subscribedAgents.length === 0) return -1
    return subscribedAgents.findIndex((agent) => agent.id === currentAgentDetailData.id)
  }, [currentAgentDetailData, subscribedAgents])

  // 处理键盘导航
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (subscribedAgents.length === 0) return

      const currentIndex = getCurrentSelectedIndex()
      let newIndex = currentIndex

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault()
          if (currentIndex <= 0) {
            newIndex = subscribedAgents.length - 1 // 循环到最后一个
          } else {
            newIndex = currentIndex - 1
          }
          break

        case 'ArrowDown':
          event.preventDefault()
          if (currentIndex >= subscribedAgents.length - 1) {
            newIndex = 0 // 循环到第一个
          } else {
            newIndex = currentIndex + 1
          }
          break

        case 'ArrowLeft':
          event.preventDefault()
          // 左键和上键功能相同
          if (currentIndex <= 0) {
            newIndex = subscribedAgents.length - 1
          } else {
            newIndex = currentIndex - 1
          }
          break

        case 'ArrowRight':
          event.preventDefault()
          // 右键和下键功能相同
          if (currentIndex >= subscribedAgents.length - 1) {
            newIndex = 0
          } else {
            newIndex = currentIndex + 1
          }
          break

        default:
          return
      }

      if (newIndex >= 0 && newIndex < subscribedAgents.length) {
        setCurrentAgentDetailData(subscribedAgents[newIndex])
      }
    },
    [subscribedAgents, getCurrentSelectedIndex, setCurrentAgentDetailData],
  )

  // 添加键盘事件监听
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    wrapper.addEventListener('keydown', handleKeyDown)

    return () => {
      wrapper.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  // 当组件挂载时，如果没有选中任何agent且有可用的agents，自动选中第一个
  useEffect(() => {
    if (!currentAgentDetailData && subscribedAgents.length > 0) {
      setCurrentAgentDetailData(subscribedAgents[0])
    }
  }, [currentAgentDetailData, subscribedAgents, setCurrentAgentDetailData])

  // 点击容器时获得焦点，以便能够接收键盘事件
  const handleWrapperClick = useCallback(() => {
    wrapperRef.current?.focus()
  }, [])

  return (
    <MyAgentWrapper ref={wrapperRef} tabIndex={0} onClick={handleWrapperClick}>
      <CreateTask onClick={toggleCreateAgentModal}>
        <IconBase className='icon-chat-upload' />
        <Trans>Create Agent</Trans>
      </CreateTask>
      <AgentList className='scroll-style'>
        {subscribedAgents.length > 0
          ? subscribedAgents.map((item) => {
              return <AgentItem key={item.id} data={item} />
            })
          : null}
      </AgentList>
    </MyAgentWrapper>
  )
}

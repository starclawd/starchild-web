import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import AgentItem from 'pages/MyAgent/components/AgentItem'
import { useCreateAgentModalToggle, useCurrentRouter, useIsMobile, useIsShowMobileMenu } from 'store/application/hooks'
import { useSubscribedAgents, useCurrentEditAgentData } from 'store/myagent/hooks'
import styled, { css } from 'styled-components'
import { useEffect, useRef, useCallback, useMemo } from 'react'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import MenuNoAgent from 'pages/MyAgent/components/MenuNoAgent'
import { ButtonCommon } from 'components/Button'
import { ROUTER } from 'pages/router'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import useParsedQueryString from 'hooks/useParsedQueryString'

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
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const Overview = styled(ButtonCommon)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  height: ${vm(32)};
  padding: ${vm(8)};
  border-radius: ${vm(6)};
  font-size: 0.13rem;
  line-height: 0.2rem;
  color: ${({ theme }) => theme.textL2};
  background: ${({ theme }) => theme.bgT10};
`

const CreateAgent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
  flex-shrink: 0;
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
  border: 1px dashed ${({ theme }) => theme.bgT20};
  transition: all ${ANI_DURATION}s;
  .icon-chat-upload {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) =>
    theme.isMobile
      ? css`
          margin-top: 0;
          height: ${vm(32)};
          font-size: 0.12rem;
          line-height: 0.18rem;
          border-radius: ${vm(6)};
          gap: ${vm(4)};
          .icon-chat-upload {
            font-size: 0.14rem;
          }
        `
      : css`
          cursor: pointer;
          &:hover {
            background-color: ${({ theme }) => theme.bgT20};
          }
        `}
`

const AgentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: calc(100% - 52px);
  ${({ theme }) =>
    !theme.isMobile &&
    css`
      margin-right: 0 !important;
      padding-right: 4px !important;
    `}
`

export default function MyAgent() {
  const isMobile = useIsMobile()
  const [, setCurrentRouter] = useCurrentRouter()
  const toggleCreateAgentModal = useCreateAgentModalToggle()
  const [subscribedAgents] = useSubscribedAgents()
  const [, setIsShowMobileMenu] = useIsShowMobileMenu()
  const [, setCurrentEditAgentData] = useCurrentEditAgentData()
  const { agentId } = useParsedQueryString()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const scrollRef = useScrollbarClass<HTMLDivElement>()

  const sortSubscribedAgents = useMemo(() => {
    return [...subscribedAgents].sort((a, b) => {
      return (
        (Number(b.triggered_at) || Number(b.created_at) || 0) - (Number(a.triggered_at) || Number(a.created_at) || 0)
      )
    })
  }, [subscribedAgents])

  // 获取当前选中项的索引
  const getCurrentSelectedIndex = useCallback(() => {
    if (!agentId || sortSubscribedAgents.length === 0) return -1
    return sortSubscribedAgents.findIndex((agent) => agent.id === Number(agentId))
  }, [agentId, sortSubscribedAgents])

  // 处理键盘导航
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (sortSubscribedAgents.length === 0) return

      const currentIndex = getCurrentSelectedIndex()
      let newIndex = currentIndex

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault()
          if (currentIndex <= 0) {
            newIndex = sortSubscribedAgents.length - 1 // 循环到最后一个
          } else {
            newIndex = currentIndex - 1
          }
          break

        case 'ArrowDown':
          event.preventDefault()
          if (currentIndex >= sortSubscribedAgents.length - 1) {
            newIndex = 0 // 循环到第一个
          } else {
            newIndex = currentIndex + 1
          }
          break

        case 'ArrowLeft':
          event.preventDefault()
          // 左键和上键功能相同
          if (currentIndex <= 0) {
            newIndex = sortSubscribedAgents.length - 1
          } else {
            newIndex = currentIndex - 1
          }
          break

        case 'ArrowRight':
          event.preventDefault()
          // 右键和下键功能相同
          if (currentIndex >= sortSubscribedAgents.length - 1) {
            newIndex = 0
          } else {
            newIndex = currentIndex + 1
          }
          break

        default:
          return
      }

      if (newIndex >= 0 && newIndex < sortSubscribedAgents.length) {
        setCurrentRouter(`${ROUTER.AGENT_DETAIL}?agentId=${sortSubscribedAgents[newIndex].id}&from=myagent`)
      }
    },
    [sortSubscribedAgents, getCurrentSelectedIndex, setCurrentRouter],
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

  // 点击容器时获得焦点，以便能够接收键盘事件
  const handleWrapperClick = useCallback(() => {
    wrapperRef.current?.focus()
  }, [])

  const showAgentModal = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setCurrentEditAgentData(null)
      toggleCreateAgentModal()
      if (isMobile) {
        setIsShowMobileMenu(false)
      }
    },
    [isMobile, setIsShowMobileMenu, toggleCreateAgentModal, setCurrentEditAgentData],
  )

  const showOverview = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setCurrentRouter(ROUTER.MY_AGENT)
      setIsShowMobileMenu(false)
    },
    [setCurrentRouter, setIsShowMobileMenu],
  )

  return (
    <MyAgentWrapper ref={wrapperRef} tabIndex={0} onClick={handleWrapperClick}>
      {isMobile && (
        <Overview onClick={showOverview}>
          <Trans>Overview</Trans>
        </Overview>
      )}
      <CreateAgent onClick={showAgentModal}>
        <IconBase className='icon-chat-upload' />
        <Trans>Create Agent</Trans>
      </CreateAgent>
      <AgentList className={isMobile ? '' : 'scroll-style'} ref={isMobile ? undefined : scrollRef}>
        {sortSubscribedAgents.length > 0 ? (
          sortSubscribedAgents.map((item) => {
            return <AgentItem key={item.id} data={item} />
          })
        ) : (
          <MenuNoAgent />
        )}
      </AgentList>
    </MyAgentWrapper>
  )
}

import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import AgentItem from 'pages/MyAgent/components/AgentItem'
import { useCreateAgentModalToggle, useCurrentRouter, useIsMobile, useIsShowMobileMenu } from 'store/application/hooks'
import { useSubscribedAgents, useCurrentAgentDetailData, useCurrentEditAgentData } from 'store/myagent/hooks'
import styled, { css } from 'styled-components'
import { useEffect, useRef, useCallback } from 'react'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import MenuNoAgent from 'pages/MyAgent/components/MenuNoAgent'
import { ButtonCommon } from 'components/Button'
import { ROUTER } from 'pages/router'

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
`

export default function MyAgent() {
  const isMobile = useIsMobile()
  const [, setCurrentRouter] = useCurrentRouter()
  const toggleCreateAgentModal = useCreateAgentModalToggle()
  const [subscribedAgents] = useSubscribedAgents()
  const [, setIsShowMobileMenu] = useIsShowMobileMenu()
  const [, setCurrentEditAgentData] = useCurrentEditAgentData()
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
      setCurrentAgentDetailData(null)
      setIsShowMobileMenu(false)
    },
    [setCurrentRouter, setCurrentAgentDetailData, setIsShowMobileMenu],
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
      <AgentList className={isMobile ? '' : 'scroll-style'}>
        {subscribedAgents.length > 0 ? (
          subscribedAgents.map((item) => {
            return <AgentItem key={item.id} data={item} />
          })
        ) : (
          <MenuNoAgent />
        )}
      </AgentList>
    </MyAgentWrapper>
  )
}

import { Trans } from '@lingui/react/macro'
import Popover from 'components/Popover'
import { ANI_DURATION } from 'constants/index'
import { useState, useMemo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { useCurrentAiThreadId } from 'store/chatcache/hooks'
import {
  useDeleteThread,
  useGetThreadsList,
  useCurrentLoadingThreadId,
  useIsLoadingData,
  useIsRenderingData,
} from 'store/chat/hooks'
import { useUserInfo } from 'store/login/hooks'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'store/themecache/hooks'
import { useIsPopoverOpen } from 'store/application/hooks'
import Pending from 'components/Pending'

const OperatorWrapper = styled.div`
  display: flex;
`

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 160px;
  padding: 4px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.black700};
  box-shadow: 0px 4px 4px 0px ${({ theme }) => theme.systemShadow};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(160)};
      padding: ${vm(4)};
      border-radius: ${vm(12)};
    `}
`

const DropdownItem = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  width: 100%;
  height: 36px;
  padding: 8px;
  border-radius: 8px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.textL1};

  i {
    font-size: 18px;
    color: ${({ theme, $color }) => $color || theme.textL3};
  }

  span {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme, $color }) => $color || theme.textL2};
  }

  ${({ theme }) =>
    theme.isMobile
      ? css`
          height: ${vm(36)};
          padding: ${vm(8)};
          border-radius: ${vm(8)};
          gap: ${vm(6)};
          i {
            font-size: 0.18rem;
          }
          span {
            font-size: 0.14rem;
            font-weight: 400;
            line-height: 0.2rem;
          }
        `
      : css`
          cursor: pointer;
          &:hover {
            background-color: ${({ theme }) => theme.bgT20};
          }
        `}
`

const DropdownIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(24)};
      height: ${vm(24)};
      font-size: 0.18rem;
    `}
`

const IconWrapper = styled.div<{ $isShowTaskOperator: boolean; $isLoading: boolean }>`
  display: none;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  font-size: 18px;
  border-radius: 50%;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.textL3};
  ${({ theme }) =>
    theme.isMobile
      ? css`
          display: flex;
          width: ${vm(24)};
          height: ${vm(24)};
          font-size: 0.18rem;
          background-color: transparent !important;
        `
      : css`
          &:hover {
            color: ${theme.textL1};
            background-color: ${theme.bgT20};
          }
        `}
  ${({ $isShowTaskOperator, theme }) =>
    $isShowTaskOperator &&
    css`
      display: flex;
      background-color: ${theme.bgT20};
    `}
    ${({ $isLoading }) =>
    $isLoading &&
    css`
      display: flex;
    `}
`

export default function Operator({ threadId }: { threadId: string }) {
  const toast = useToast()
  const theme = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [currentLoadingThreadId] = useCurrentLoadingThreadId()
  const [isShowTaskOperator, setIsShowTaskOperator] = useState(false)
  const [currentAiThreadId] = useCurrentAiThreadId()
  const triggerDeleteThread = useDeleteThread()
  const [isLoadingData] = useIsLoadingData()
  const [, setIsPopoverOpen] = useIsPopoverOpen()
  const [isRenderingData] = useIsRenderingData()
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const deleteThread = useCallback(
    (threadId: string) => {
      return async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        if (isLoading) return
        if (threadId === currentAiThreadId && (isLoadingData || isRenderingData)) return
        try {
          setIsLoading(true)
          const data = await triggerDeleteThread([threadId])
          await triggerGetAiBotChatThreads()
          if ((data as any).isSuccess) {
            toast({
              title: <Trans>Conversation Deleted</Trans>,
              description: (
                <span>
                  <Trans>
                    <span style={{ color: theme.textL1 }}>{1}</span> conversations were successfully deleted.
                  </Trans>
                </span>
              ),
              status: TOAST_STATUS.SUCCESS,
              typeIcon: 'icon-chat-rubbish',
              iconTheme: theme.ruby50,
            })
            setIsShowTaskOperator(false)
            setIsPopoverOpen(false)
          }
          setIsLoading(false)
        } catch (error) {
          setIsLoading(false)
        }
      }
    },
    [
      isLoading,
      currentAiThreadId,
      isLoadingData,
      isRenderingData,
      theme,
      toast,
      setIsPopoverOpen,
      triggerGetAiBotChatThreads,
      triggerDeleteThread,
    ],
  )
  const actionConfigs = useMemo(() => {
    return [
      {
        type: 'Delete',
        icon: 'icon-chat-rubbish',
        label: <Trans>Delete</Trans>,
        color: theme.red100,
        onClick: deleteThread(threadId),
        visible: true,
      },
    ]
  }, [threadId, theme.red100, deleteThread])
  const closeTaskOperator = useCallback(() => {
    setIsShowTaskOperator(false)
    setIsPopoverOpen(false)
  }, [setIsPopoverOpen])

  const showOperator = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      const newValue = !isShowTaskOperator
      setIsShowTaskOperator(newValue)
      setIsPopoverOpen(newValue)
    },
    [isShowTaskOperator, setIsPopoverOpen],
  )

  return (
    <OperatorWrapper onClick={showOperator}>
      <Popover
        placement='top-end'
        show={isShowTaskOperator}
        onClickOutside={closeTaskOperator}
        offsetTop={-10}
        offsetLeft={-10}
        content={
          <DropdownWrapper>
            {actionConfigs.map((config) => (
              <DropdownItem key={config.type} onClick={config.onClick} $color={config.color}>
                <DropdownIcon>{isLoading ? <Pending /> : <IconBase className={config.icon} />}</DropdownIcon>
                <span>{config.label}</span>
              </DropdownItem>
            ))}
          </DropdownWrapper>
        }
      >
        <IconWrapper
          $isLoading={currentLoadingThreadId === threadId}
          $isShowTaskOperator={isShowTaskOperator}
          className='operator-icon'
        >
          {currentLoadingThreadId === threadId ? <Pending /> : <IconBase className='icon-chat-more' />}
        </IconWrapper>
      </Popover>
    </OperatorWrapper>
  )
}

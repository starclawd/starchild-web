import { ReactNode, useCallback, useState } from 'react'
import { styled, css } from 'styled-components'
import { useCurrentRouter } from 'store/application/hooks'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'store/themecache/hooks'
import { useUserInfo } from 'store/login/hooks'
import { useCurrentAiThreadId } from 'store/chatcache/hooks'
import {
  useDeleteThread,
  useGetThreadsList,
  useIsLoadingAiContent,
  useIsLoadingData,
  useIsRenderingData,
} from 'store/chat/hooks'
import { ROUTER } from 'pages/router'
import { Trans } from '@lingui/react/macro'
import Pending from 'components/Pending'
import { IconBase } from 'components/Icons'
import Operator from '../Operator'

const ThreadItemWrapper = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  height: 36px;
  padding: 0 8px;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  background-color: transparent;
  transition: all ${ANI_DURATION}s;
  cursor: pointer;
  color: ${({ theme }) => theme.textL2};
  .pending-wrapper {
    width: auto;
    .icon-loading {
      font-size: 16px;
    }
  }
  span {
    max-width: 210px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      color: ${theme.textL1};
    `}
  ${({ theme }) =>
    theme.isMobile
      ? css`
          height: ${vm(36)};
          padding: 0 ${vm(8)};
          font-size: 0.14rem;
          line-height: 0.2rem;
        `
      : css`
          &:hover {
            .operator-icon {
              display: flex;
            }
          }
        `}
`

export default function ThreadItem({
  title,
  threadId,
  isActive,
  isMobileMenu,
  mobileMenuCallback,
}: {
  title: ReactNode
  threadId: string
  isActive: boolean
  isMobileMenu?: boolean
  mobileMenuCallback?: () => void
}) {
  const toast = useToast()
  const theme = useTheme()
  const [{ telegramUserId }] = useUserInfo()
  const [isLoading, setIsLoading] = useState(false)
  const [currentAiThreadId] = useCurrentAiThreadId()
  const triggerDeleteThread = useDeleteThread()
  const [isAiLoading] = useIsLoadingData()
  const [, setCurrentRouter] = useCurrentRouter()
  const [isRenderingData] = useIsRenderingData()
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const [, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [isLoadingAiContent] = useIsLoadingAiContent()
  const changeThreadId = useCallback(
    (threadId: string) => {
      return () => {
        setCurrentRouter(ROUTER.CHAT)
        if (isMobileMenu) {
          setTimeout(() => {
            mobileMenuCallback?.()
          }, 500)
        }
        if (isLoadingAiContent || isAiLoading || isRenderingData) return
        setCurrentAiThreadId(threadId)
      }
    },
    [
      setCurrentAiThreadId,
      setCurrentRouter,
      mobileMenuCallback,
      isMobileMenu,
      isLoadingAiContent,
      isAiLoading,
      isRenderingData,
    ],
  )
  const deleteThread = useCallback(
    (threadId: string) => {
      return async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        if (isLoading) return
        if (threadId === currentAiThreadId && (isAiLoading || isRenderingData)) return
        try {
          setIsLoading(true)
          const data = await triggerDeleteThread([threadId])
          await triggerGetAiBotChatThreads({
            telegramUserId,
          })
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
      isAiLoading,
      isRenderingData,
      telegramUserId,
      theme,
      toast,
      triggerGetAiBotChatThreads,
      triggerDeleteThread,
    ],
  )
  return (
    <ThreadItemWrapper $isActive={isActive} onClick={changeThreadId(threadId)} key={threadId}>
      <span>{title}</span>
      <Operator threadId={threadId} />
    </ThreadItemWrapper>
  )
}

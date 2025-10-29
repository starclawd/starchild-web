import { ReactNode, useCallback, useMemo } from 'react'
import { styled, css } from 'styled-components'
import { useCurrentRouter } from 'store/application/hooks'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { useCurrentAiThreadId } from 'store/chatcache/hooks'
import { useCurrentLoadingThreadId, useIsLoadingData, useIsRenderingData } from 'store/chat/hooks'
import { ROUTER } from 'pages/router'
import Operator from '../Operator'

const ThreadItemWrapper = styled.div<{ $isActive: boolean; $isTgThread: boolean }>`
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
  > span {
    display: flex;
    align-items: center;
    gap: 4px;
    span {
      max-width: ${({ $isTgThread }) => ($isTgThread ? '130px' : '180px')};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
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

const TelegramTag = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: fit-content;
  height: 18px;
  padding: 0 8px;
  background-color: rgba(96, 140, 255, 0.15);
  border-radius: 4px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px; /* 150% */
  letter-spacing: 0.36px;
  color: ${({ theme }) => theme.brand4};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(18)};
      padding: 0 ${vm(8)};
      border-radius: ${vm(4)};
      font-size: 0.12rem;
      line-height: 0.18rem;
      letter-spacing: 0.36px;
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
  const [isLoadingData] = useIsLoadingData()
  const [, setCurrentRouter] = useCurrentRouter()
  const [isRenderingData] = useIsRenderingData()
  const [, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [currentLoadingThreadId] = useCurrentLoadingThreadId()
  const isTgThread = useMemo(() => {
    return threadId === '-'
  }, [threadId])
  const changeThreadId = useCallback(
    (threadId: string) => {
      return () => {
        setCurrentRouter(ROUTER.CHAT)
        if (isMobileMenu) {
          setTimeout(() => {
            mobileMenuCallback?.()
          }, 500)
        }
        if (currentLoadingThreadId || isLoadingData || isRenderingData) return
        setCurrentAiThreadId(threadId)
      }
    },
    [
      setCurrentAiThreadId,
      setCurrentRouter,
      mobileMenuCallback,
      isMobileMenu,
      currentLoadingThreadId,
      isLoadingData,
      isRenderingData,
    ],
  )
  return (
    <ThreadItemWrapper $isTgThread={isTgThread} $isActive={isActive} onClick={changeThreadId(threadId)} key={threadId}>
      <span>
        {isTgThread && <TelegramTag>Tg</TelegramTag>}
        <span>{title}</span>
      </span>
      <Operator threadId={threadId} />
    </ThreadItemWrapper>
  )
}

import { ReactNode, useCallback } from 'react'
import { styled, css } from 'styled-components'
import { useCurrentRouter } from 'store/application/hooks'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { useCurrentAiThreadId } from 'store/chatcache/hooks'
import { useCurrentLoadingThreadId, useIsLoadingData, useIsRenderingData } from 'store/chat/hooks'
import { ROUTER } from 'pages/router'
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
  const [isLoadingData] = useIsLoadingData()
  const [, setCurrentRouter] = useCurrentRouter()
  const [isRenderingData] = useIsRenderingData()
  const [, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [currentLoadingThreadId] = useCurrentLoadingThreadId()
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
    <ThreadItemWrapper $isActive={isActive} onClick={changeThreadId(threadId)} key={threadId}>
      <span>{title}</span>
      <Operator threadId={threadId} />
    </ThreadItemWrapper>
  )
}

import { Trans } from '@lingui/react/macro'
import Select, { TriggerMethod, DataType } from 'components/Select'
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
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'store/themecache/hooks'
import { useIsPopoverOpen } from 'store/application/hooks'
import Pending from 'components/Pending'

const OperatorWrapper = styled.div`
  display: flex;
  .select-wrapper {
    width: auto;
    height: auto;
  }
`

const DropdownItem = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  width: 100%;
  height: 36px;
  padding: 8px;
  border-radius: 4px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.black0};

  i {
    font-size: 18px;
    color: ${({ theme, $color }) => $color || theme.black200};
  }

  span {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme, $color }) => $color || theme.black100};
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
            background-color: ${({ theme }) => theme.black500};
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
  color: ${({ theme }) => theme.black200};
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
            color: ${theme.black0};
            background-color: ${theme.black800};
          }
        `}
  ${({ $isShowTaskOperator, theme }) =>
    $isShowTaskOperator &&
    css`
      display: flex;
      background-color: ${theme.black800};
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

  const handleDelete = useCallback(async () => {
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
                <span style={{ color: theme.black0 }}>{1}</span> conversations were successfully deleted.
              </Trans>
            </span>
          ),
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-delete',
          iconTheme: theme.ruby50,
        })
        setIsShowTaskOperator(false)
        setIsPopoverOpen(false)
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }, [
    isLoading,
    threadId,
    currentAiThreadId,
    isLoadingData,
    isRenderingData,
    theme,
    toast,
    setIsPopoverOpen,
    triggerGetAiBotChatThreads,
    triggerDeleteThread,
  ])

  const dataList: DataType[] = useMemo(() => {
    return [
      {
        text: <Trans>Delete</Trans>,
        value: 'delete',
        customerItem: true,
        customerItemCom: (
          <DropdownItem $color={theme.red100}>
            <DropdownIcon>{isLoading ? <Pending /> : <IconBase className='icon-delete' />}</DropdownIcon>
            <span>
              <Trans>Delete</Trans>
            </span>
          </DropdownItem>
        ),
        clickCallback: handleDelete,
      },
    ]
  }, [theme.red100, isLoading, handleDelete])

  const onHide = useCallback(() => {
    setIsShowTaskOperator(false)
    setIsPopoverOpen(false)
  }, [setIsPopoverOpen])

  const showOperator = useCallback(() => {
    const newValue = !isShowTaskOperator
    setIsShowTaskOperator(newValue)
    setIsPopoverOpen(newValue)
  }, [isShowTaskOperator, setIsPopoverOpen])

  const handleOperatorClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }, [])

  return (
    <OperatorWrapper onClick={handleOperatorClick}>
      <Select
        value=''
        hideExpand
        dataList={dataList}
        triggerMethod={TriggerMethod.CLICK}
        placement='top-end'
        usePortal
        offsetTop={-10}
        offsetLeft={-10}
        useOutShow
        outShow={isShowTaskOperator}
        outSetShow={showOperator}
        onHide={onHide}
        hideScrollbar
      >
        <IconWrapper
          $isLoading={currentLoadingThreadId === threadId}
          $isShowTaskOperator={isShowTaskOperator}
          className='operator-icon'
        >
          {currentLoadingThreadId === threadId ? <Pending /> : <IconBase className='icon-more' />}
        </IconWrapper>
      </Select>
    </OperatorWrapper>
  )
}

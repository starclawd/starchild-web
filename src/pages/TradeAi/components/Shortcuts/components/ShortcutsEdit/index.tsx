import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import Popover from 'components/Popover'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { useCallback, useState } from 'react'
import { useAddQuestionModalToggle, useIsMobile } from 'store/application/hooks'
import { useUserInfo } from 'store/login/hooks'
import { useDeleteShortcut, useGetShortcuts } from 'store/shortcuts/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'

const ChatMoreWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 100%;
  .icon-chat-more {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  ${({ theme }) => theme.isMobile && css`
    font-size: 0.18rem;
  `}
`

const MoreIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: transparent;
  transition: all ${ANI_DURATION}s;
  ${({ theme }) => theme.isMobile
  ? css`
    width: ${vm(24)};
    height: ${vm(24)};
  ` : css`
    cursor: pointer;
    &:hover {
      background-color: ${({ theme }) => theme.bgT30};
    }
  `}
`

const OperatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 160px;
  padding: 12px;
  gap: 8px;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  background-color: ${({ theme }) => theme.bgL0};
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(270)};
    padding: ${vm(20)};
    gap: ${vm(20)};
    border: none;
    border-radius: ${vm(24)};
    background-color: ${({ theme }) => theme.sfC2};
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.50);
  `}
`

const EditWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  height: 36px;
  > span:first-child {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    gap: 6px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.textL1};
  }
  .icon-chat-expand {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) => theme.isMobile
  ? css`
    height: ${vm(36)};
    > span:first-child {
      gap: ${vm(12)};
      font-size: 0.16rem;
      font-weight: 500;
      line-height: 0.24rem;
    }
    .icon-chat-expand {
      font-size: 0.18rem;
    }
  ` : css`
    cursor: pointer;
    border-radius: 12px;
    padding: 0 12px;
    transition: all ${ANI_DURATION}s;
    &:hover {
      background-color: ${({ theme }) => theme.bgL2};
    }
  `}
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.textL2};
  .icon-chat-new,
  .icon-chat-rubbish {
    font-size: 24px;
  }
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(36)};
    height: ${vm(36)};
    border-radius: 50%;
    background-color: ${({ theme }) => theme.sfC1};
    .icon-chat-new,
    .icon-chat-rubbish {
      font-size: 0.18rem;
    }
  `}
`

const DeleteWrapper = styled(EditWrapper)`
  width: 100%;
  height: 36px;
  > span:first-child {
    color: ${({ theme }) => theme.ruby50};
    .icon-chat-rubbish {
      color: ${({ theme }) => theme.ruby50};
    }
  }
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(36)};
  `}
`

export default function ShortcutsEdit({
  text,
  id,
  operatorText,
  setOperatorText,
  setEditQuestionData,
}: {
  text: string
  id: string
  operatorText: string
  setOperatorText: (text: string) => void
  setEditQuestionData: (data: {
    text: string
    id: string
  }) => void
}) {
  const isMobile = useIsMobile()
  const theme = useTheme()
  const toast = useToast()
  const [{ evmAddress }] = useUserInfo()
  const triggerGetShortcuts = useGetShortcuts()
  const triggerDeleteShortcut = useDeleteShortcut()
  const toggleAddQuestionModal = useAddQuestionModalToggle()
  const editQuestion = useCallback((data: {
    text: string
    id: string
  }) => {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setEditQuestionData(data)
      toggleAddQuestionModal()
      setOperatorText('')
    }
  }, [toggleAddQuestionModal, setOperatorText, setEditQuestionData])
  const removeFromFavorites = useCallback(({
    id,
    text,
  }: {
    id: string
    text: string
  }) => {
    return async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      if (evmAddress) {
        const data: any = await triggerDeleteShortcut({
          account: evmAddress,
          shortcutId: id,
        })
        if (data.isSuccess) {
          await triggerGetShortcuts({
            account: evmAddress,
          })
          setOperatorText('')
          toast({
            title: <Trans>Delete Successfully</Trans>,
            description: text,
            status: TOAST_STATUS.SUCCESS,
            typeIcon: 'icon-chat-rubbish',
            iconTheme: theme.ruby50,
          })
        }
      }
    }
  }, [evmAddress, triggerDeleteShortcut, setOperatorText, theme, triggerGetShortcuts, toast])
  const changeOperatorText = useCallback((text: string) => {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      if (text === operatorText) {
        setOperatorText('')
        return
      }
      setOperatorText(text)
    }
  }, [operatorText, setOperatorText])
  return <ChatMoreWrapper onClick={changeOperatorText(text)}>
    <Popover
      placement="bottom-end"
      show={operatorText === text}
      onClickOutside={() => setOperatorText('')}
      offsetTop={0}
      offsetLeft={0}
      content={<OperatorWrapper>
        <EditWrapper onClick={editQuestion({
          text,
          id,
        })}>
          <span>
            <IconWrapper>
              <IconBase className="icon-chat-new" />
            </IconWrapper>
            <span><Trans>Edit</Trans></span>
          </span>
          {isMobile && <IconBase className="icon-chat-expand" />}
        </EditWrapper>
        <DeleteWrapper onClick={removeFromFavorites({
          id,
          text,
        })}>
          <span>
            <IconWrapper>
              <IconBase className="icon-chat-rubbish" />
            </IconWrapper>
            <span><Trans>Delete</Trans></span>
          </span>
          {isMobile && <IconBase className="icon-chat-expand" />}
        </DeleteWrapper>
      </OperatorWrapper>}
    >
      <MoreIconWrapper>
        <IconBase className="icon-chat-more" />
      </MoreIconWrapper>
    </Popover>
  </ChatMoreWrapper>
}

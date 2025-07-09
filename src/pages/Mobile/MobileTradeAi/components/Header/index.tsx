import styled, { css } from 'styled-components'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'
import { Dispatch, SetStateAction, useCallback } from 'react'
import {
  useAddNewThread,
  useIsLoadingData,
  useIsRenderingData,
  useOpenDeleteThread,
  useThreadsList,
} from 'store/tradeai/hooks'
import { vm } from 'pages/helper'

const HeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 0 ${vm(12)};
`

const TopOperator = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      align-items: center;
      justify-content: space-between;
      padding: ${vm(8)};
      height: ${vm(60)};
      border-radius: ${vm(36)};
      background-color: ${({ theme }) => theme.bgL1};
      span {
        font-size: 0.16rem;
        font-weight: 500;
        line-height: 0.24rem;
        color: ${({ theme }) => theme.textL1};
      }
    `}
`

const Mask = styled.div`
  position: absolute;
  width: 1000px;
  height: 1000px;
  left: -500px;
  top: -500px;
  z-index: 99999;
`

const ShowHistoryIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(44)};
      height: ${vm(44)};
      border-radius: 50%;
      background-color: ${({ theme }) => theme.bgL2};
      .icon-chat-history,
      .icon-chat-back {
        font-size: 0.24rem;
        color: ${({ theme }) => theme.textL1};
      }
    `}
`
const NewThreadButton = styled(ShowHistoryIcon)`
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(44)};
      height: ${vm(44)};
      border-radius: 50%;
      background-color: ${({ theme }) => theme.bgL2};
      .icon-chat-new,
      .icon-chat-rubbish {
        font-size: 0.24rem;
        color: ${({ theme }) => theme.textL1};
      }
    `}
`

export default function Header({
  isShowThreadList,
  setIsShowThreadList,
}: {
  isShowThreadList: boolean
  setIsShowThreadList: Dispatch<SetStateAction<boolean>>
}) {
  const [isAiLoading] = useIsLoadingData()
  const addNewThread = useAddNewThread()
  const [isRenderingData] = useIsRenderingData()
  const [threadsList] = useThreadsList()
  const [isOpenDeleteThread, setIsOpenDeleteThread] = useOpenDeleteThread()
  const showHistory = useCallback(() => {
    if (isAiLoading || isRenderingData) return
    setIsShowThreadList(true)
  }, [isAiLoading, isRenderingData, setIsShowThreadList])
  const exitHistory = useCallback(() => {
    setIsShowThreadList(false)
  }, [setIsShowThreadList])
  const openDelete = useCallback(() => {
    if (isAiLoading || isRenderingData || threadsList.length === 0) return
    setIsOpenDeleteThread(!isOpenDeleteThread)
  }, [isAiLoading, isRenderingData, isOpenDeleteThread, setIsOpenDeleteThread, threadsList])
  return (
    <HeaderWrapper>
      <TopOperator>
        <ShowHistoryIcon onClick={isShowThreadList ? exitHistory : showHistory}>
          <IconBase className={isShowThreadList ? 'icon-chat-back' : 'icon-chat-history'} />
        </ShowHistoryIcon>
        <span>{isShowThreadList ? <Trans>All Chat</Trans> : <Trans>Chat</Trans>}</span>
        <NewThreadButton onClick={isShowThreadList ? openDelete : addNewThread}>
          {isShowThreadList ? <IconBase className='icon-chat-rubbish' /> : <IconBase className='icon-chat-new' />}
        </NewThreadButton>
      </TopOperator>
    </HeaderWrapper>
  )
}

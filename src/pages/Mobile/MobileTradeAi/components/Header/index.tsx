import { IconBase } from 'components/Icons'
import { TopOperator, HeaderWrapper, ShowHistoryIcon, NewThreadButton } from '../TradeAi/styles'
import { Trans } from '@lingui/react/macro'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { useAddNewThread, useIsLoadingData, useIsRenderingData, useOpenDeleteThread, useThreadsList } from 'store/tradeai/hooks'

export default function Header({
  isShowThreadList,
  setIsShowThreadList
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
  return <HeaderWrapper>
    <TopOperator>
      <ShowHistoryIcon onClick={isShowThreadList ? exitHistory : showHistory}>
        <IconBase className={isShowThreadList ? 'icon-chat-back' : 'icon-chat-history'} />
      </ShowHistoryIcon>
      <span>
        {
          isShowThreadList
            ? <Trans>All Chat</Trans>
            : <Trans>Chat</Trans>
        }
      </span>
      <NewThreadButton onClick={isShowThreadList ? openDelete : addNewThread}>
        {
          isShowThreadList
            ? <IconBase className="icon-chat-rubbish" />
            : <IconBase className="icon-chat-new" />
        }
      </NewThreadButton>
    </TopOperator>
  </HeaderWrapper>
}

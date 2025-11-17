import { useDispatch, useSelector } from 'react-redux'
import { useLazyGetLiveChatQuery } from 'api/insight'
import { useCallback } from 'react'
import {
  updateLiveChatList,
  updateLiveChatSubData,
  updateIsExpandedLiveChat,
  updateCurrentLiveChatData,
} from 'store/insights/reducer'
import { RootState } from 'store'
import { LiveChatDataType } from 'store/insights/insights.d'

export function useGetLiveChat() {
  const [, setLiveChatList] = useLiveChatList()
  const [triggerGetLiveChat] = useLazyGetLiveChatQuery()

  return useCallback(async () => {
    try {
      const response = await triggerGetLiveChat()

      if (response.isSuccess) {
        const list = [...response.data.data.contexts]
        list.sort((a: LiveChatDataType, b: LiveChatDataType) => a.created_at - b.created_at)
        setLiveChatList(list)
      }

      return response
    } catch (error) {
      console.error('Failed to get live chat:', error)
      return error
    }
  }, [setLiveChatList, triggerGetLiveChat])
}

export function useLiveChatList(): [LiveChatDataType[], (param: LiveChatDataType[]) => void] {
  const dispatch = useDispatch()
  const liveChatList = useSelector((state: RootState) => state.insights.liveChatList)
  const changeLiveChatList = useCallback(
    (list: LiveChatDataType[]) => {
      dispatch(updateLiveChatList(list))
    },
    [dispatch],
  )
  return [liveChatList, changeLiveChatList]
}

export function useUpdateLiveChatSubData(): (data: LiveChatDataType) => void {
  const dispatch = useDispatch()
  const setLiveChatList = useCallback(
    (data: LiveChatDataType) => {
      dispatch(updateLiveChatSubData(data))
    },
    [dispatch],
  )
  return setLiveChatList
}

export function useIsExpandedLiveChat(): [boolean, (param: boolean) => void] {
  const dispatch = useDispatch()
  const isExpandedLiveChat = useSelector((state: RootState) => state.insights.isExpandedLiveChat)
  const changeIsExpandedLiveChat = useCallback(
    (isExpanded: boolean) => {
      dispatch(updateIsExpandedLiveChat(isExpanded))
    },
    [dispatch],
  )
  return [isExpandedLiveChat, changeIsExpandedLiveChat]
}

export function useCurrentLiveChatData(): [LiveChatDataType | null, (param: LiveChatDataType | null) => void] {
  const dispatch = useDispatch()
  const currentLiveChatData = useSelector((state: RootState) => state.insights.currentLiveChatData)
  const changeCurrentLiveChatData = useCallback(
    (data: LiveChatDataType | null) => {
      dispatch(updateCurrentLiveChatData(data))
    },
    [dispatch],
  )
  return [currentLiveChatData, changeCurrentLiveChatData]
}

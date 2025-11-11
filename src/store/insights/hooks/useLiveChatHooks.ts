import { useDispatch, useSelector } from 'react-redux'
import { useLazyGetLiveChatQuery } from 'api/insight'
import { useCallback } from 'react'
import { updateLiveChatList } from 'store/insights/reducer'
import { RootState } from 'store'
import { LiveChatDataType } from 'store/insights/insights.d'

export function useGetLiveChat() {
  const [, setLiveChatList] = useLiveChatList()
  const [triggerGetLiveChat] = useLazyGetLiveChatQuery()

  return useCallback(async () => {
    try {
      const response = await triggerGetLiveChat()

      if (response.isSuccess) {
        const list = response.data.data.list
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

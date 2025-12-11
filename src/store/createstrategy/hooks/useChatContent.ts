import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { changeChatResponseContentList } from '../reducer'
import { ChatResponseContentDataType } from '../createstrategy'
import { ParamFun } from 'types/global'

export function useChatResponseContentList(): [ChatResponseContentDataType[], ParamFun<ChatResponseContentDataType[]>] {
  const dispatch = useDispatch()
  const chatResponseContentList = useSelector((state: RootState) => state.createstrategy.chatResponseContentList)
  const setChatResponseContentList = useCallback(
    (list: ChatResponseContentDataType[]) => {
      dispatch(changeChatResponseContentList({ chatResponseContentList: list }))
    },
    [dispatch],
  )
  return [chatResponseContentList, setChatResponseContentList]
}

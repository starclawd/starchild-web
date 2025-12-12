import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { changeChatResponseContentList, changeChatValue, resetTempChatContentData } from '../reducer'
import { ChatResponseContentDataType } from '../createstrategy'
import { ParamFun } from 'types/global'
import { useLazyGetStrategyChatContentQuery } from 'api/createStrategy'
import { ROLE_TYPE } from 'store/chat/chat'

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

export function useGetStrategyChatContents() {
  const dispatch = useDispatch()
  const [, setChatResponseContentList] = useChatResponseContentList()
  const [triggerGetStrategyChatContent] = useLazyGetStrategyChatContentQuery()
  return useCallback(
    async (strategyId: string) => {
      try {
        const data = await triggerGetStrategyChatContent({ strategyId })
        const chatContents = [...(data as any).data.data.messages].sort((a: any, b: any) => a.createdAt - b.createdAt)
        const list: ChatResponseContentDataType[] = []
        chatContents.forEach((data: any) => {
          const { created_at, msg_id, agent_response, user_query } = data
          list.push(
            {
              id: msg_id,
              content: user_query,
              thoughtContentList: [],
              sourceListDetails: [],
              role: ROLE_TYPE.USER,
              timestamp: created_at,
            },
            {
              id: msg_id,
              content: agent_response,
              thoughtContentList: [],
              sourceListDetails: [],
              role: ROLE_TYPE.ASSISTANT,
              timestamp: created_at,
            },
          )
        })
        dispatch(resetTempChatContentData())
        setChatResponseContentList(list)
        return data
      } catch (error) {
        return error
      }
    },
    [dispatch, setChatResponseContentList, triggerGetStrategyChatContent],
  )
}

export function useChatValue(): [string, ParamFun<string>] {
  const dispatch = useDispatch()
  const chatValue = useSelector((state: RootState) => state.createstrategy.chatValue)
  const setChatValue = useCallback(
    (value: string) => {
      dispatch(changeChatValue({ chatValue: value }))
    },
    [dispatch],
  )
  return [chatValue, setChatValue]
}

export function useTempChatContentData() {
  const tempChatContentData = useSelector((state: RootState) => state.createstrategy.tempChatContentData)
  return tempChatContentData
}

export function useResetTempChatContentData() {
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(resetTempChatContentData())
  }, [dispatch])
}

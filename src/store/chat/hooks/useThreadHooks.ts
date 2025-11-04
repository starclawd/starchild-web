import { useCallback } from 'react'
import { RootState } from 'store'
import { useDispatch, useSelector, useStore } from 'react-redux'
import {
  changeHasLoadThreadsList,
  changeIsOpenDeleteThread,
  changeSelectThreadIds,
  changeThreadsList,
} from '../reducer'
import { ParamFun } from 'types/global'
import { useCurrentAiThreadId } from 'store/chatcache/hooks'
import { useLazyDeleteThreadQuery, useLazyGetAiBotChatThreadsQuery } from 'api/chat'
import { useUserInfo } from 'store/login/hooks'
import { useCloseStream, useIsLoadingData } from './useStreamHooks'
import { useResetTempAiContentData } from './useContentHooks'
import { useIsRenderingData } from './useUiStateHooks'
import { useAiResponseContentList } from './useContentHooks'

// useThreadsList moved to useStreamHooks.ts to avoid circular dependency

export function useGetThreadsList() {
  const dispatch = useDispatch()
  const setThreadsList = useCallback(
    (list: any[]) => {
      dispatch(changeThreadsList({ threadsList: list }))
    },
    [dispatch],
  )
  const { getState } = useStore()
  const [, setHasLoadThreadsList] = useHasLoadThreadsList()
  const [, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [triggerGetAiBotChatThreads] = useLazyGetAiBotChatThreadsQuery()
  return useCallback(async () => {
    try {
      const currentAiThreadId = (getState() as RootState).chatcache.currentAiThreadId
      const data = await triggerGetAiBotChatThreads({})
      const list = (data.data as any).map((data: any) => ({
        threadId: data.thread_id,
        title: data.title,
        createdAt: data.created_at,
      }))
      if (currentAiThreadId && !list.some((data: any) => data.threadId === currentAiThreadId)) {
        setCurrentAiThreadId('')
      }
      setThreadsList(list)
      setHasLoadThreadsList(true)
      return data
    } catch (error) {
      return error
    }
  }, [getState, setHasLoadThreadsList, setCurrentAiThreadId, setThreadsList, triggerGetAiBotChatThreads])
}

export function useDeleteThread() {
  const [currentAiThreadId, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [triggerDeleteThread] = useLazyDeleteThreadQuery()
  return useCallback(
    async (threadIds: string[]) => {
      try {
        const data = await triggerDeleteThread({
          threadIds,
        })
        if (currentAiThreadId && threadIds.includes(currentAiThreadId)) {
          setCurrentAiThreadId('')
        }
        return data
      } catch (error) {
        return error
      }
    },
    [currentAiThreadId, setCurrentAiThreadId, triggerDeleteThread],
  )
}

export function useOpenDeleteThread(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isOpenDeleteThread = useSelector((state: RootState) => state.chat.isOpenDeleteThread)
  const setIsOpenDeleteThread = useCallback(
    (value: boolean) => {
      dispatch(changeIsOpenDeleteThread({ isOpenDeleteThread: value }))
    },
    [dispatch],
  )
  return [isOpenDeleteThread, setIsOpenDeleteThread]
}

export function useSelectThreadIds(): [string[], ParamFun<string[]>] {
  const dispatch = useDispatch()
  const selectThreadIds = useSelector((state: RootState) => state.chat.selectThreadIds)
  const setSelectThreadIds = useCallback(
    (value: string[]) => {
      dispatch(changeSelectThreadIds({ selectThreadIds: value }))
    },
    [dispatch],
  )
  return [selectThreadIds, setSelectThreadIds]
}

export function useHasLoadThreadsList(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const hasLoadThreadsList = useSelector((state: RootState) => state.chat.hasLoadThreadsList)
  const setHasLoadThreadsList = useCallback(
    (value: boolean) => {
      dispatch(changeHasLoadThreadsList({ hasLoadThreadsList: value }))
    },
    [dispatch],
  )
  return [hasLoadThreadsList, setHasLoadThreadsList]
}

export function useAddNewThread() {
  const [isLoadingData] = useIsLoadingData()
  const closeStream = useCloseStream()
  const resetTempAiContentData = useResetTempAiContentData()
  const [isRenderingData, setIsRenderingData] = useIsRenderingData()
  const [, setAiResponseContentList] = useAiResponseContentList()
  const [, setCurrentAiThreadId] = useCurrentAiThreadId()
  return useCallback(() => {
    if (isLoadingData || isRenderingData) return
    closeStream()
    setIsRenderingData(false)
    setCurrentAiThreadId('')
    setAiResponseContentList([])
    resetTempAiContentData()
  }, [
    isLoadingData,
    isRenderingData,
    resetTempAiContentData,
    setCurrentAiThreadId,
    setAiResponseContentList,
    closeStream,
    setIsRenderingData,
  ])
}

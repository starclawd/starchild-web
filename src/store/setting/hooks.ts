import { useLazyAddWatchlistQuery, useLazyDeleteWatchlistQuery, useLazyGetTaskListQuery, useLazyGetWatchlistQuery } from "api/setting"
import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { ParamFun } from "types/global"
import { updateIsFromTaskPage, updateTaskList } from "./reducer"
import { TaskDataType } from "./setting"

export function useGetWatchlist() {
  const [triggerGetWatchlist] = useLazyGetWatchlistQuery()
  return useCallback(async () => {
    try {
      const data = await triggerGetWatchlist(1)
      console.log('data', data)
      return data
    } catch (error) {
      return error
    }
  }, [triggerGetWatchlist])
}

export function useAddWatchlist() {
  const [triggerAddWatchlist] = useLazyAddWatchlistQuery()
  return useCallback(async (symbol: string) => {
    try {
      const data = await triggerAddWatchlist({ symbol })
      console.log('data', data)
      return data
    } catch (error) {
      return error
    }
  }, [triggerAddWatchlist])
}

export function useDeleteWatchlist() {
  const [triggerDeleteWatchlist] = useLazyDeleteWatchlistQuery()
  return useCallback(async (symbol: string) => {
    try {
      const data = await triggerDeleteWatchlist({ symbol })
      console.log('data', data)
      return data
    } catch (error) {
      return error
    }
  }, [triggerDeleteWatchlist])
}

export function useGetTaskList() {
  const [triggerGetTaskList] = useLazyGetTaskListQuery()
  return useCallback(async () => {
    try {
      const data = await triggerGetTaskList(1)
      console.log('data', data)
      return data
    } catch (error) {
      return error
    }
  }, [triggerGetTaskList])
}

export function useIsFromTaskPage(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isFromTaskPage = useSelector((state: RootState) => state.setting.isFromTaskPage)
  const setIsFromTaskPage = useCallback((value: boolean) => {
    dispatch(updateIsFromTaskPage(value))
  }, [dispatch])
  return [isFromTaskPage, setIsFromTaskPage]
}

export function useTaskList(): [TaskDataType[], ParamFun<TaskDataType[]>] {
  const dispatch = useDispatch()
  const taskList = useSelector((state: RootState) => state.setting.taskList)
  const setTaskList = useCallback((value: TaskDataType[]) => {
    dispatch(updateTaskList(value))
  }, [dispatch])
  return [taskList, setTaskList]
}
import { useLazyAddWatchlistQuery, useLazyCloseTaskQuery, useLazyDeleteTaskQuery, useLazyDeleteWatchlistQuery, useLazyGetTaskListQuery, useLazyGetWatchlistQuery } from "api/setting"
import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { ParamFun } from "types/global"
import { updateCurrentTaskData, updateIsFromTaskPage, updateTaskList } from "./reducer"
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

export function useCloseTask() {
  const [triggerCloseTask] = useLazyCloseTaskQuery()
  return useCallback(async (id: string) => {
    try {
      const data = await triggerCloseTask({ id })
      console.log('data', data)
      return data
    } catch (error) {
      return error
    }
  }, [triggerCloseTask])
}

export function useDeleteTask() {
  const [triggerDeleteTask] = useLazyDeleteTaskQuery()
  return useCallback(async (id: string) => {
    try {
      const data = await triggerDeleteTask({ id })
      console.log('data', data)
      return data
    } catch (error) {
      return error
    }
  }, [triggerDeleteTask])
}

export function useIsFromTaskPage(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isFromTaskPage = useSelector((state: RootState) => state.setting.isFromTaskPage)
  const setIsFromTaskPage = useCallback((value: boolean) => {
    dispatch(updateIsFromTaskPage(value))
  }, [dispatch])
  return [isFromTaskPage, setIsFromTaskPage]
}

// [
//   {
//     id: '1',
//     isActive: true,
//     title: 'Task 1',
//     description: 'Description 1',
//     time: '10:00'
//   }
// ]
export function useTaskList(): [TaskDataType[], ParamFun<TaskDataType[]>] {
  const dispatch = useDispatch()
  const taskList = useSelector((state: RootState) => state.setting.taskList)
  const setTaskList = useCallback((value: TaskDataType[]) => {
    dispatch(updateTaskList(value))
  }, [dispatch])
  return [[
    {
      id: '1',
      isActive: true,
      title: 'Task 1',
      description: 'Description 1',
      time: '10:00'
    }
  ], setTaskList]
}

export function useCurrentTaskData(): [TaskDataType | null, ParamFun<TaskDataType | null>] {
  const dispatch = useDispatch()
  const currentTaskData = useSelector((state: RootState) => state.setting.currentTaskData)
  const setCurrentTaskData = useCallback((value: TaskDataType | null) => {
    dispatch(updateCurrentTaskData(value))
  }, [dispatch])
  return [currentTaskData, setCurrentTaskData]
}
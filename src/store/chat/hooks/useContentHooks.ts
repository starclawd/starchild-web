import { useCallback } from 'react'
import { RootState } from 'store'
import { useDispatch, useSelector } from 'react-redux'
import {
  changeAnalyzeContentList,
  changeCurrentAiContentDeepThinkData,
  changeFileList,
  resetTempAiContentData,
  changeThreadsList,
  changeAiResponseContentList,
  changeInputValue,
} from '../reducer'
import { AnalyzeContentDataType, TempAiContentDataType } from '../chat'
import { ParamFun } from 'types/global'
import { useUserInfo } from 'store/login/hooks'

export function useAiChatKey(): string {
  const [userInfo] = useUserInfo()
  const { aiChatKey } = userInfo
  return aiChatKey
}

// useAiResponseContentList moved to useStreamHooks.ts to avoid circular dependency

export function useTempAiContentData() {
  const tempAiContentData = useSelector((state: RootState) => state.chat.tempAiContentData)
  return tempAiContentData
}

export function useFileList(): [File[], ParamFun<File[]>] {
  const dispatch = useDispatch()
  const fileList = useSelector((state: RootState) => state.chat.fileList)
  const setFileList = useCallback(
    (list: File[]) => {
      dispatch(changeFileList({ fileList: list }))
    },
    [dispatch],
  )
  return [fileList, setFileList]
}

// useInputValue moved to useStreamHooks.ts to avoid circular dependency

export function useAnalyzeContentList(): [AnalyzeContentDataType[], ParamFun<AnalyzeContentDataType[]>] {
  const dispatch = useDispatch()
  const analyzeContentList = useSelector((state: RootState) => state.chat.analyzeContentList)
  const setAnalyzeContentList = useCallback(
    (list: AnalyzeContentDataType[]) => {
      dispatch(changeAnalyzeContentList({ analyzeContentList: list }))
    },
    [dispatch],
  )
  return [analyzeContentList, setAnalyzeContentList]
}

export function useCurrentAiContentDeepThinkData(): [TempAiContentDataType, ParamFun<TempAiContentDataType>] {
  const dispatch = useDispatch()
  const currentAiContentDeepThinkData = useSelector((state: RootState) => state.chat.currentAiContentDeepThinkData)
  const setCurrentAiContentDeepThinkData = useCallback(
    (value: TempAiContentDataType) => {
      dispatch(changeCurrentAiContentDeepThinkData({ currentAiContentDeepThinkData: value }))
    },
    [dispatch],
  )
  return [currentAiContentDeepThinkData, setCurrentAiContentDeepThinkData]
}

export function useResetTempAiContentData() {
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(resetTempAiContentData())
  }, [dispatch])
}

export function useThreadsList(): [any[], ParamFun<any[]>] {
  const dispatch = useDispatch()
  const threadsList = useSelector((state: RootState) => state.chat.threadsList)
  const setThreadsList = useCallback(
    (list: any[]) => {
      dispatch(changeThreadsList({ threadsList: list }))
    },
    [dispatch],
  )
  return [threadsList, setThreadsList]
}

export function useAiResponseContentList(): [TempAiContentDataType[], ParamFun<TempAiContentDataType[]>] {
  const dispatch = useDispatch()
  const aiResponseContentList = useSelector((state: RootState) => state.chat.aiResponseContentList)
  const setAiResponseContentList = useCallback(
    (list: TempAiContentDataType[]) => {
      dispatch(changeAiResponseContentList({ aiResponseContentList: list }))
    },
    [dispatch],
  )
  return [aiResponseContentList, setAiResponseContentList]
}

export function useInputValue(): [string, ParamFun<string>] {
  const dispatch = useDispatch()
  const inputValue = useSelector((state: RootState) => state.chat.inputValue)
  const setInputValue = useCallback(
    (value: string) => {
      dispatch(changeInputValue({ inputValue: value }))
    },
    [dispatch],
  )
  return [inputValue, setInputValue]
}

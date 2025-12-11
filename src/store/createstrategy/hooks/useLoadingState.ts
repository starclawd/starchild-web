import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { useCallback } from 'react'
import { changeIsAnalyzeContent, changeIsLoadingChatStream, changeIsRenderingData } from '../reducer'
import { ParamFun } from 'types/global'

export function useIsRenderingData(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isRenderingData = useSelector((state: RootState) => state.createstrategy.isRenderingData)
  const setIsRenderingData = useCallback(
    (value: boolean) => {
      dispatch(changeIsRenderingData({ isRenderingData: value }))
    },
    [dispatch],
  )
  return [isRenderingData, setIsRenderingData]
}

export function useIsAnalyzeContent(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isAnalyzeContent = useSelector((state: RootState) => state.createstrategy.isAnalyzeContent)
  const setIsAnalyzeContent = useCallback(
    (value: boolean) => {
      dispatch(changeIsAnalyzeContent({ isAnalyzeContent: value }))
    },
    [dispatch],
  )
  return [isAnalyzeContent, setIsAnalyzeContent]
}

export function useIsLoadingChatStream(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isLoadingChatStream = useSelector((state: RootState) => state.createstrategy.isLoadingChatStream)
  const setIsLoadingChatStream = useCallback(
    (value: boolean) => {
      dispatch(changeIsLoadingChatStream({ isLoadingChatStream: value }))
    },
    [dispatch],
  )
  return [isLoadingChatStream, setIsLoadingChatStream]
}

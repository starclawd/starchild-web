import { useCallback, useMemo } from 'react'
import { RootState } from 'store'
import { useDispatch, useSelector } from 'react-redux'
import {
  changeCurrentRenderingId,
  changeIsAnalyzeContent,
  changeIsFocus,
  changeIsLoadingAiContent,
  changeIsLoadingData,
  changeIsOpenAuxiliaryArea,
  changeIsRenderingData,
  changeIsShowDeepThink,
  changeIsShowInsightChatContent,
  changeIsChatPageLoaded,
  changeIsShowTaskDetails,
  changeIsOpenFullScreen,
  changeCurrentFullScreenBacktestData,
  changeChatRecommendationList,
  changeIsShowDeepThinkSources,
} from '../reducer'
import { ParamFun } from 'types/global'
import { BacktestDataType } from 'store/agentdetail/agentdetail'
import { ChatRecommendationDataType } from '../chat'
// Import these from their actual locations to avoid circular deps

export function useIsFocus(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isFocus = useSelector((state: RootState) => state.chat.isFocus)
  const setIsFocus = useCallback(
    (bool: boolean) => {
      dispatch(changeIsFocus({ isFocus: bool }))
    },
    [dispatch],
  )
  return [isFocus, setIsFocus]
}

export function useIsRenderingData(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isRenderingData = useSelector((state: RootState) => state.chat.isRenderingData)
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
  const isAnalyzeContent = useSelector((state: RootState) => state.chat.isAnalyzeContent)
  const setIsAnalyzeContent = useCallback(
    (value: boolean) => {
      dispatch(changeIsAnalyzeContent({ isAnalyzeContent: value }))
    },
    [dispatch],
  )
  return [isAnalyzeContent, setIsAnalyzeContent]
}

// useIsLoadingData moved to useStreamHooks.ts to avoid circular dependency

// useIsRenderingData moved to useStreamHooks.ts to avoid circular dependency

// useCurrentRenderingId moved to useStreamHooks.ts to avoid circular dependency

export function useIsOpenAuxiliaryArea(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isOpenAuxiliaryArea = useSelector((state: RootState) => state.chat.isOpenAuxiliaryArea)
  const setIsOpenAuxiliaryArea = useCallback(
    (isOpenAuxiliaryArea: boolean) => {
      dispatch(changeIsOpenAuxiliaryArea({ isOpenAuxiliaryArea }))
    },
    [dispatch],
  )
  return [isOpenAuxiliaryArea, setIsOpenAuxiliaryArea]
}

export function useIsLoadingAiContent(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isLoadingAiContent = useSelector((state: RootState) => state.chat.isLoadingAiContent)
  const setIsLoadingAiContent = useCallback(
    (value: boolean) => {
      dispatch(changeIsLoadingAiContent({ isLoadingAiContent: value }))
    },
    [dispatch],
  )
  return [isLoadingAiContent, setIsLoadingAiContent]
}

export function useIsShowInsightChatContent(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isShowInsightChatContent = useSelector((state: RootState) => state.chat.isShowInsightChatContent)
  const setIsShowInsightChatContent = useCallback(
    (value: boolean) => {
      dispatch(changeIsShowInsightChatContent({ isShowInsightChatContent: value }))
    },
    [dispatch],
  )
  return [isShowInsightChatContent, setIsShowInsightChatContent]
}

// useIsAnalyzeContent moved to useStreamHooks.ts to avoid circular dependency

export function useIsShowDeepThink(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isShowDeepThink = useSelector((state: RootState) => state.chat.isShowDeepThink)
  const setIsShowDeepThink = useCallback(
    (value: boolean) => {
      dispatch(changeIsShowDeepThink({ isShowDeepThink: value }))
    },
    [dispatch],
  )
  return [isShowDeepThink, setIsShowDeepThink]
}

export function useIsShowAgentDetail(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isShowAgentDetail = useSelector((state: RootState) => state.chat.isShowAgentDetail)
  const setIsShowAgentDetail = useCallback(
    (value: boolean) => {
      dispatch(changeIsShowTaskDetails({ isShowAgentDetail: value }))
    },
    [dispatch],
  )
  return [isShowAgentDetail, setIsShowAgentDetail]
}

export function useIsChatPageLoaded(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isChatPageLoaded = useSelector((state: RootState) => state.chat.isChatPageLoaded)
  const setIsChatPageLoaded = useCallback(
    (value: boolean) => {
      dispatch(changeIsChatPageLoaded({ isChatPageLoaded: value }))
    },
    [dispatch],
  )
  return [isChatPageLoaded, setIsChatPageLoaded]
}

export function useIsOpenFullScreen(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isOpenFullScreen = useSelector((state: RootState) => state.chat.isOpenFullScreen)
  const setIsOpenFullScreen = useCallback(
    (value: boolean) => {
      dispatch(changeIsOpenFullScreen({ isOpenFullScreen: value }))
    },
    [dispatch],
  )
  return [isOpenFullScreen, setIsOpenFullScreen]
}

export function useCurrentFullScreenBacktestData(): [BacktestDataType | null, ParamFun<BacktestDataType | null>] {
  const dispatch = useDispatch()
  const currentFullScreenBacktestData = useSelector((state: RootState) => state.chat.currentFullScreenBacktestData)
  const setCurrentFullScreenBacktestData = useCallback(
    (value: BacktestDataType | null) => {
      dispatch(changeCurrentFullScreenBacktestData({ currentFullScreenBacktestData: value }))
    },
    [dispatch],
  )
  return [currentFullScreenBacktestData, setCurrentFullScreenBacktestData]
}

export function useIsShowDefaultUi(): boolean {
  const threadList = useSelector((state: RootState) => state.chat.threadsList)
  const aiResponseContentList = useSelector((state: RootState) => state.chat.aiResponseContentList)
  const tempAiContentData = useSelector((state: RootState) => state.chat.tempAiContentData)
  const isRenderingData = useSelector((state: RootState) => state.chat.isRenderingData)
  const isLoading = useSelector((state: RootState) => state.chat.isLoadingData)
  return useMemo(() => {
    return (
      aiResponseContentList.length === 0 &&
      !tempAiContentData.id &&
      threadList.length === 0 &&
      !(isLoading && !isRenderingData)
    )
  }, [aiResponseContentList.length, tempAiContentData.id, threadList.length, isLoading, isRenderingData])
}

export function useChatRecommendationList(): [ChatRecommendationDataType[], ParamFun<ChatRecommendationDataType[]>] {
  const dispatch = useDispatch()
  const chatRecommendationList = useSelector((state: RootState) => state.chat.chatRecommendationList)
  const setChatRecommendationList = useCallback(
    (value: ChatRecommendationDataType[]) => {
      dispatch(changeChatRecommendationList({ chatRecommendationList: value }))
    },
    [dispatch],
  )
  return [chatRecommendationList, setChatRecommendationList]
}

export function useIsShowDeepThinkSources(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isShowDeepThinkSources = useSelector((state: RootState) => state.chat.isShowDeepThinkSources)
  const setIsShowDeepThinkSources = useCallback(
    (value: boolean) => {
      dispatch(changeIsShowDeepThinkSources({ isShowDeepThinkSources: value }))
    },
    [dispatch],
  )
  return [isShowDeepThinkSources, setIsShowDeepThinkSources]
}

import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { TabKey } from 'constants/useCases'
import { AiSteamDataType, ROLE_TYPE, STREAM_DATA_TYPE, TempAiContentDataType } from 'store/chat/chat'

export interface UseCasesState {
  activeTab: TabKey
  readonly isLoadingData: boolean
  readonly isRenderingData: boolean
  readonly isAnalyzeContent: boolean
  readonly inputValue: string
  readonly isShowDeepThink: boolean
  readonly isShowAgentDetail: boolean
  readonly isShowDeepThinkSources: boolean
  readonly isCarouselPaused: boolean
  readonly isPlaying: boolean
  readonly currentAiContentDeepThinkData: TempAiContentDataType
  readonly aiResponseContentList: TempAiContentDataType[]
  readonly tempAiContentData: TempAiContentDataType
}

const initialState: UseCasesState = {
  activeTab: 'ta' as TabKey,
  isLoadingData: false,
  isRenderingData: false,
  isAnalyzeContent: false,
  aiResponseContentList: [],
  inputValue: '',
  isShowDeepThink: false,
  isShowAgentDetail: false,
  isShowDeepThinkSources: false,
  isCarouselPaused: false,
  isPlaying: false,
  tempAiContentData: {
    id: '',
    feedback: null,
    role: ROLE_TYPE.ASSISTANT,
    thoughtContentList: [],
    sourceListDetails: [],
    content: '',
    timestamp: 0,
    agentRecommendationList: [],
  },
  currentAiContentDeepThinkData: {
    id: '',
    feedback: null,
    role: ROLE_TYPE.ASSISTANT,
    thoughtContentList: [],
    sourceListDetails: [],
    content: '',
    timestamp: 0,
    agentRecommendationList: [],
  },
}

const useCasesSlice = createSlice({
  name: 'usecases',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<TabKey>) => {
      state.activeTab = action.payload
    },
    getAiSteamData: (state, action: PayloadAction<{ aiSteamData: AiSteamDataType }>) => {
      const tempAiContentData = state.tempAiContentData
      const { id, type, content, klineCharts, agentId, triggerHistory } = action.payload.aiSteamData
      if (type === STREAM_DATA_TYPE.ERROR) {
        state.tempAiContentData = {
          id,
          thoughtContentList: [],
          sourceListDetails: [],
          content: tempAiContentData.content + content,
          feedback: null,
          role: ROLE_TYPE.ASSISTANT,
          timestamp: new Date().getTime(),
          agentRecommendationList: [],
        }
      } else {
        if (tempAiContentData.id !== id) {
          if (type === STREAM_DATA_TYPE.TEMP) {
            const data = JSON.parse(content)
            state.tempAiContentData = {
              id,
              feedback: null,
              thoughtContentList: tempAiContentData.thoughtContentList.concat({
                id: data.id,
                tool_name: data.tool_name,
                tool_type: data.tool_type,
                tool_description: data.description,
              }),
              sourceListDetails: tempAiContentData.sourceListDetails,
              content: tempAiContentData.content ? tempAiContentData.content : '',
              role: ROLE_TYPE.ASSISTANT,
              timestamp: new Date().getTime(),
              agentRecommendationList: [],
            }
          } else if (type === STREAM_DATA_TYPE.SOURCE_LIST_DETAILS) {
            const list = JSON.parse(content)
            state.tempAiContentData = {
              id,
              feedback: null,
              thoughtContentList: tempAiContentData.thoughtContentList,
              sourceListDetails: list,
              content: tempAiContentData.content,
              role: ROLE_TYPE.ASSISTANT,
              timestamp: new Date().getTime(),
              agentRecommendationList: [],
            }
          } else if (type === STREAM_DATA_TYPE.FINAL_ANSWER) {
            state.tempAiContentData = {
              id,
              feedback: null,
              thoughtContentList: tempAiContentData.thoughtContentList,
              sourceListDetails: tempAiContentData.sourceListDetails,
              content,
              role: ROLE_TYPE.ASSISTANT,
              timestamp: new Date().getTime(),
              agentRecommendationList: [],
            }
          }
        } else {
          if (type === STREAM_DATA_TYPE.TEMP) {
            const data = JSON.parse(content)
            const { tool_name, tool_type, description, id } = data
            const isExist = tempAiContentData.thoughtContentList.some((item) => item.id === id)

            let newThoughtContentList = [...tempAiContentData.thoughtContentList]

            if (isExist) {
              // 如果已存在，找到对应项并更新description
              newThoughtContentList = newThoughtContentList.map((item) => {
                if (item.id === id) {
                  return {
                    ...item,
                    tool_description: item.tool_description + description,
                  }
                }
                return item
              })
            } else {
              // 如果不存在，添加新项
              newThoughtContentList.push({
                id,
                tool_name,
                tool_type,
                tool_description: description,
              })
            }
            state.tempAiContentData.thoughtContentList = newThoughtContentList
          } else if (type === STREAM_DATA_TYPE.SOURCE_LIST_DETAILS) {
            const list = JSON.parse(content)
            const newSourceListDetails = tempAiContentData.sourceListDetails.concat(list)
            state.tempAiContentData.sourceListDetails = newSourceListDetails
          } else if (type === STREAM_DATA_TYPE.TRIGGER_HISTORY) {
            const data = JSON.parse(content)
            const { id, message, error, trigger_time } = data
            const currentHistory = tempAiContentData.triggerHistory || []
            const isExist = currentHistory.some((item) => item.id === id)

            let newTriggerHistory = [...currentHistory]

            if (isExist) {
              // 如果已存在，找到对应项并更新 message
              newTriggerHistory = newTriggerHistory.map((item) => {
                if (item.id === id) {
                  return {
                    ...item,
                    message: item.message + message,
                  }
                }
                return item
              })
            } else {
              // 如果不存在，添加新项
              newTriggerHistory.push({
                id,
                message,
                error,
                trigger_time,
              })
            }
            state.tempAiContentData.triggerHistory = newTriggerHistory
          } else if (type === STREAM_DATA_TYPE.FINAL_ANSWER) {
            const newContent = tempAiContentData.content + content
            state.tempAiContentData.content = newContent
            if (klineCharts) {
              state.tempAiContentData.klineCharts = klineCharts
            }
            if (agentId) {
              state.tempAiContentData.agentId = agentId
            }
            if (triggerHistory) {
              state.tempAiContentData.triggerHistory = triggerHistory
            }
          }
        }
      }
    },
    changeIsLoadingData: (state, action: PayloadAction<{ isLoadingData: boolean }>) => {
      state.isLoadingData = action.payload.isLoadingData
    },
    changeIsRenderingData: (state, action: PayloadAction<{ isRenderingData: boolean }>) => {
      state.isRenderingData = action.payload.isRenderingData
    },
    changeIsAnalyzeContent: (state, action: PayloadAction<{ isAnalyzeContent: boolean }>) => {
      state.isAnalyzeContent = action.payload.isAnalyzeContent
    },
    changeAiResponseContentList: (state, action: PayloadAction<{ aiResponseContentList: TempAiContentDataType[] }>) => {
      state.aiResponseContentList = action.payload.aiResponseContentList
    },
    changeInputValue: (state, action: PayloadAction<{ inputValue: string }>) => {
      state.inputValue = action.payload.inputValue
    },
    changeIsShowDeepThink: (state, action: PayloadAction<{ isShowDeepThink: boolean }>) => {
      state.isShowDeepThink = action.payload.isShowDeepThink
    },
    changeIsShowAgentDetail: (state, action: PayloadAction<{ isShowAgentDetail: boolean }>) => {
      state.isShowAgentDetail = action.payload.isShowAgentDetail
    },
    changeIsShowDeepThinkSources: (state, action: PayloadAction<{ isShowDeepThinkSources: boolean }>) => {
      state.isShowDeepThinkSources = action.payload.isShowDeepThinkSources
    },
    changeIsPlaying: (state, action: PayloadAction<{ isPlaying: boolean }>) => {
      state.isPlaying = action.payload.isPlaying
    },
    resetTempAiContentData: (state) => {
      state.tempAiContentData = initialState.tempAiContentData
    },
    changeCurrentAiContentDeepThinkData: (
      state,
      action: PayloadAction<{ currentAiContentDeepThinkData: TempAiContentDataType }>,
    ) => {
      state.currentAiContentDeepThinkData = action.payload.currentAiContentDeepThinkData
    },
    setCarouselPaused: (state, action: PayloadAction<boolean>) => {
      state.isCarouselPaused = action.payload
    },
    combineResponseData: (state) => {
      const tempAiContentData = {
        ...state.tempAiContentData,
        extraData: {
          done: true,
        },
      }
      if (!tempAiContentData.id) {
        tempAiContentData.id = String(nanoid())
      }
      state.aiResponseContentList.push(tempAiContentData)
      state.tempAiContentData = initialState.tempAiContentData
    },
  },
})

export const {
  setActiveTab,
  getAiSteamData,
  changeIsLoadingData,
  changeIsRenderingData,
  changeIsAnalyzeContent,
  changeAiResponseContentList,
  changeInputValue,
  combineResponseData,
  changeIsShowDeepThink,
  changeIsShowAgentDetail,
  changeIsShowDeepThinkSources,
  changeCurrentAiContentDeepThinkData,
  setCarouselPaused,
  changeIsPlaying,
  resetTempAiContentData,
} = useCasesSlice.actions
export default useCasesSlice.reducer

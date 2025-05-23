import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { AiSteamDataType, AnalyzeContentDataType, RecommandContentDataType, ROLE_TYPE, STREAM_DATA_TYPE, TempAiContentDataType, ThreadData } from './tradeai.d'

interface TradeAiState {
  readonly nextIndex: number
  readonly aiResponseContentList: TempAiContentDataType[]
  readonly tempAiContentData: TempAiContentDataType
  readonly fileList: File[]
  readonly isGrabbingTradeAi: boolean
  readonly isFocus: boolean
  readonly inputValue: string
  readonly isLoadingData: boolean
  readonly isOverlapping: boolean
  readonly isRenderingData: boolean
  readonly threadsList: ThreadData[]
  readonly isOpenAuxiliaryArea: boolean
  readonly isLoadingAiContent: boolean
  readonly currentRenderingId: string
  readonly isShowInsightTradeAiContent: boolean
  readonly isAnalyzeContent: boolean
  readonly analyzeContentList: AnalyzeContentDataType[]
  readonly recommandContentList: RecommandContentDataType[]
  readonly isOpenDeleteThread: boolean
  readonly selectThreadIds: string[]
  readonly isShowDeepThink: boolean
  readonly currentAiContentDeepThinkData: TempAiContentDataType
  readonly hasLoadThreadsList: boolean
  readonly isChatPageLoaded: boolean
}

const initialState: TradeAiState = {
  nextIndex: 0,
  fileList: [],
  isLoadingAiContent: false,
  aiResponseContentList: [],
  isGrabbingTradeAi: false,
  isFocus: false,
  inputValue: '',
  isRenderingData: false,
  isLoadingData: false,
  isOverlapping: false,
  isOpenAuxiliaryArea: false,
  threadsList: [],
  currentRenderingId: '',
  tempAiContentData: {
    id: '',
    feedback: null,
    role: ROLE_TYPE.ASSISTANT,
    thoughtContentList: [],
    sourceListDetails: [],
    content: '',
    timestamp: 0,
  },
  isShowInsightTradeAiContent: false,
  isAnalyzeContent: false,
  analyzeContentList: [],
  recommandContentList: [],
  isOpenDeleteThread: false,
  selectThreadIds: [],
  isShowDeepThink: false,
  currentAiContentDeepThinkData: {
    id: '',
    feedback: null,
    role: ROLE_TYPE.ASSISTANT,
    thoughtContentList: [],
    sourceListDetails: [],
    content: '',
    timestamp: 0,
  },
  hasLoadThreadsList: false,
  isChatPageLoaded: false,
}

// 创建切片
export const tradeAiSlice = createSlice({
  name: 'tradeai',
  initialState,
  reducers: {
    getAiSteamData: (state, action: PayloadAction<{ aiSteamData: AiSteamDataType }>) => {
      const tempAiContentData = state.tempAiContentData
      const { id, type, content } = action.payload.aiSteamData
      if (type === STREAM_DATA_TYPE.ERROR) {
        state.tempAiContentData = {
          id,
          thoughtContentList: [],
          sourceListDetails: [],
          content: tempAiContentData.content + content,
          feedback: null,
          role: ROLE_TYPE.ASSISTANT,
          timestamp: new Date().getTime(),
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
            }
          }
        } else {
          if (type === STREAM_DATA_TYPE.TEMP) {
            const data = JSON.parse(content)
            const { tool_name, tool_type, description, id } = data
            const isExist = tempAiContentData.thoughtContentList.some(item => item.id === id)
            
            let newThoughtContentList = [...tempAiContentData.thoughtContentList]
            
            if (isExist) {
              // 如果已存在，找到对应项并更新description
              newThoughtContentList = newThoughtContentList.map(item => {
                if (item.id === id) {
                  return {
                    ...item,
                    tool_description: item.tool_description + description
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
                tool_description: description
              })
            }
            state.tempAiContentData.thoughtContentList = newThoughtContentList
          } else if (type === STREAM_DATA_TYPE.SOURCE_LIST_DETAILS) {
            const list = JSON.parse(content)
            const newSourceListDetails = tempAiContentData.sourceListDetails.concat(list)
            state.tempAiContentData.sourceListDetails = newSourceListDetails
          } else if (type === STREAM_DATA_TYPE.FINAL_ANSWER) {
            const newContent = tempAiContentData.content + content
            state.tempAiContentData.content = newContent
          }
        }
      }
    },
    combineResponseData: (state) => {
      const tempAiContentData = {
        ...state.tempAiContentData,
        extraData: {
          done: true
        }
      }
      if (!tempAiContentData.id) {
        tempAiContentData.id = String(nanoid())
      }
      state.aiResponseContentList.push(tempAiContentData)
      state.tempAiContentData = initialState.tempAiContentData
    },
    changeAiResponseContentList: (state, action: PayloadAction<{aiResponseContentList: TempAiContentDataType[]}>) => {
      state.aiResponseContentList = action.payload.aiResponseContentList
    },
    changeFileList: (state, action: PayloadAction<{fileList: File[]}>) => {
      state.fileList = action.payload.fileList
    },
    changeIsGrabbingTradeAi: (state, action: PayloadAction<{isGrabbingTradeAi: boolean}>) => {
      state.isGrabbingTradeAi = action.payload.isGrabbingTradeAi
    },
    changeIsFocus: (state, action: PayloadAction<{isFocus: boolean}>) => {
      state.isFocus = action.payload.isFocus
    },
    changeInputValue: (state, action: PayloadAction<{inputValue: string}>) => {
      state.inputValue = action.payload.inputValue
    },
    changeIsLoadingData: (state, action: PayloadAction<{isLoadingData: boolean}>) => {
      state.isLoadingData = action.payload.isLoadingData
    },
    changeIsOverlapping: (state, action: PayloadAction<{isOverlapping: boolean}>) => {
      state.isOverlapping = action.payload.isOverlapping
    },
    changeIsRenderingData: (state, action: PayloadAction<{isRenderingData: boolean}>) => {
      state.isRenderingData = action.payload.isRenderingData
    },
    changeThreadsList: (state, action: PayloadAction<{threadsList: ThreadData[]}>) => {
      state.threadsList = action.payload.threadsList
    },
    changeCurrentRenderingId: (state, action: PayloadAction<{currentRenderingId: string}>) => {
      state.currentRenderingId = action.payload.currentRenderingId
    },
    changeIsOpenAuxiliaryArea: (state, action: PayloadAction<{isOpenAuxiliaryArea: boolean}>) => {
      state.isOpenAuxiliaryArea = action.payload.isOpenAuxiliaryArea
    },
    changeIsLoadingAiContent: (state, action: PayloadAction<{isLoadingAiContent: boolean}>) => {
      state.isLoadingAiContent = action.payload.isLoadingAiContent
    },
    resetTempAiContentData: (state) => {
      state.tempAiContentData = initialState.tempAiContentData
    },
    changeIsShowInsightTradeAiContent: (state, action: PayloadAction<{isShowInsightTradeAiContent: boolean}>) => {
      state.isShowInsightTradeAiContent = action.payload.isShowInsightTradeAiContent
    },
    changeIsAnalyzeContent: (state, action: PayloadAction<{isAnalyzeContent: boolean}>) => {
      state.isAnalyzeContent = action.payload.isAnalyzeContent
    },
    changeAnalyzeContentList: (state, action: PayloadAction<{analyzeContentList: AnalyzeContentDataType[]}>) => {
      state.analyzeContentList = action.payload.analyzeContentList
    },
    changeRecommandContentList: (state, action: PayloadAction<{recommandContentList: RecommandContentDataType[]}>) => {
      state.recommandContentList = action.payload.recommandContentList
    },
    changeIsOpenDeleteThread: (state, action: PayloadAction<{isOpenDeleteThread: boolean}>) => {
      state.isOpenDeleteThread = action.payload.isOpenDeleteThread
    },
    changeSelectThreadIds: (state, action: PayloadAction<{selectThreadIds: string[]}>) => {
      state.selectThreadIds = action.payload.selectThreadIds
    },
    changeIsShowDeepThink: (state, action: PayloadAction<{isShowDeepThink: boolean}>) => {
      state.isShowDeepThink = action.payload.isShowDeepThink
    },
    changeCurrentAiContentDeepThinkData: (state, action: PayloadAction<{currentAiContentDeepThinkData: TempAiContentDataType}>) => {
      state.currentAiContentDeepThinkData = action.payload.currentAiContentDeepThinkData
    },
    changeHasLoadThreadsList: (state, action: PayloadAction<{hasLoadThreadsList: boolean}>) => {
      state.hasLoadThreadsList = action.payload.hasLoadThreadsList
    },
    changeIsChatPageLoaded: (state, action: PayloadAction<{isChatPageLoaded: boolean}>) => {
      state.isChatPageLoaded = action.payload.isChatPageLoaded
    },
  },
});

export const {
  getAiSteamData,
  combineResponseData,
  changeAiResponseContentList,
  changeFileList,
  changeIsGrabbingTradeAi,
  changeIsFocus,
  changeInputValue,
  changeIsLoadingData,
  changeIsOverlapping,
  changeIsRenderingData,
  changeThreadsList,
  changeCurrentRenderingId,
  changeIsOpenAuxiliaryArea,
  changeIsLoadingAiContent,
  resetTempAiContentData,
  changeIsShowInsightTradeAiContent,
  changeIsAnalyzeContent,
  changeAnalyzeContentList,
  changeRecommandContentList,
  changeIsOpenDeleteThread,
  changeSelectThreadIds,
  changeIsShowDeepThink,
  changeCurrentAiContentDeepThinkData,
  changeHasLoadThreadsList,
  changeIsChatPageLoaded,
} = tradeAiSlice.actions;

// 导出reducer
export default tradeAiSlice.reducer;
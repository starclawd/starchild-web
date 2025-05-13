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
          content: tempAiContentData.content + content,
          feedback: null,
          role: ROLE_TYPE.ASSISTANT,
          timestamp: new Date().getTime(),
        }
      } else {
        if (tempAiContentData.id !== id) {
          if (type === STREAM_DATA_TYPE.TEMP) {
            state.tempAiContentData = {
              id,
              feedback: null,
              thoughtContentList: tempAiContentData.thoughtContentList.concat(JSON.parse(content)),
              content: tempAiContentData.content ? tempAiContentData.content : '',
              role: ROLE_TYPE.ASSISTANT,
              timestamp: new Date().getTime(),
            }
          } else if (type === STREAM_DATA_TYPE.FINAL_ANSWER) {
            state.tempAiContentData = {
              id,
              feedback: null,
              thoughtContentList: tempAiContentData.thoughtContentList,
              content,
              role: ROLE_TYPE.ASSISTANT,
              timestamp: new Date().getTime(),
            }
          }
        } else {
          if (type === STREAM_DATA_TYPE.TEMP) {
            const newContent = tempAiContentData.thoughtContentList.concat(JSON.parse(content))
            state.tempAiContentData.thoughtContentList = newContent
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
} = tradeAiSlice.actions;

// 导出reducer
export default tradeAiSlice.reducer;
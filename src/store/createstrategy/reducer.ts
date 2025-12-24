import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import {
  ChatContentDataType,
  ChatResponseContentDataType,
  ChatSteamDataType,
  DEPLOYING_STATUS,
  DeployModalStatus,
  STRATEGY_STATUS,
  PaperTradingCurrentDataType,
  StrategyBacktestDataType,
  StrategyCodeDataType,
  StrategyDetailDataType,
  STRATEGY_TAB_INDEX,
} from './createstrategy'
import { ROLE_TYPE, STREAM_DATA_TYPE } from 'store/chat/chat'

// 流式 step 数据类型
export interface StreamingStepDataType {
  step: string
  message: string
  displayMessage: string // 打字机效果显示的消息
  progress?: number
  timestamp: string
  data?: any
  isComplete: boolean // 该 step 是否完成打字机效果
}

// 交易账户信息类型
export interface TradingAccountInfo {
  accountId: `0x${string}`
  brokerHash: `0x${string}`
  walletAddress: `0x${string}`
}

export interface CreateStrategyState {
  chatContentList: ChatContentDataType[]
  strategyInfoTabIndex: STRATEGY_TAB_INDEX
  chatResponseContentList: ChatResponseContentDataType[]
  chatValue: string
  isRenderingData: boolean
  isAnalyzeContent: boolean
  isLoadingChatStream: boolean
  isLoadingChatContents: boolean
  tempChatContentData: ChatResponseContentDataType
  strategyDetail: StrategyDetailDataType | null
  isLoadingStrategyDetail: boolean
  strategyCode: StrategyCodeDataType | null
  isLoadingStrategyCode: boolean
  strategyBacktestData: StrategyBacktestDataType | null
  isLoadingStrategyBacktest: boolean
  deployingStatus: DEPLOYING_STATUS
  paperTradingCurrentData: PaperTradingCurrentDataType | null
  isLoadingPaperTradingCurrent: boolean
  // 部署相关状态 - 确保所有组件共享相同实例
  deployModalStatus: DeployModalStatus
  deployIsLoading: boolean
  deployError: string | undefined
  deployEnablePolling: boolean
  deployStrategyStatus: STRATEGY_STATUS | null
  deployCheckStatusLoading: boolean
  tradingAccountInfo: TradingAccountInfo | null
  deployChainId: string | null
  deployTxid: string | null
  // Backtest 流式相关状态
  streamingSteps: StreamingStepDataType[]
  isBacktestStreaming: boolean
  isGeneratingCode: boolean
  isStartingPaperTrading: boolean
  isPausingPaperTrading: boolean
  codeLoadingPercent: number
  isTypewritingCode: boolean
  isShowWorkflow: boolean
  isShowSignals: boolean
}

const initialState: CreateStrategyState = {
  chatContentList: [],
  strategyInfoTabIndex: STRATEGY_TAB_INDEX.CREATE,
  chatResponseContentList: [],
  chatValue: '',
  isRenderingData: false,
  isAnalyzeContent: false,
  isLoadingChatStream: false,
  isLoadingChatContents: false,
  tempChatContentData: {
    id: '',
    content: '',
    role: ROLE_TYPE.ASSISTANT,
    timestamp: 0,
    thoughtContentList: [],
    sourceListDetails: [],
  },
  strategyDetail: null,
  isLoadingStrategyDetail: false,
  strategyCode: null,
  isLoadingStrategyCode: false,
  strategyBacktestData: null,
  isLoadingStrategyBacktest: false,
  paperTradingCurrentData: null,
  isLoadingPaperTradingCurrent: false,
  // 部署相关状态初始值
  deployingStatus: DEPLOYING_STATUS.NONE,
  deployModalStatus: 'form',
  deployIsLoading: false,
  deployError: undefined,
  deployEnablePolling: false,
  deployStrategyStatus: null,
  deployCheckStatusLoading: false,
  tradingAccountInfo: null,
  deployChainId: null,
  deployTxid: null,
  // Backtest 流式相关状态
  streamingSteps: [],
  isBacktestStreaming: false,
  isGeneratingCode: false,
  isStartingPaperTrading: false,
  isPausingPaperTrading: false,
  codeLoadingPercent: 0,
  isTypewritingCode: false,
  isShowWorkflow: false,
  isShowSignals: true,
}

export const createStrategySlice = createSlice({
  name: 'createStrategy',
  initialState,
  reducers: {
    updateChatContentList: (state, action: PayloadAction<any[]>) => {
      state.chatContentList = action.payload
    },
    updateStrategyInfoTabIndex: (state, action: PayloadAction<STRATEGY_TAB_INDEX>) => {
      state.strategyInfoTabIndex = action.payload
    },
    changeChatResponseContentList: (
      state,
      action: PayloadAction<{ chatResponseContentList: ChatResponseContentDataType[] }>,
    ) => {
      state.chatResponseContentList = action.payload.chatResponseContentList
    },
    changeChatValue: (state, action: PayloadAction<{ chatValue: string }>) => {
      state.chatValue = action.payload.chatValue
    },
    changeIsRenderingData: (state, action: PayloadAction<{ isRenderingData: boolean }>) => {
      state.isRenderingData = action.payload.isRenderingData
    },
    changeIsAnalyzeContent: (state, action: PayloadAction<{ isAnalyzeContent: boolean }>) => {
      state.isAnalyzeContent = action.payload.isAnalyzeContent
    },
    changeIsLoadingChatStream: (state, action: PayloadAction<{ isLoadingChatStream: boolean }>) => {
      state.isLoadingChatStream = action.payload.isLoadingChatStream
    },
    changeIsLoadingChatContents: (state, action: PayloadAction<{ isLoadingChatContents: boolean }>) => {
      state.isLoadingChatContents = action.payload.isLoadingChatContents
    },
    changeIsLoadingStrategyDetail: (state, action: PayloadAction<{ isLoadingStrategyDetail: boolean }>) => {
      state.isLoadingStrategyDetail = action.payload.isLoadingStrategyDetail
    },
    updateStrategyDetail: (state, action: PayloadAction<StrategyDetailDataType>) => {
      state.strategyDetail = action.payload
    },
    changeIsLoadingStrategyCode: (state, action: PayloadAction<{ isLoadingStrategyCode: boolean }>) => {
      state.isLoadingStrategyCode = action.payload.isLoadingStrategyCode
    },
    updateStrategyCode: (state, action: PayloadAction<StrategyCodeDataType>) => {
      state.strategyCode = action.payload
    },
    changeIsLoadingStrategyBacktest: (state, action: PayloadAction<{ isLoadingStrategyBacktest: boolean }>) => {
      state.isLoadingStrategyBacktest = action.payload.isLoadingStrategyBacktest
    },
    updateStrategyBacktestData: (state, action: PayloadAction<StrategyBacktestDataType>) => {
      state.strategyBacktestData = action.payload
    },
    resetStrategyBacktestData: (state) => {
      state.strategyBacktestData = null
    },
    updateDeployingStatus: (state, action: PayloadAction<DEPLOYING_STATUS>) => {
      state.deployingStatus = action.payload
    },
    // 部署相关状态管理 actions
    updateDeployModalStatus: (state, action: PayloadAction<DeployModalStatus>) => {
      state.deployModalStatus = action.payload
    },
    updateDeployIsLoading: (state, action: PayloadAction<boolean>) => {
      state.deployIsLoading = action.payload
    },
    updateDeployError: (state, action: PayloadAction<string | undefined>) => {
      state.deployError = action.payload
    },
    updateDeployEnablePolling: (state, action: PayloadAction<boolean>) => {
      state.deployEnablePolling = action.payload
    },
    updateDeployStrategyStatus: (state, action: PayloadAction<STRATEGY_STATUS | null>) => {
      state.deployStrategyStatus = action.payload
    },
    updateDeployCheckStatusLoading: (state, action: PayloadAction<boolean>) => {
      state.deployCheckStatusLoading = action.payload
    },
    updateTradingAccountInfo: (state, action: PayloadAction<TradingAccountInfo | null>) => {
      state.tradingAccountInfo = action.payload
    },
    updateDeployChainId: (state, action: PayloadAction<string | null>) => {
      state.deployChainId = action.payload
    },
    updateDeployTxid: (state, action: PayloadAction<string | null>) => {
      state.deployTxid = action.payload
    },
    changeIsLoadingPaperTradingCurrent: (state, action: PayloadAction<{ isLoadingPaperTradingCurrent: boolean }>) => {
      state.isLoadingPaperTradingCurrent = action.payload.isLoadingPaperTradingCurrent
    },
    updatePaperTradingCurrentData: (state, action: PayloadAction<PaperTradingCurrentDataType | null>) => {
      state.paperTradingCurrentData = action.payload
    },
    resetTempChatContentData: (state) => {
      state.tempChatContentData = initialState.tempChatContentData
    },
    // Backtest 流式相关 actions
    setIsBacktestStreaming: (state, action: PayloadAction<boolean>) => {
      state.isBacktestStreaming = action.payload
    },
    setIsGeneratingCode: (state, action: PayloadAction<boolean>) => {
      state.isGeneratingCode = action.payload
    },
    setIsStartingPaperTrading: (state, action: PayloadAction<boolean>) => {
      state.isStartingPaperTrading = action.payload
    },
    setIsPausingPaperTrading: (state, action: PayloadAction<boolean>) => {
      state.isPausingPaperTrading = action.payload
    },
    setCodeLoadingPercent: (state, action: PayloadAction<number>) => {
      state.codeLoadingPercent = action.payload
    },
    setIsTypewritingCode: (state, action: PayloadAction<boolean>) => {
      state.isTypewritingCode = action.payload
    },
    setIsShowWorkflow: (state, action: PayloadAction<boolean>) => {
      state.isShowWorkflow = action.payload
    },
    setIsShowSignals: (state, action: PayloadAction<boolean>) => {
      state.isShowSignals = action.payload
    },
    resetStreamingSteps: (state) => {
      state.streamingSteps = []
    },
    addStreamingStep: (
      state,
      action: PayloadAction<{ step: string; message: string; progress?: number; timestamp: string; data?: any }>,
    ) => {
      const { step, message, progress, timestamp, data } = action.payload
      state.streamingSteps.push({
        step,
        message,
        displayMessage: '',
        progress,
        timestamp,
        data,
        isComplete: false,
      })
    },
    updateStreamingStepMessage: (state, action: PayloadAction<{ stepIndex: number; displayMessage: string }>) => {
      const { stepIndex, displayMessage } = action.payload
      // stepIndex = -1 表示最后一个 step
      const targetIndex = stepIndex === -1 ? state.streamingSteps.length - 1 : stepIndex
      if (state.streamingSteps[targetIndex]) {
        state.streamingSteps[targetIndex].displayMessage = displayMessage
      }
    },
    completeStreamingStep: (state, action: PayloadAction<{ stepIndex: number }>) => {
      const { stepIndex } = action.payload
      // stepIndex = -1 表示最后一个 step
      const targetIndex = stepIndex === -1 ? state.streamingSteps.length - 1 : stepIndex
      if (state.streamingSteps[targetIndex]) {
        state.streamingSteps[targetIndex].isComplete = true
        state.streamingSteps[targetIndex].displayMessage = state.streamingSteps[targetIndex].message
      }
    },
    setChatSteamData: (state, action: PayloadAction<{ chatSteamData: ChatSteamDataType }>) => {
      const tempChatContentData = state.tempChatContentData
      const { id, type, content } = action.payload.chatSteamData
      if (type === STREAM_DATA_TYPE.ERROR) {
        state.tempChatContentData = {
          id,
          thoughtContentList: [],
          sourceListDetails: [],
          content: tempChatContentData.content + content,
          role: ROLE_TYPE.ASSISTANT,
          timestamp: new Date().getTime(),
        }
      } else {
        if (tempChatContentData.id !== id) {
          if (type === STREAM_DATA_TYPE.TEMP) {
            const data = JSON.parse(content)
            state.tempChatContentData = {
              id,
              thoughtContentList: tempChatContentData.thoughtContentList.concat({
                id: data.id,
                tool_name: data.tool_name,
                tool_type: data.tool_type,
                tool_description: data.description,
              }),
              sourceListDetails: tempChatContentData.sourceListDetails,
              content: tempChatContentData.content ? tempChatContentData.content : '',
              role: ROLE_TYPE.ASSISTANT,
              timestamp: new Date().getTime(),
            }
          } else if (type === STREAM_DATA_TYPE.SOURCE_LIST_DETAILS) {
            const list = JSON.parse(content)
            state.tempChatContentData = {
              id,
              thoughtContentList: tempChatContentData.thoughtContentList,
              sourceListDetails: list,
              content: tempChatContentData.content,
              role: ROLE_TYPE.ASSISTANT,
              timestamp: new Date().getTime(),
            }
          } else if (type === STREAM_DATA_TYPE.FINAL_ANSWER) {
            state.tempChatContentData = {
              id,
              thoughtContentList: tempChatContentData.thoughtContentList,
              sourceListDetails: tempChatContentData.sourceListDetails,
              content,
              role: ROLE_TYPE.ASSISTANT,
              timestamp: new Date().getTime(),
            }
          }
        } else {
          if (type === STREAM_DATA_TYPE.TEMP) {
            const data = JSON.parse(content)
            const { tool_name, tool_type, description, id } = data
            const isExist = tempChatContentData.thoughtContentList.some((item) => item.id === id)

            let newThoughtContentList = [...tempChatContentData.thoughtContentList]

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
            state.tempChatContentData.thoughtContentList = newThoughtContentList
          } else if (type === STREAM_DATA_TYPE.SOURCE_LIST_DETAILS) {
            const list = JSON.parse(content)
            const newSourceListDetails = tempChatContentData.sourceListDetails.concat(list)
            state.tempChatContentData.sourceListDetails = newSourceListDetails
          } else if (type === STREAM_DATA_TYPE.FINAL_ANSWER) {
            const newContent = tempChatContentData.content + content
            state.tempChatContentData.content = newContent
          }
        }
      }
    },
    combineResponseData: (state) => {
      const tempChatContentData = {
        ...state.tempChatContentData,
      }
      if (!tempChatContentData.id) {
        tempChatContentData.id = String(nanoid())
      }
      state.chatResponseContentList.push(tempChatContentData)
      state.tempChatContentData = initialState.tempChatContentData
    },
    resetCreateStrategy: (state) => {
      return { ...initialState }
    },
  },
})
export const {
  updateChatContentList,
  updateStrategyInfoTabIndex,
  changeChatResponseContentList,
  changeChatValue,
  changeIsRenderingData,
  changeIsAnalyzeContent,
  changeIsLoadingChatStream,
  changeIsLoadingChatContents,
  combineResponseData,
  resetTempChatContentData,
  changeIsLoadingStrategyDetail,
  updateStrategyDetail,
  changeIsLoadingStrategyCode,
  updateStrategyCode,
  changeIsLoadingStrategyBacktest,
  updateStrategyBacktestData,
  resetStrategyBacktestData,
  updateDeployingStatus,
  updateDeployModalStatus,
  updateDeployIsLoading,
  updateDeployError,
  updateDeployEnablePolling,
  updateDeployStrategyStatus,
  updateDeployCheckStatusLoading,
  updateTradingAccountInfo,
  updateDeployChainId,
  updateDeployTxid,
  changeIsLoadingPaperTradingCurrent,
  updatePaperTradingCurrentData,
  setChatSteamData,
  resetCreateStrategy,
  // Backtest 流式相关 actions
  setIsBacktestStreaming,
  setIsGeneratingCode,
  setIsStartingPaperTrading,
  setIsPausingPaperTrading,
  setCodeLoadingPercent,
  setIsTypewritingCode,
  setIsShowWorkflow,
  setIsShowSignals,
  resetStreamingSteps,
  addStreamingStep,
  updateStreamingStepMessage,
  completeStreamingStep,
} = createStrategySlice.actions
export default createStrategySlice.reducer

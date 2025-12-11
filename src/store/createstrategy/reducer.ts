import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { ChatContentDataType, ChatResponseContentDataType, ChatSteamDataType } from './createstrategy'
import { ROLE_TYPE, STREAM_DATA_TYPE } from 'store/chat/chat'

export interface CreateStrategyState {
  chatContentList: ChatContentDataType[]
  strategyInfoTabIndex: number
  chatResponseContentList: ChatResponseContentDataType[]
  chatValue: string
  isRenderingData: boolean
  isAnalyzeContent: boolean
  isLoadingChatStream: boolean
  isLoadingChatContents: boolean
  tempChatContentData: ChatResponseContentDataType
}

const initialState: CreateStrategyState = {
  chatContentList: [],
  strategyInfoTabIndex: 0,
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
}

export const createStrategySlice = createSlice({
  name: 'createStrategy',
  initialState,
  reducers: {
    updateChatContentList: (state, action: PayloadAction<any[]>) => {
      state.chatContentList = action.payload
    },
    updateStrategyInfoTabIndex: (state, action: PayloadAction<number>) => {
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
    resetTempChatContentData: (state) => {
      state.tempChatContentData = initialState.tempChatContentData
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
  setChatSteamData,
} = createStrategySlice.actions
export default createStrategySlice.reducer

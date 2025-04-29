/**
 * AI 交易助手相关 API 接口
 * 包含以下功能模块：
 * 1. OpenAI 接口集成（语音转文字、对话）
 * 2. AI 交易助手对话管理
 * 3. 对话内容管理（点赞、反馈）
 * 4. 对话线程管理
 */

import { openAiApi, tradeAiApi } from './base'
export const OPEN_AI_KEY = ''

/**
 * OpenAI API 接口集合
 */
const postsApi = openAiApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * 语音转文字
     * @param param.audioBlob 音频文件二进制数据
     */
    audioTranscriptions: builder.query({
      query: (param: { audioBlob: Blob }) => {
        const formData = new FormData()
        formData.append('file', param.audioBlob, 'audio.wav')
        formData.append('model', 'whisper-1')
        return {
          url: '/audio/transcriptions',
          method: 'post',
          headers: {
            'Authorization': `Bearer ${OPEN_AI_KEY}`
          },
          body: formData,
        }
      },
    }),

    /**
     * OpenAI 对话接口
     * @param param 对话参数
     */
    openAiChatCompletions: builder.query({
      query: (param) => {
        return {
          url: '/chat/completions',
          method: 'post',
          headers: {
            'Authorization': `Bearer ${OPEN_AI_KEY}`
          },
          body: param,
        }
      },
    }),
  }),
  overrideExisting: false,
})

/**
 * AI 交易助手 API 接口集合
 */
const postsTradeAiApi = tradeAiApi.injectEndpoints({
  endpoints: (builder: any) => ({

    /**
     * 获取对话内容列表
     * @param param.account 账户地址
     * @param param.threadId 对话线程ID
     * @param param.aiChatKey AI对话密钥
     */
    getAiBotChatContents: builder.query({
      query: (param: { account: string, threadId: string, aiChatKey: string }) => {
        const { account, threadId, aiChatKey } = param
        return {
          url: `/chatContents?threadId=${threadId}&account=${account}&accountApiKey=${aiChatKey}`,
          method: 'get',
        }
      },
    }),

    /**
     * 获取对话线程列表
     * @param param.account 账户地址
     * @param param.aiChatKey AI对话密钥
     */
    getAiBotChatThreads: builder.query({
      query: (param: { account: string }) => {
        const { account } = param
        return {
          url: `/threads?user_id=${account}`,
          method: 'get',
        }
      },
    }),

    /**
     * 删除对话线程
     * @param param.account 账户地址
     * @param param.threadId 对话线程ID
     * @param param.aiChatKey AI对话密钥
     */
    deleteThread: builder.query({
      query: (param: { account: string, threadId: string }) => {
        const { account, threadId } = param
        return {
          url: `/threads?user_id=${account}&thread_id=${threadId}`,
          method: 'delete',
        }
      },
    }),

    /**
     * 删除对话内容
     * @param param.id 对话内容ID
     */
    deleteContent: builder.query({
      query: (param: { id: string, account: string, threadId: string, accountApiKey: string }) => {
        const { id, account, threadId, accountApiKey } = param
        return {
          url: `/chatContent?contentId=${id}&account=${account}&threadId=${threadId}&accountApiKey=${accountApiKey}`,
          method: 'delete',
        }
      },
    }),

    /**
     * 点赞对话内容
     * @param param.id 对话内容ID
     */
    likeContent: builder.query({
      query: (param: { id: string, threadId: string, account: string, accountApiKey: string, feedback: string }) => {
        const { id, threadId, account, accountApiKey, feedback } = param
        const formData = new FormData()
        formData.append('account', account)
        formData.append('threadId', threadId)
        formData.append('contentId', id)
        formData.append('feedback', feedback)
        formData.append('reason', '')
        formData.append('accountApiKey', accountApiKey)
        return {
          url: '/feedback',
          method: 'post',
          body: formData,
        }
      },
    }),

    /**
     * 对对话内容表示不满意
     * @param param.id 对话内容ID
     * @param param.content 反馈内容
     */
    dislikeContent: builder.query({
      query: (param: { id: string, threadId: string, account: string, accountApiKey: string, feedback: string, reason: string }) => {
        const { id, threadId, account, accountApiKey, feedback, reason } = param
        const formData = new FormData()
        formData.append('account', account)
        formData.append('threadId', threadId)
        formData.append('contentId', id)
        formData.append('feedback', feedback)
        formData.append('reason', reason)
        formData.append('accountApiKey', accountApiKey)
        return {
          url: '/feedback',
          method: 'post',
          body: formData,
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useLazyOpenAiChatCompletionsQuery,
  useLazyAudioTranscriptionsQuery,
} = postsApi

export const {
  useLazyGetAiBotChatContentsQuery,
  useLazyGetAiBotChatThreadsQuery,
  useLazyDeleteThreadQuery,
  useLazyDeleteContentQuery,
  useLazyLikeContentQuery,
  useLazyDislikeContentQuery,
} = postsTradeAiApi

export default {
  ...postsApi,
  ...postsTradeAiApi
}

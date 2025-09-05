/**
 * AI 交易助手相关 API 接口
 * 包含以下功能模块：
 * 1. OpenAI 接口集成（语音转文字、对话）
 * 2. AI 交易助手对话管理
 * 3. 对话内容管理（点赞、反馈）
 * 4. 对话线程管理
 */

import { AI_STYLE_TYPE } from 'store/shortcuts/shortcuts'
import { chatApi, baseApi } from './base'

/**
 * OpenAI API 接口集合
 */
const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * OpenAI 对话接口
     * @param param 对话参数
     */
    openAiChatCompletions: builder.query({
      query: (param) => {
        return {
          url: '/openai/chat/completions',
          method: 'post',
          body: param,
        }
      },
    }),
    chartImg: builder.query({
      query: (param) => {
        return {
          url: '/chart',
          method: 'post',
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
const postsChatApi = chatApi.injectEndpoints({
  endpoints: (builder: any) => ({
    /**
     * 获取对话内容列表
     * @param param.account 账户地址
     * @param param.threadId 对话线程ID
     * @param param.aiChatKey AI对话密钥
     */
    getAiBotChatContents: builder.query({
      query: (param: { account: string; threadId: string }) => {
        const { account, threadId } = param
        return {
          url: `/chat_content?thread_id=${threadId}&user_id=${account}`,
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
      query: (param: { account: string; threadIds: string[] }) => {
        const { account, threadIds } = param
        return {
          url: `/batch_threads?user_id=${account}&thread_ids=${threadIds.join(',')}`,
          method: 'delete',
        }
      },
    }),

    /**
     * 删除对话内容
     * @param param.id 对话内容ID
     */
    deleteContent: builder.query({
      query: (param: { id: string; account: string; threadId: string }) => {
        const { id, account, threadId } = param
        return {
          url: `/chat_content?msg_id=${id}&thread_id=${threadId}&user_id=${account}`,
          method: 'delete',
        }
      },
    }),

    /**
     * 点赞对话内容
     * @param param.id 对话内容ID
     */
    likeContent: builder.query({
      query: (param: { id: string; threadId: string; account: string; accountApiKey: string; feedback: string }) => {
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
      query: (param: {
        id: string
        threadId: string
        account: string
        accountApiKey: string
        feedback: string
        reason: string
      }) => {
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
    getAiStyleType: builder.query({
      query: (param: { account: string }) => {
        const { account } = param
        return {
          url: `/user_settings?user_id=${account}`,
          method: 'get',
        }
      },
    }),
    updateAiStyleType: builder.query({
      query: (param: { account: string; aiStyleType: string }) => {
        const { account, aiStyleType } = param
        const params = new URLSearchParams()
        params.append('user_id', account)
        params.append('user_settings', JSON.stringify({ short_answer: aiStyleType === AI_STYLE_TYPE.CONCISE }))
        return {
          url: '/user_settings',
          method: 'put',
          body: params,
        }
      },
    }),
    generateKlineChart: builder.query({
      query: (param: { id: string; account: string; threadId: string; finalAnswer: string }) => {
        const { id, account, threadId, finalAnswer } = param
        const params = new URLSearchParams()
        params.append('final_answer', finalAnswer)
        params.append('msg_id', id)
        params.append('thread_id', threadId)
        params.append('user_id', account)
        return {
          url: `/kline_charts`,
          method: 'post',
          body: params,
        }
      },
    }),
    getBacktestData: builder.query({
      query: (param: { taskId: string }) => {
        const { taskId } = param
        return {
          url: `/backtest_task_result`,
          method: 'post',
          body: {
            task_id: taskId,
          },
        }
      },
    }),
    getAgentDetail: builder.query({
      query: (param: { taskId: string }) => {
        const { taskId } = param
        return {
          url: `/task_detail?task_id=${taskId}`,
          method: 'get',
        }
      },
    }),
    recommendationDecision: builder.query({
      query: (param: { telegramUserId: string }) => {
        const { telegramUserId } = param
        return {
          url: `/user/recommendation_decision?user_id=${telegramUserId}`,
          method: 'get',
        }
      },
    }),
    chatRecommendations: builder.query({
      query: ({ telegramUserId }: { telegramUserId: string }) => {
        return {
          url: `/chat_recommendations?user_id=${telegramUserId}&count=5`,
          method: 'get',
        }
      },
    }),
    generateRecommandations: builder.query({
      query: ({
        telegramUserId,
        threadId,
        msgId,
        firstName,
      }: {
        telegramUserId: string
        threadId: string
        msgId: string
        firstName: string
      }) => {
        return {
          url: `/recommendations/generate`,
          method: 'post',
          body: {
            user_id: telegramUserId,
            thread_id: threadId,
            msg_id: msgId,
            first_name: firstName,
            source: 'auto',
          },
        }
      },
    }),
    trackRecommendations: builder.query({
      query: ({ recommendationId, actionType }: { recommendationId: string; actionType: string }) => {
        return {
          url: `/recommendations/track`,
          method: 'post',
          body: {
            recommendation_id: recommendationId,
            action_type: actionType,
          },
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useLazyOpenAiChatCompletionsQuery, useLazyChartImgQuery } = postsApi

export const {
  useLazyGetAiBotChatContentsQuery,
  useLazyGetAiBotChatThreadsQuery,
  useLazyDeleteThreadQuery,
  useLazyDeleteContentQuery,
  useLazyLikeContentQuery,
  useLazyDislikeContentQuery,
  useLazyGetAiStyleTypeQuery,
  useLazyUpdateAiStyleTypeQuery,
  useLazyGenerateKlineChartQuery,
  useLazyGetBacktestDataQuery,
  useLazyGetAgentDetailQuery,
  useLazyChatRecommendationsQuery,
  useLazyRecommendationDecisionQuery,
  useLazyGenerateRecommandationsQuery,
  useLazyTrackRecommendationsQuery,
} = postsChatApi

export default {
  ...postsApi,
  ...postsChatApi,
}

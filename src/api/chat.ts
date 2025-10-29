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
import { chatDomain } from 'utils/url'
import { API_LANG_MAP, DEFAULT_LOCALE } from 'constants/locales'

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
     * 对话反馈
     */
    chatFeedback: builder.query({
      query: (param: {
        userId: string
        chatId: string
        messageId: string
        feedbackType: 'like' | 'dislike'
        dislikeReason: string
        originalMessage: string
      }) => {
        const { userId, chatId, messageId, feedbackType, dislikeReason, originalMessage } = param
        return {
          url: '/feedback',
          method: 'post',
          body: {
            user_id: userId,
            chat_id: chatId,
            message_id: messageId,
            feedback_type: feedbackType,
            dislike_reason: dislikeReason,
            original_message: originalMessage,
          },
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
      queryFn: async (param: { id: string; account: string; threadId: string; finalAnswer: string }, api: any) => {
        const { id, account, threadId, finalAnswer } = param
        const state = api.getState() as any
        const {
          login: {
            userInfo: { aiChatKey, telegramUserId },
          },
          language: { currentLocale },
          languagecache: { userLocale },
        } = state

        const params = new URLSearchParams()
        params.append('query', finalAnswer)
        params.append('msg_id', id)
        params.append('thread_id', threadId)
        params.append('user_id', account)

        try {
          const domain = chatDomain['restfulDomain' as keyof typeof chatDomain]
          const response = await fetch(`${domain}/v1/kline_charts`, {
            method: 'POST',
            headers: {
              'ACCOUNT-ID': telegramUserId || '',
              'ACCOUNT-API-KEY': aiChatKey || '',
              'Content-Type': 'application/x-www-form-urlencoded',
              Accept: 'text/event-stream',
              language: API_LANG_MAP[currentLocale || userLocale || DEFAULT_LOCALE],
            },
            body: params,
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          return new Promise((resolve, reject) => {
            const reader = response.body?.getReader()
            if (!reader) {
              reject(new Error('Response body is null'))
              return
            }

            const decoder = new TextDecoder()
            let buffer = ''
            let finalResult: any = null

            const processStream = async () => {
              try {
                while (true) {
                  const { done, value } = await reader.read()
                  if (done) break

                  buffer += decoder.decode(value, { stream: true })

                  let newlineIndex
                  while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
                    const line = buffer.slice(0, newlineIndex).trim()
                    buffer = buffer.slice(newlineIndex + 1)

                    if (line === '') continue

                    try {
                      // 处理 SSE 格式：data: {"type": "heartbeat", "timestamp": 1758698588.812635}
                      if (line.startsWith('data: ')) {
                        const jsonStr = line.substring(6) // 移除 'data: ' 前缀
                        const data = JSON.parse(jsonStr)

                        if (data.type === 'final_result') {
                          finalResult = data
                          resolve({ data: finalResult })
                          return
                        }
                      }
                    } catch (parseError) {
                      console.error('Error parsing SSE message:', parseError, 'Line:', line)
                    }
                  }
                }

                // 如果流结束但没有收到 final_result，返回错误
                if (!finalResult) {
                  reject(new Error('No final_result received'))
                }
              } catch (error) {
                reject(error)
              }
            }

            processStream()
          })
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } }
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
    judgeKChart: builder.query({
      query: ({
        finalAnswer,
        telegramUserId,
        msgId,
        threadId,
      }: {
        finalAnswer: string
        telegramUserId: string
        msgId: string
        threadId: string
      }) => {
        return {
          url: `/kchart/judge`,
          method: 'post',
          body: {
            msg_id: msgId,
            thread_id: threadId,
            response_text: finalAnswer,
            user_id: telegramUserId,
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
  useLazyChatFeedbackQuery,
  useLazyGetAiStyleTypeQuery,
  useLazyUpdateAiStyleTypeQuery,
  useLazyGenerateKlineChartQuery,
  useLazyGetBacktestDataQuery,
  useLazyGetAgentDetailQuery,
  useLazyChatRecommendationsQuery,
  useLazyRecommendationDecisionQuery,
  useLazyGenerateRecommandationsQuery,
  useLazyTrackRecommendationsQuery,
  useLazyJudgeKChartQuery,
} = postsChatApi

export default {
  ...postsApi,
  ...postsChatApi,
}

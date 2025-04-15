/**
 * API 基础配置文件
 * 包含以下功能：
 * 1. 基础 API 请求配置
 * 2. 请求拦截器配置
 * 3. 响应拦截器配置
 * 4. 各类 API 实例创建
 */

import { BaseQueryFn, createApi, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { RootState } from 'store'
import { baseQuery, handleGeneralError } from './baseHolominds'
// import { parse, stringify } from 'json-bigint'

/**
 * Trade AI API 拦截器
 * 处理认证和错误提示等通用逻辑
 */
const tradeAiBaseQueryWithIntercept: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  // const currentChainId = (api.getState() as RootState).application.currentChainId
  
  // 发送请求
  const result = await baseQuery('restfulDomain')({
    ...(args as FetchArgs),
    responseHandler: async (response) => {
      const text = await response.text()
      // 处理大数字精度问题
      // return text.length ? parse(stringify(parse(text))) : null
      return text
    }
  }, api, extraOptions)

  const dispatch = api.dispatch
  
  // 处理认证失败
  if (result.error?.status === 401) {
    // handleAuthError(dispatch, currentChainId, (api.getState() as RootState).application.currentAccount)
  } 
  // 处理其他错误
  else if (result.error) {
    handleGeneralError(result, args as FetchArgs, dispatch, api.getState() as RootState)
  }

  return result
}

/**
 * Trade AI API 实例
 * 用于处理 AI 相关的交易请求
 */
export const tradeAiApi = createApi({
  baseQuery: tradeAiBaseQueryWithIntercept,
  reducerPath: 'tradeAiApi',
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({}),
})
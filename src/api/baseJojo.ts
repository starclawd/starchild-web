/**
 * API 基础配置文件
 * 包含以下功能：
 * 1. 基础 API 请求配置
 * 2. 请求拦截器配置
 * 3. 响应拦截器配置
 * 4. 各类 API 实例创建
 */

import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
// import { parse, stringify } from 'json-bigint'
// import { ApplicationModal } from 'store/application/application.d'
import { RootState } from 'store'
// 防抖时间戳
let timeStamp: number | null = null

/**
 * 创建基础查询函数
 * @param baseUrl - API 基础URL
 * @returns fetchBaseQuery 实例
 */
export const baseQuery = (baseUrl: string) => {
  return fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // const state = getState() as RootState
      // const {
      //   application: { currentAccount, currentChainId }
      // } = state

      const token = ''
      headers.set('authorization', `Bearer ${token || ''}`)

      return headers
    },
  })
}

/**
 * 需要自定义错误提示的 API 路径列表
 */
const CUSTOM_ERROR_MESSAGE_URLS = [
  '/order/build',
  '/order',
  '/private/verifyEmail',
  '/position/tpslOrder',
  '/private/gridOrder',
  '/private/preCheckGridOrder',
  '/private/degen/position',
  '/announcementAgent',
  '/private/degen/withdraw',
  '/private/claimCheckInActivityReward',
  '/private/tpslStopLimitOrder'
]


/**
 * 处理 CSV 文件下载
 */
export function handleCsvDownload(data: string, fileName: string) {
  const BOM = '\uFEFF'
  const csvData = new Blob([BOM + data], { type: 'text/csv' });
  const downloadLink = document.createElement('a')
  downloadLink.href = window.URL.createObjectURL(csvData)
  downloadLink.target = '_blank'
  downloadLink.download = fileName
  downloadLink.click()
}

/**
 * 处理认证错误
 */
export function handleAuthError(dispatch: any, chainId: number | null, account: string) {
  if (chainId && account) {
    // dispatch(changeAuthToken({
    //   chainId,
    //   account,
    //   authToken: '',
    // }))
    // dispatch(changeLoginStatus({ loginStatus: LOGIN_STATUS.NO_LOGIN }))
  }
}

/**
 * 处理一般错误
 */
export function handleGeneralError(result: any, args: FetchArgs, dispatch: any, state: RootState) {
  // 防抖处理
  if (timeStamp && Date.now() - timeStamp < 500) {
    timeStamp = Date.now()
    return
  }
  timeStamp = Date.now()

  const urlWithParam = args?.url
  const url = urlWithParam.split('?')[0]
  
  // 跳过需要自定义错误处理的 URL
  if (CUSTOM_ERROR_MESSAGE_URLS.includes(url)) return

  // 显示错误提示
  // const message = (result.error.data as any)?.message || t`Network Error. Please try again later`
  // const isMobile = state.application.isMobile

  // if (isMobile) {
  //   dispatch(setModalData({
  //     message,
  //     status: PromptInfoType.ERROR,
  //   }))
  //   dispatch(setOpenMobileModal(ApplicationModal.TOAST))
  // } else {
  //   dispatch(addPopup({ 
  //     content: { message }, 
  //     type: PromptInfoType.ERROR, 
  //     removeAfterMs: DEFAULT_DISMISS_MS 
  //   }))
  // }
}


/**
 * 基础请求拦截器
 * 处理认��、错误提示等通用逻辑
 */
export const baseQueryWithIntercept: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
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

  // 处理文件下载
  const downloadData = result.error?.data as string
  const originalStatus = (result.error as any)?.originalStatus as number
  const accept = (args as any).headers?.['Accept']
  const fileName = (args as any).headers?.['fileName']
  
  if (downloadData && accept === 'text/csv' && originalStatus === 200) {
    handleCsvDownload(downloadData, fileName)
    return result
  }

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
 * 创建基础 API 实例
 */
export const baseApi = createApi({
  baseQuery: baseQueryWithIntercept,
  reducerPath: 'baseApi',
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({}),
})
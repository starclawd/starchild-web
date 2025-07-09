/**
 * 币安 API 接口
 * 提供与币安交易所交互的功能，包括：
 * 1. 现货市场数据查询
 * 2. 期货指数数据查询
 * 3. 网格交易参数获取
 */

import { baseBinanceApi } from './base'

/**
 * 币安基础 API 接口集合
 * 使用 RTK Query 注入端点
 */
const postsApi = baseBinanceApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * 获取现货K线数据
     * @param param.symbol - 交易对
     * @param param.interval - K线时间间隔 (1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M)
     * @param param.startTime - 开始时间戳
     * @param param.endTime - 结束时间戳
     * @param param.limit - 返回的数据条数，默认500，最大1000
     * @param param.timeZone - 时区设置，例如: "8"表示UTC+8, "-5:30"表示UTC-5:30，范围[-12:00 到 +14:00]
     * @returns K线数据数组
     */
    getKlineData: builder.query({
      query: (param) => ({
        url: `/api/v3/klines?symbol=${param.symbol}&interval=${param.interval}${param.startTime ? `&startTime=${param.startTime}` : ''}${param.endTime ? `&endTime=${param.endTime}` : ''}${param.limit ? `&limit=${param.limit}` : ''}${param.timeZone ? `&timeZone=${param.timeZone}` : ''}`,
        method: 'get',
      }),
    }),
    getExchangeInfo: builder.query({
      query: () => ({
        url: '/api/v3/exchangeInfo',
        method: 'get',
      }),
    }),
  }),
  overrideExisting: false,
})

/**
 * 导出基础 API hooks
 * 使用 Lazy 查询模式，只在需要时触发请求
 */
export const { useLazyGetKlineDataQuery, useLazyGetExchangeInfoQuery } = postsApi

export default postsApi

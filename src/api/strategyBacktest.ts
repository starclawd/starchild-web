import { backtestApi } from './base'

const postsApi = backtestApi.injectEndpoints({
  endpoints: (builder) => ({
    getStrategyBacktestData: builder.query({
      query: ({ strategyId }) => {
        return {
          url: `https://backtest-api-testnet-760098600eae.herokuapp.com/strategy/backtest/${strategyId}`,
          method: 'get',
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useGetStrategyBacktestDataQuery, useLazyGetStrategyBacktestDataQuery } = postsApi

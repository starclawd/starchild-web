import { orderlyApi } from './base'

export interface OrderlyAvailableSymbolsDataType {
  symbol: string
  quote_min: number
  quote_max: number
  quote_tick: number
  base_min: number
  base_max: number
  base_tick: number
  min_notional: number
  price_range: number
  price_scope: number
  std_liquidation_fee: number
  liquidator_fee: number
  claim_insurance_fund_discount: number
  funding_period: number
  cap_funding: number
  floor_funding: number
  interest_rate: number
  created_time: number
  updated_time: number
  base_mmr: number
  base_imr: number
  cap_ir: number
  floor_ir: number
  imr_factor: number
  liquidation_tier: number
  global_max_oi_cap: number
}

const orderlyApiEndpoints = orderlyApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrderlyAvailableSymbols: builder.query<{ rows: OrderlyAvailableSymbolsDataType[] }, void>({
      query: () => {
        return {
          url: `/v1/public/info`,
          method: 'GET',
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useGetOrderlyAvailableSymbolsQuery, useLazyGetOrderlyAvailableSymbolsQuery } = orderlyApiEndpoints
export default orderlyApiEndpoints

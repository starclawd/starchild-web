import { baseApi } from './baseHolominds'
import { SignalScannerAgent, SignalScannerListResponse, SignalScannerListParams } from 'store/agenthub/agenthub'

export type { SignalScannerAgent, SignalScannerListResponse, SignalScannerListParams }

const agentHubApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSignalScannerList: builder.query<SignalScannerListResponse, SignalScannerListParams>({
      async queryFn(params) {
        const { page = 1, pageSize = 20 } = params

        // Mock data
        const mockData: SignalScannerAgent[] = [
          {
            id: '1',
            title: 'Price Triggers',
            description:
              'Set alerts when tokens hit key price levels. Monitor breakouts, breakdowns, and support/resistance zones.',
            creator: 'Annabelle',
            usageCount: 231930,
            avatar: 'https://oss.woo.network/static/symbol_logo/WOO.png',
          },
          {
            id: '2',
            title: 'Technical Indicators',
            description:
              'Track RSI, MACD, MA, and more. Get notified when conditions match bullish or bearish signals.',
            creator: 'Jax',
            usageCount: 76534,
            avatar: 'https://oss.woo.network/static/symbol_logo/WOO.png',
          },
          {
            id: '3',
            title: 'Market Conditions',
            description:
              'Volume spikes, volatility Detect volatility spikes and momentum shifts. React instantly to abnormal volume, new...',
            creator: 'Vaughn',
            usageCount: 76100,
            avatar: 'https://oss.woo.network/static/symbol_logo/WOO.png',
          },
          {
            id: '4',
            title: 'Whale Tracker',
            description:
              'Follow smart money and whale activity. Get alerts when large wallets move or buy significant tokens.',
            creator: 'Marcellus',
            usageCount: 50008,
            avatar: 'https://oss.woo.network/static/symbol_logo/WOO.png',
          },
          {
            id: '5',
            title: 'On-chain Patterns',
            description:
              'Monitor wallet flows, gas activity, TVL changes. Catch early signs of accumulation or distribution.',
            creator: 'Ezekiel',
            usageCount: 49194,
            avatar: 'https://oss.woo.network/static/symbol_logo/WOO.png',
          },
          {
            id: '6',
            title: 'Sentiment Signals',
            description:
              'Track social media trends and narratives. React to viral mentions, Twitter trends, and sentiment shifts.',
            creator: 'Camden',
            usageCount: 43242,
            avatar: 'https://oss.woo.network/static/symbol_logo/WOO.png',
          },
          {
            id: '7',
            title: 'Sentiment Signals1',
            description:
              'Track social media trends and narratives. React to viral mentions, Twitter trends, and sentiment shifts.',
            creator: 'Camden',
            usageCount: 43243,
            avatar: 'https://oss.woo.network/static/symbol_logo/WOO.png',
          },
          {
            id: '8',
            title: 'Sentiment Signals2',
            description:
              'Track social media trends and narratives. React to viral mentions, Twitter trends, and sentiment shifts.',
            creator: 'Camden',
            usageCount: 43244,
            avatar: 'https://oss.woo.network/static/symbol_logo/WOO.png',
          },
        ]

        // Calculate pagination
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        const paginatedData = mockData.slice(startIndex, endIndex)

        // delay 1 second to simulate
        await new Promise((resolve) => setTimeout(resolve, 2000))

        return {
          data: {
            data: paginatedData,
            total: mockData.length,
            page,
            pageSize,
          },
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useGetSignalScannerListQuery, useLazyGetSignalScannerListQuery } = agentHubApi

export default agentHubApi

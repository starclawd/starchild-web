import { baseApi } from './baseHolominds'
import { SignalScannerAgent, SignalScannerListResponse, SignalScannerListParams } from 'store/agenthub/agenthub'

export type { SignalScannerAgent, SignalScannerListResponse, SignalScannerListParams }

// Mock data templates for random generation
const mockTitles = [
  'Price Triggers',
  'Technical Indicators',
  'Market Conditions',
  'Whale Tracker',
  'On-chain Patterns',
  'Sentiment Signals',
  'Volume Analysis',
  'Momentum Scanner',
  'Support Resistance',
  'Breakout Detector',
  'Trend Analysis',
  'Volatility Monitor',
  'Liquidity Tracker',
  'Arbitrage Scanner',
  'News Impact',
  'Social Sentiment',
  'Institutional Flow',
  'Retail Activity',
  'Cross-chain Signals',
  'DeFi Metrics',
]

const mockDescriptions = [
  'Set alerts when tokens hit key price levels. Monitor breakouts, breakdowns, and support/resistance zones.',
  'Track RSI, MACD, MA, and more. Get notified when conditions match bullish or bearish signals.',
  'Volume spikes, volatility Detect volatility spikes and momentum shifts. React instantly to abnormal volume, new...',
  'Follow smart money and whale activity. Get alerts when large wallets move or buy significant tokens.',
  'Monitor wallet flows, gas activity, TVL changes. Catch early signs of accumulation or distribution.',
  'Track social media trends and narratives. React to viral mentions, Twitter trends, and sentiment shifts.',
  'Analyze trading volume patterns and identify unusual activity that could signal price movements.',
  'Detect momentum shifts and trend reversals across multiple timeframes and indicators.',
  'Monitor key support and resistance levels with automatic alerting for potential breakouts.',
  'Identify breakout patterns and consolidation phases with real-time notifications.',
  'Comprehensive trend analysis using multiple technical indicators and market structure.',
  'Track volatility changes and identify periods of high or low market volatility.',
  'Monitor liquidity changes and identify potential liquidity events or market impacts.',
  'Scan for arbitrage opportunities across different exchanges and trading pairs.',
  'Track news events and their potential impact on cryptocurrency prices and market sentiment.',
  'Analyze social media sentiment and identify trending topics that could affect markets.',
  'Monitor institutional trading patterns and large order flows.',
  'Track retail investor behavior and identify crowd sentiment shifts.',
  'Monitor cross-chain transactions and identify opportunities across different blockchains.',
  'Track DeFi protocol metrics including TVL, yield rates, and protocol-specific indicators.',
]

const mockCreators = [
  'Annabelle',
  'Jax',
  'Vaughn',
  'Marcellus',
  'Ezekiel',
  'Camden',
  'Atlas',
  'Phoenix',
  'River',
  'Sage',
  'Nova',
  'Orion',
  'Luna',
  'Kai',
  'Zara',
  'Milo',
  'Aria',
  'Finn',
  'Lyra',
  'Axel',
]

// Helper function to get random item from array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

// Helper function to generate mock data based on page, pageSize and totalCount
const generateMockData = (page: number, pageSize: number, totalCount: number): SignalScannerAgent[] => {
  const data: SignalScannerAgent[] = []
  const startId = (page - 1) * pageSize + 1
  const endId = Math.min(startId + pageSize - 1, totalCount)

  // 如果起始ID已经超过总数，返回空数组
  if (startId > totalCount) {
    return []
  }

  for (let i = startId; i <= endId; i++) {
    const id = i.toString()
    data.push({
      id,
      title: getRandomItem(mockTitles),
      description: getRandomItem(mockDescriptions),
      creator: getRandomItem(mockCreators),
      subscriberCount: Number(i * 1000),
      subscribed: i % 3 === 0,
    })
  }

  return data
}

const agentHubApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSignalScannerList: builder.query<SignalScannerListResponse, SignalScannerListParams>({
      async queryFn(params) {
        const { page = 1, pageSize = 20 } = params

        // Total count for pagination (simulate a large dataset)
        const totalCount = 36 // Total available items (for testing load more)

        // Generate mock data based on page, pageSize and totalCount
        const mockData = generateMockData(page, pageSize, totalCount)

        // delay 1 second to simulate
        await new Promise((resolve) => setTimeout(resolve, 2000))

        return {
          data: {
            data: mockData,
            total: totalCount,
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

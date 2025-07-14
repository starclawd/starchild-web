import { AGENT_HUB_TYPE } from 'constants/agentHub'
import { AgentThreadInfo, AgentThreadInfoListParams } from 'store/agenthub/agenthub'

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

// Helper function to generate and filter mock data
export const generateAndFilterMockData = (
  page: number,
  pageSize: number,
  totalCount: number,
  filterString: string | undefined,
  filterType: string | undefined,
): { data: AgentThreadInfo[]; total: number } => {
  // Get all available agent types for random selection
  const allAgentTypes = Object.values(AGENT_HUB_TYPE)

  // Generate all available data first
  const allData: AgentThreadInfo[] = []

  if (filterType) {
    // If filterType is specified, only generate data for that type
    for (let i = 1; i <= totalCount; i++) {
      const title = getRandomItem(mockTitles)
      allData.push({
        threadId: i.toString(),
        title,
        description: getRandomItem(mockDescriptions),
        creator: getRandomItem(mockCreators),
        subscriberCount: Number(i * 1000),
        subscribed: i % 3 === 0,
        type: filterType,
      })
    }
  } else {
    // If no filterType, generate totalCount data for each agent type
    let threadIdCounter = 1
    for (const agentType of allAgentTypes) {
      for (let i = 1; i <= totalCount; i++) {
        const title = getRandomItem(mockTitles)
        allData.push({
          threadId: threadIdCounter.toString(),
          title,
          description: getRandomItem(mockDescriptions),
          creator: getRandomItem(mockCreators),
          subscriberCount: Number(threadIdCounter * 1000),
          subscribed: threadIdCounter % 3 === 0,
          type: agentType,
        })
        threadIdCounter++
      }
    }
  }

  // Filter by title if filterString is provided
  let filteredData = allData
  if (filterString) {
    filteredData = allData.filter((item) => item.title.toLowerCase().includes(filterString.toLowerCase()))
  }

  // Calculate pagination for filtered data
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize

  const data = filterType ? filteredData.slice(startIndex, endIndex) : filteredData
  const total = filterType ? totalCount : filteredData.length

  return {
    data,
    total,
  }
}

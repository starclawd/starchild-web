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
  `Highlight historical tweet impacts on price action and identify buy zones — spot influential voices, decode sentiment trends, and anticipate market reactions in real time. This feature analyzes how social media activity, particularly on platforms like Twitter (X), influences crypto asset price fluctuations. By tracing tweet timestamps against price charts, users can uncover repeating sentiment-driven patterns, assess the impact of specific influencers, and detect early signals of market-moving events. Gain insights into which keywords or topics historically preceded volatility, and use this data to build predictive models or enhance your entry and exit timing. Ideal for traders seeking an edge through behavioral data analytics.
By tracing tweet timestamps against price charts, users can uncover repeating sentiment-driven patterns, assess the impact of specific influencers, and detect early signals of market-moving events. Gain insights into which keywords or topics historically preceded volatility, and use this data to build predictive models or enhance your entry and exit timing. Ideal for traders seeking an edge through behavioral data analytics.`,
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

// Mock function to handle subscribe/unsubscribe
export const mockSubscribeToggle = (
  threadId: string,
  currentSubscribed: boolean,
): Promise<{ success: boolean; subscribed: boolean }> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        subscribed: !currentSubscribed,
      })
    }, 500)
  })
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
        recentChats: [
          {
            message: 'TEST1 message',
            triggerTime: 1715769600,
          },
          {
            message: 'TEST2 message',
            triggerTime: 1715769600,
          },
          {
            message: 'TEST3 message',
            triggerTime: 1715769600,
          },
        ],
        tags: ['TEST2', 'TEST3'],
        threadImageUrl: 'https://oss.woo.network/static/woox/WOO_network_share.jpg',
        tokenInfo: {
          symbol: 'WOO',
          fullName: 'WOO Network',
          description: 'WOO Network is a decentralized exchange protocol that allows users to trade tokens and assets.',
          price: '0.08653',
          pricePerChange: '0.0888',
          logoUrl: 'https://oss.woo.network/static/symbol_logo/WOO.png',
        },
        kolInfo: {
          name: 'CZ (Changpeng Zhao)',
          avatar: undefined,
          description: 'Monitor Binance-related updates, regulatory comments',
        },
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
          recentChats: [
            {
              message: `## JavaScript
\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
\`\`\`

## Python
\`\`\`python
def hello_world():
    print("Hello, World!")
    
hello_world()
\`\`\`

## CSS
\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\``,
              triggerTime: 1715769600,
            },
            {
              message: 'TEST2 message',
              triggerTime: 1715759600,
            },
            {
              message: 'TEST3 message',
              triggerTime: 1715749600,
            },
          ],
          tags: ['TEST1', 'TEST2', 'TEST3'],
          threadImageUrl: 'https://oss.woo.network/static/woox/WOO_network_share.jpg',
          tokenInfo: {
            symbol: 'WOO',
            fullName: 'WOO Network',
            description:
              'WOO Network is a decentralized exchange protocol that allows users to trade tokens and assets.',
            price: '0.08653',
            pricePerChange: '0.0888',
            logoUrl: 'https://oss.woo.network/static/symbol_logo/WOO.png',
          },
          kolInfo: {
            name: 'CZ (Changpeng Zhao)',
            avatar: undefined,
            description: 'Monitor Binance-related updates, regulatory comments',
          },
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

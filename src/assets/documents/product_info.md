# AI Trading Assistant - Product Manual

## Table of Contents
1. [Product Usage & Feature Introduction](#product-usage-feature-introduction)
2. [AI Agent Architecture Overview](#ai-agent-architecture-overview)
3. [Product Change Log](#product-change-log)

---

## Product Usage & Feature Introduction

### Welcome to Your AI Trading Assistant

Your AI Trading Assistant is an intelligent cryptocurrency trading companion that helps you navigate the complex world of digital assets with confidence. Designed for both beginners and experienced traders, our assistant combines advanced AI technology with real-time market data to provide you with comprehensive trading support.

### Core Features

#### 🤖 **Intelligent Conversation Management**
- **Natural Language Trading**: Simply tell the assistant what you want to do in plain English
- **Context-Aware Responses**: The assistant remembers your conversation history and preferences
- **Multi-Turn Conversations**: Ask follow-up questions and refine your requests naturally
- **Intent Recognition**: Automatically understands whether you want to trade, analyze, or get information

#### 💰 **Wallet Address Analysis & Position Management**
- **Manual Wallet Address Binding**: Users can manually add and manage their wallet addresses for analysis
  - Currently, the system does not provide automatic wallet creation or smart wallet management
  - Users need to provide their own wallet addresses (Solana, Ethereum, BSC, or Base networks)
  - Addresses can be added through Telegram or Web interface
- **Multi-Chain Support**: Analyze wallet addresses on Solana, Ethereum, BSC, and Base networks
- **Automatic Position Analysis**: Once addresses are bound, the system automatically analyzes wallet data and positions on Orderly/WooFi Network
  - Real-time position tracking and monitoring
  - Comprehensive portfolio overview with token balances and portfolio value
  - Detailed position analysis including PnL, leverage, and margin status
- **Order Recommendations**: Receive AI-powered order suggestions based on your positions and current market conditions
  - Personalized order parameter suggestions (price, quantity, order type)
  - Support for BRACKET, TRAILING_STOP, and STOP order types
  - Risk-adjusted recommendations considering your portfolio exposure
- **Position Risk Control Recommendations**: Get intelligent risk management suggestions for your current holdings
  - Position sizing recommendations
  - Stop-loss and take-profit level suggestions
  - Portfolio risk assessment and diversification advice
  - Margin and leverage risk warnings
- **Transaction History**: Track all trades and transfers associated with your wallet addresses

#### 📊 **Real-Time Market Intelligence & Technical Analysis**

**Technical Analysis (TA)**
- **Comprehensive TA Reports**: Human-level technical analysis combining multiple data sources
  - Spot market data and price action analysis
  - Technical indicators (RSI, MACD, Bollinger Bands, Moving Averages, etc.)
  - Futures metrics (Open Interest, Funding Rates, Long/Short Ratios)
  - Market structure and trend analysis
  - Support and resistance level identification
  - Entry/exit signal generation
- **Analysis Modes**:
  - **Full Mode**: Complete narrative combining market data, TA, futures metrics, macro context, risk management, and actionable insights
  - **Futures-Focused Mode**: Derivatives data (OI, funding rates, liquidations, liquidation heatmap, long/short ratio) as primary lens
  - **News-Focused Mode**: Explains moves mainly from catalysts, headlines, sentiment, and market psychology
- **Multi-Token Comparison**: Side-by-side comparison of multiple assets for momentum and strength/weakness analysis
- **Position-Integrated TA**: When analyzing wallet positions, TA is automatically merged with your live positions for profit-taking and risk management advice

**Liquidation Heatmap**
- **Visual Heatmap Generation**: Interactive liquidation cluster visualization
- **Support/Resistance Identification**: Identify potential support and resistance zones based on liquidation levels
- **Liquidation Cluster Analysis**: Analyze where large liquidations are likely to occur
- **Price Level Mapping**: Visual representation of liquidation concentrations at different price levels
- **Command Usage**: Use "heatmap [TOKEN]" or "show me [TOKEN] liquidation heatmap" to generate heatmaps

**Liquidity Analysis**
- **Order Book Depth Data**: Access comprehensive order book depth information
- **Liquidity Metrics**: Real-time liquidity metrics including bid/ask spreads, depth charts, and market depth analysis
- **Liquidity Visualization**: Visual representation of order book liquidity at different price levels
- **Market Impact Assessment**: Understand potential market impact of large orders
- **Command Usage**: Use "liquidity [TOKEN]" to get detailed liquidity analysis

**Market Data**
- **Real-Time Market Data**: Access to comprehensive market data from multiple sources
  - Spot prices and trading volumes
  - Futures data (perpetual and futures contracts)
  - Funding rates across exchanges
  - Open Interest (OI) metrics
  - Long/Short ratios
  - Trading volume and market cap data
- **Multi-Source Aggregation**: Data from DexScreener, CoinGecko, Binance API, and other major exchanges
- **Historical Data**: Access to historical price and volume data for trend analysis

**Market Analysis & Intelligence**
- **AI-Powered Insights**: Receive intelligent analysis on market trends, token performance, and market sentiment
- **News Integration**: Stay updated with the latest crypto news from CryptoPanic and other sources
- **Social Sentiment**: Twitter and social media sentiment analysis
- **Price Alerts**: Set up customizable notifications for price movements on your favorite tokens

#### 📈 **Project Deep Dive & Analysis**
- **Comprehensive Project Analysis**: Deep research and analysis of crypto projects using omni data queries
  - Project fundamentals and tokenomics analysis
  - Team and development activity assessment
  - Community growth and engagement metrics
  - Technology and protocol analysis
- **On-Chain Data Analysis**: Access comprehensive on-chain metrics and statistical analysis
  - Transaction volume and activity patterns
  - Holder distribution and whale movements
  - Smart contract interactions and protocol usage
  - Position analysis on Orderly/WooFi Network
  - Network growth and adoption metrics
- **Data-Driven Insights**: Professional analysis combining multiple data sources
  - Market data integration (price, volume, market cap)
  - On-chain metrics correlation
  - News and sentiment analysis
  - Risk assessment and opportunity identification
- **Multi-Token Comparison**: Side-by-side comparison of multiple assets
  - Momentum analysis across tokens
  - Strength/weakness relative comparison
  - Performance benchmarking
- **Market Lens Analysis**: Real-time market commentary and professional insights
  - Expert analysis on market movements
  - Contextual explanations of price actions
  - Market structure interpretation

#### 📈 **Advanced Trading Tools & Strategy Backtesting**

**Strategy Backtesting**
- **Comprehensive Backtesting System**: Test your trading strategies against historical data with real-time streaming updates
  - **Code Generation**: AI automatically generates backtesting code based on your strategy description
  - **Secure Execution**: Code runs in secure containers with isolated environments
  - **Parameter Support**: Configure commission fees, slippage, and order size parameters
  - **Real-Time Streaming**: Live updates via SSE (Server-Sent Events) during backtesting execution
  - **Advanced Visualization**: Chart generation for visualizing backtesting results
    - Performance curves and equity graphs
    - Drawdown analysis charts
    - Trade distribution visualizations
  - **Performance Metrics**: Comprehensive statistics including
    - Total return and annualized return
    - Sharpe ratio and Sortino ratio
    - Maximum drawdown and recovery time
    - Win rate and profit factor
    - Average trade duration
  - **Optimization Suggestions**: AI-powered recommendations for improving strategy performance
  - **Code Validation**: Automatic code validation using LLM to ensure strategy correctness

**Order Parameters Generation**
- **AI-Powered Order Optimization**: Intelligent order parameter suggestions for optimal trade execution
  - **Order Type Support**: BRACKET, TRAILING_STOP, and STOP order types
  - **Automatic Calculations**: Smart price and quantity calculations based on market conditions
  - **Risk Management Integration**: Recommendations consider your portfolio risk and exposure
  - **Market Condition Adaptation**: Parameters adjust based on volatility and liquidity
  - **Position-Aware Suggestions**: Recommendations tailored to your existing positions

**Risk Assessment & Performance Tracking**
- **Comprehensive Risk Metrics**: Understand the risk profile of your investments
  - Portfolio risk assessment
  - Position-level risk analysis
  - Correlation and diversification metrics
  - Value at Risk (VaR) calculations
- **Performance Tracking**: Monitor your trading performance over time
  - Detailed analytics and reporting
  - Performance attribution analysis
  - Trade history and statistics

#### 🤖 **Agent Marketplace & Custom Agents**
- **Agent Marketplace**: Browse and discover pre-built trading agents created by the community
- **Custom Agent Creation**: Create your own specialized trading agents with custom instructions
- **Agent Subscription**: Subscribe to agents that match your trading style and interests
- **Agent Categories**: Explore agents in categories like Indicator Hub, Strategy Lab, Signal Scanner, KOL Radar, Auto Briefing, Market Pulse, and Token Deep Dive
- **Agent Search**: Intelligent search and filtering to find the perfect agent for your needs

#### 🔍 **Deep Research & Intelligence**
- **Omni Data Query**: Access comprehensive on-chain and market data through unified query interface
- **Web Search Integration**: Advanced web search using multiple sources (Perplexity AI, Gemini, Grok, Tavily)
- **News Aggregation**: Real-time crypto news from CryptoPanic and other sources
- **Twitter Sentiment Analysis**: Analyze social media sentiment and trending topics
- **Trending Tokens**: Get insights on trending tokens and market movements
- **RootData Integration**: Access advanced token analytics and market intelligence

#### 🎯 **Smart Recommendations, Alerts & Automated Agents**

**Intelligent Recommendations**
- **Personalized Trading Recommendations**: Get AI-powered suggestions based on your preferences and conversation context
  - Token recommendations based on market analysis
  - Entry/exit point suggestions
  - Portfolio optimization recommendations

**Price Alerts & Notifications**
- **Customizable Price Alerts**: Set up alerts with multiple trigger conditions
  - Price threshold alerts (above/below specific levels)
  - Percentage change alerts
  - Volume spike notifications
- **Market Movement Notifications**: Receive alerts for significant market movements and token unlocks
- **KOL Tracking**: Monitor and get alerts from key opinion leaders in the crypto space

**Automated Agents**

**Signal Agents (24/7 Market Monitoring)**
- **Continuous Market Monitoring**: Agents that track market conditions 24/7 and send alerts
  - Real-time monitoring of market indicators
  - Price movement tracking and analysis
  - On-chain metrics monitoring
  - Technical indicator alerts
- **Automatic Trigger Execution**: Execute actions based on predefined conditions
  - Support for continuous monitoring mode (repeated triggers)
  - Support for one-time trigger mode (single execution)
  - Custom condition logic (price, volume, indicators, etc.)
- **Multi-Signal Support**: Monitor multiple conditions simultaneously
  - Price breakouts and breakdowns
  - Volume anomalies
  - Technical pattern recognition
  - On-chain event detection

**Summary Agents**
- **Automated Market Summaries**: Agents that provide regular market summaries and reports
  - **Daily/Weekly Market Briefings**: Automated market overview reports
  - **Portfolio Performance Summaries**: Regular updates on your portfolio performance
  - **Custom Report Generation**: Reports tailored to your preferences and interests
  - **Market Trend Summaries**: AI-generated insights on market movements
  - **Token Performance Reports**: Regular updates on tracked tokens

**Task Scheduler**
- **Automated Task Creation**: Create tasks that monitor and execute based on your criteria
  - Custom task descriptions and instructions
  - Flexible scheduling (interval-based or time-based)
  - Integration with agent marketplace for task templates

#### 🌐 **Multi-Language & Personalization**
- **Multi-Language Support**: Full support for multiple languages with automatic detection
- **User Preferences**: Customize your experience with language, style, timezone, and trading level settings
- **Long-term Memory**: The assistant remembers your preferences, trading patterns, and conversation history
- **Personalized Responses**: Get responses tailored to your experience level and trading style
- **Watchlist Management**: Maintain and manage your token watchlists with ease

#### 📱 **Telegram Integration**
- **Mobile Access**: Monitor your portfolio and interact with the assistant directly from Telegram
- **Instant Notifications**: Receive real-time alerts on your mobile device
- **Voice Messages**: Use voice messages to interact with your assistant (voice-to-text conversion)
- **Image Analysis**: Upload charts or screenshots for AI-powered analysis
- **Group Chat Support**: Use the assistant in group chats for collaborative trading discussions

### How to Get Started

#### Step 1: Initial Setup
1. Start a conversation with the AI assistant
2. Add your wallet address for position analysis (optional but recommended)
   - In Telegram: Reply with your wallet address, or use /preference → wallet management
   - In Web: /preference → wallet management → input address → save
3. The system will automatically analyze your wallet addresses and positions

#### Step 2: Basic Commands
- **Check Portfolio**: "Show me my portfolio" or "Analyze my positions on WooFi"
- **Get Token Info**: "Tell me about Bitcoin" or "What's the price of ETH?"
- **Technical Analysis**: "BTC technical analysis" or "Show me ETH liquidation heatmap"
- **Market Analysis**: "Analyze the current market trends" or "What's happening with DeFi tokens?"
- **Order Recommendations**: "Give me order suggestions for my ETH position" or "What orders should I place?"

#### Step 3: Advanced Features
- **Set Alerts**: "Alert me when Bitcoin drops below $40,000"
- **Backtest Strategies**: "Test a DCA strategy for ETH over the last 6 months"
- **Portfolio Optimization**: "How can I improve my portfolio's risk-return ratio?"
- **Liquidity Analysis**: "Show me BTC liquidity data" or "liquidity BTC"
- **Position Analysis**: "Analyze my positions" or "Check my wallet 0x..."
- **Create Custom Agents**: "Create an agent that monitors DeFi token launches 24/7"
- **Browse Agent Marketplace**: "Show me agents for technical analysis"
- **Deep Research**: "Research the latest developments in Solana ecosystem"

### Use Cases

#### For Beginners
- **Learning**: Ask questions about cryptocurrency concepts and get clear explanations
- **Safe Trading**: Start with small amounts and get guidance on best practices
- **Market Education**: Understand market trends and what drives price movements

#### For Experienced Traders
- **Advanced Analysis**: Get deep market insights and technical analysis
- **Strategy Testing**: Backtest complex trading strategies
- **Portfolio Management**: Optimize asset allocation and risk management
- **Automated Trading**: Set up rules-based trading strategies

#### For Investors
- **Research**: Get comprehensive analysis on potential investments
- **Risk Management**: Understand and manage portfolio risk
- **Performance Tracking**: Monitor investment performance across multiple assets
- **Market Timing**: Get insights on optimal entry and exit points

### Safety & Security

- **Non-Custodial**: You maintain full control of your private keys
- **Encrypted Storage**: All sensitive data is encrypted using industry-standard methods
- **Transaction Verification**: All trades are confirmed before execution
- **Risk Warnings**: The assistant provides warnings for high-risk operations

---

## AI Agent Architecture Overview

### Understanding Your AI Trading Assistant

Your AI Trading Assistant is built on a sophisticated multi-agent architecture that works like a team of specialized experts, each handling different aspects of your trading needs. Think of it as having a personal trading desk with specialists for analysis, execution, and portfolio management.

### System Architecture Framework

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              User Interface Layer                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│  📱 Telegram Bot    💬 Natural Language    🎤 Voice Commands    🖼️ Image Upload │
└─────────────────────────┬───────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────────────────────┐
│                         AI Agent Coordination Layer                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                    🧠 Planning Agent (Coordinator)                             │
│                         ↓ Intent Analysis & Workflow Coordination              │
├─────────────────────────────────────────────────────────────────────────────────┤
│  📊 Analysis Agent  💱 Trading Agent  🔄 Transfer Agent  📈 Backtest Agent  🖼️ Image Agent │
│  (Market Research)  (Execution)      (Portfolio Mgmt)  (Strategy Test)    (Chart Reader) │
└─────────────────────────┬───────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────────────────────┐
│                        Data Sources & Services Layer                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🌐 Market Data Providers              📰 Information Sources                   │
│  ├─ DexScreener                        ├─ CryptoPanic                          │
│  ├─ CoinGecko                          ├─ Perplexity AI                        │
│  ├─ Binance API                        ├─ Twitter API                          │
│  └─ Moralis                            └─ Tavily Search                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🔗 Blockchain Infrastructure          🛠️ MCP Specialized Services             │
│  ├─ Solana RPC                         ├─ Backtesting Service                  │
│  ├─ Ethereum RPC                       ├─ Chart Generation                     │
│  ├─ BSC RPC                            └─ Risk Assessment                      │
│  └─ Base RPC                                                                   │
└─────────────────────────┬───────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────────────────────┐
│                        Execution & Storage Layer                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│  💰 Wallet Management    📊 Data Storage         🔒 Security Module             │
│  ├─ Multi-chain Wallets  ├─ User Context         ├─ Encrypted Storage           │
│  ├─ Private Key Mgmt     ├─ Transaction History  ├─ Audit Logs                 │
│  └─ Trade Execution      └─ Portfolio Data       └─ Risk Controls               │
└─────────────────────────────────────────────────────────────────────────────────┘

Data Flow:
User Request → Planning Agent → Specialized Agents → Data Sources/Services → Execution Layer → User Feedback
```

### Agent Collaboration Workflow

```
User Input: "I want to buy some Bitcoin"
    │
    ▼
┌─────────────────────┐
│   🧠 Planning Agent │ ──► Analyze user intent
│   Intent & Planning │ ──► Generate workflow
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   📊 Analysis Agent │────►│   💱 Trading Agent  │────►│   🔄 Transfer Agent │
│   Get BTC market    │     │   Calculate optimal │     │   Execute trade &   │
│   information       │     │   execution strategy│     │   monitor           │
│   ├─ Current price  │     │   ├─ Price discovery│     │   ├─ Trade confirm  │
│   ├─ Market trends  │     │   ├─ Slippage calc  │     │   ├─ Status update  │
│   └─ Risk assessment│     │   └─ Route optimize │     │   └─ Result feedback│
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
          │                           │                           │
          ▼                           ▼                           ▼
    Real-time Market Data        DEX/CEX Interfaces          Blockchain Networks
```

### Core Architecture Components

#### 🧠 **The Planning Agent (Your Trading Coordinator)**
The Planning Agent acts as your personal trading coordinator, analyzing what you want to accomplish and directing the right specialists to help you. When you say "I want to buy some Bitcoin," the Planning Agent understands your intent and coordinates with the appropriate agents to make it happen.

**What it does:**
- Understands your requests in natural language
- Decides which specialists need to be involved
- Coordinates the workflow between different agents
- Ensures your requests are handled efficiently

#### 📊 **The Analysis Agent (Your Market Research Team)**
This agent is like having a dedicated research team that monitors markets 24/7. It gathers information from multiple sources to provide you with comprehensive market insights.

**Data Sources:**
- **Real-time Market Data**: Live prices and trading volumes from major exchanges
- **News Aggregation**: Latest cryptocurrency news from trusted sources
- **Social Sentiment**: Twitter and social media sentiment analysis
- **Technical Analysis**: Chart patterns and trading indicators
- **On-chain Data**: Blockchain transaction data and metrics

#### 💱 **The Trading Agent (Your Execution Specialist)**
When you're ready to make a trade, the Trading Agent handles the technical execution across multiple blockchain networks.

**Capabilities:**
- **Multi-chain Execution**: Trades on Solana, Ethereum, BSC, and Base
- **Best Price Discovery**: Finds optimal rates across decentralized exchanges
- **Smart Routing**: Automatically routes trades for minimal fees and slippage
- **Transaction Management**: Handles all the technical details of blockchain transactions

#### 🔄 **The Transfer Agent (Your Portfolio Manager)**
This specialist handles moving your assets between wallets and managing your portfolio structure.

**Functions:**
- **Secure Transfers**: Safely move tokens between addresses
- **Portfolio Rebalancing**: Help optimize your asset allocation
- **Multi-wallet Management**: Coordinate assets across different wallets
- **Transaction Tracking**: Monitor all portfolio movements

#### 📈 **The Backtesting Agent (Your Strategy Analyst)**
This agent helps you test and refine your trading strategies using historical data.

**Features:**
- **Strategy Simulation**: Test how your strategies would have performed historically
- **Risk Analysis**: Understand potential drawdowns and volatility
- **Performance Metrics**: Get detailed statistics on strategy effectiveness
- **Optimization Suggestions**: Recommendations for improving your approach

#### 🖼️ **The Image Analysis Agent (Your Chart Reader)**
This specialized agent can analyze charts, screenshots, and visual content to provide insights.

**Capabilities:**
- **Chart Analysis**: Interpret technical analysis charts and patterns
- **Visual Content Understanding**: Analyze screenshots of trading platforms
- **Pattern Recognition**: Identify trends and formations in visual data
- **Educational Support**: Explain what you're seeing in charts and graphs

### External Data Sources & Integrations

#### 🌐 **Market Data Providers**
- **DexScreener**: Real-time DEX trading data and analytics
- **CoinGecko**: Comprehensive cryptocurrency market data
- **Binance API**: Live trading data from the world's largest exchange
- **Moralis**: Multi-chain blockchain data and analytics

#### 📰 **Information Sources**
- **CryptoPanic**: Aggregated cryptocurrency news and sentiment
- **Perplexity AI**: Advanced web search and information synthesis
- **Perplexity News**: Specialized crypto news aggregation
- **Gemini Search API**: Google's AI-powered search capabilities
- **Grok Search API**: X.AI's advanced search and analysis
- **Twitter API**: Social sentiment and trending topics
- **Tavily Search**: Real-time web search capabilities
- **RootData**: Advanced token analytics and market intelligence
- **Lunar Crash**: Token analysis and market insights

#### 🔗 **Blockchain Infrastructure**
- **Solana RPC**: Direct connection to Solana blockchain
- **Ethereum RPC**: Access to Ethereum network
- **BSC RPC**: Binance Smart Chain connectivity
- **Base RPC**: Coinbase's Layer 2 solution

#### 🛠️ **MCP (Model Context Protocol) Integrations**
The system uses MCP to connect with specialized services:
- **Backtesting Service**: Dedicated infrastructure for strategy testing with code execution
- **Chart Generation**: Automated K-line chart creation and technical analysis visualization
- **Risk Assessment**: Specialized risk calculation engines
- **Wallet MCP**: Natural language wallet operations (transfer, bridge, swap)
- **Omni Data Service**: Unified data query interface for on-chain and market data

### How It All Works Together

#### 1. **Request Processing**
When you make a request, the Planning Agent analyzes your intent and creates a workflow involving the appropriate specialists.

#### 2. **Information Gathering**
The Analysis Agent gathers relevant market data, news, and context from multiple sources to inform decision-making.

#### 3. **Execution Planning**
The Trading Agent calculates optimal execution strategies, considering factors like slippage, fees, and market conditions.

#### 4. **Risk Assessment**
Before any trade, the system evaluates risks and provides warnings for potentially dangerous operations.

#### 5. **Execution & Monitoring**
Once approved, trades are executed and monitored, with real-time updates provided throughout the process.

### Trust & Transparency Features

#### 🔒 **Security Measures**
- **Non-custodial Design**: You maintain control of your private keys
- **Encrypted Communications**: All data transmission is encrypted
- **Audit Trails**: Complete logs of all operations and decisions
- **Multi-signature Support**: Enhanced security for large transactions

#### 🔍 **Transparency**
- **Decision Explanations**: The system explains why it makes specific recommendations
- **Source Attribution**: All information is traced back to its original source
- **Performance Tracking**: Complete history of recommendations and outcomes
- **Open Architecture**: Built on open-source principles where possible

#### ⚡ **Reliability**
- **Redundant Data Sources**: Multiple sources for critical information
- **Failover Systems**: Backup systems ensure continuous operation
- **Real-time Monitoring**: Continuous health checks and performance monitoring
- **Error Recovery**: Automatic recovery from temporary failures

This architecture ensures that you have access to institutional-grade trading capabilities while maintaining the simplicity and accessibility that individual traders need.

---

## Product Change Log

### 2025-11-10 | Automated GitHub Issue Workflow
- **Automated Issue Creation**: Introduced a GitHub issue client that automatically files issues from user feedback and system errors.
- **Integrated Reporting Flows**: Feedback submissions and error notifications now raise GitHub issues for faster triage and follow-up.
- **Configuration Guides**: Added `.env` examples, quickstart notes, and comprehensive docs for enabling GitHub automation.
- **Developer Tooling**: Published reference scripts demonstrating how to trigger and test the automated issue pipeline.

### 2025-11-06 | Deep Think v2.2 & Wallet MCP Expansion
- **Deep Think with Source List**: Added real-time source attribution across deep think workflows for transparent reasoning.
- **Notification Overhaul**: Integrated LiFi proxy, news triggers, token unlock alerts, and richer Twitter monitoring.
- **Wallet MCP Enhancements**: Delivered natural-language wallet operations with unsigned transaction previews and signing support.
- **Cross-Platform Upgrades**: Released deep think visualization on web, CoinGecko K-line charts, and mobile WebSocket balance updates.
- **Agent Automation**: Improved auto task updates, scheduling reliability, and execution reporting.

### 2025-10-29 | v1.2 Experience Polishing
- **Agent Marketplace UX**: Simplified menus, categories, and agent discovery flows.
- **Guided Onboarding**: Added use case documentation and wallet connection walkthroughs.
- **Web Navigation**: Refreshed site structure for faster access to agents and alerts.
- **Operational Readiness**: Expanded CS bot coverage and internal benchmarking suites.

### 2025-10-22 | v1.1 Accessibility & Insights
- **Open Access**: Removed whitelist requirements while enforcing usage guardrails.
- **Preference Safety**: Blocked preference changes inside group chats.
- **Web Analytics**: Rolled out K-line, heatmap, and liquidity visualizations on the web.
- **Contextual Intelligence**: Boosted reflective responses and order suggestions tied to trading history.

### 2025-10-15 | v1.0 General Availability
- **Reporting Improvements**: Switched bug reporting to `/bug` and fixed markdown rendering quirks.
- **Alert Shareability**: Added agent links to forwarded alerts for easier subscriptions.
- **Agent Editing**: Enabled web editing flows for faster agent iteration.
- **Wallet Management**: Expanded onboarding and monitoring for early wallet adopters.

### 2025-10-08 | Early Release Enhancements
- **Social Attribution**: Added original Twitter links to alerts for better context.
- **Web Feature Drops**: Delivered K-line and heatmap charts plus smarter daily summaries.
- **Wallet Lifecycle**: Strengthened wallet management routines.
- **Automation Foundations**: Planned self-learning, debugging, and auto-deploy tooling.

### 2025-09-24 | Beta Release Expansion
- **Advanced Charting**: Introduced TA, heatmap, and liquidity chart commands in Telegram.
- **Wallet Analytics**: Enabled Orderly wallet risk alerts and position analysis.
- **Website Integration**: Linked Telegram “My Agent” to web dashboards.
- **Access Controls**: Restricted bot invitations to curated groups during beta.

### 2025-06-02 | Agent Marketplace and Advanced Features
- **Agent Marketplace**: Launched comprehensive agent marketplace with browsing, search, and subscription capabilities
- **Custom Agent Creation**: Users can now create and manage their own specialized trading agents
- **Agent Categories**: Introduced 7 agent categories (Indicator Hub, Strategy Lab, Signal Scanner, KOL Radar, Auto Briefing, Market Pulse, Token Deep Dive)
- **Enhanced Search**: Improved agent search with keyword matching and semantic search capabilities
- **Task Scheduler Enhancements**: Added condition modes and trigger history tracking for better task management

### 2025-06-01 | Task Management and Monitoring Improvements
- **Task Configuration**: Enhanced task system with extra_config JSONB support for flexible configuration
- **Condition Modes**: Added support for continuous and one-time trigger modes
- **Trigger History**: Comprehensive tracking of task trigger history with user association
- **Better Monitoring**: Improved task execution monitoring and error handling

### 2025-05-20 | Enhanced Product Documentation and Roadmap Updates
- **Improved Documentation**: Updated comprehensive roadmap with structured Q2-Q4 objectives
- **Enhanced Clarity**: Refined core capabilities descriptions and user experience documentation
- **Strategic Planning**: Added detailed mid to long-term development roadmap

### 2025-05-10 | Token Transfer Functionality Launch
- **New Feature**: Enabled comprehensive token transfer capabilities across all supported chains
- **Enhanced Portfolio Management**: Users can now easily transfer tokens between wallets and addresses
- **Improved User Experience**: Streamlined transfer process with better error handling and confirmations

### 2025-05-01 | Backtesting Infrastructure Improvements
- **Performance Enhancement**: Optimized backtest script runner host configuration for faster processing
- **Reliability Upgrade**: Improved monitoring service stability and error handling
- **Better Analytics**: Enhanced backtesting result visualization and reporting

### 2025-04-28 | Advanced Backtesting Features
- **Real-time Streaming**: Implemented Server-Sent Events (SSE) for live backtesting updates
- **Enhanced Visualization**: Added advanced chart generation for backtesting results
- **Improved Status Tracking**: Better status field management in backtesting stream responses
- **Asynchronous Processing**: Optimized chart drawing functions for better performance

### 2025-04-26 | Strategic Roadmap Development
- **Long-term Vision**: Published comprehensive mid to long-term roadmap
- **Core Capabilities**: Outlined key development priorities for enhanced user experience
- **Feature Planning**: Detailed upcoming enhancements and new functionality rollouts

### 2025-04-25 | Major Code Refactoring and Notification System
- **Code Optimization**: Comprehensive refactoring for improved performance and maintainability
- **Enhanced Notifications**: Upgraded notification system with better chat integration
- **Improved Architecture**: Streamlined agent communication and workflow management
- **Better Error Handling**: Enhanced error recovery and user feedback mechanisms

### 2025-04-24 | User Experience and Memory Enhancements
- **Smart Memory System**: Implemented advanced user context and preference memory
- **Concise Responses**: Added intelligent response length control for better user experience
- **Personalization**: Enhanced agent ability to remember user preferences and trading patterns
- **Improved Prompts**: Optimized system prompts for more accurate and helpful responses

### Earlier Development Milestones

#### Multi-Agent Architecture Foundation
- **Intelligent Agent System**: Built sophisticated multi-agent architecture with specialized trading agents
- **Natural Language Processing**: Implemented advanced intent recognition and conversation management
- **Multi-chain Support**: Added comprehensive support for Solana, Ethereum, BSC, and Base networks

#### Core Trading Features
- **Smart Trading Engine**: Developed intelligent swap and trading execution system
- **Portfolio Management**: Created comprehensive wallet and portfolio tracking capabilities
- **Real-time Data Integration**: Integrated multiple market data sources for accurate pricing and analysis

#### Security & Infrastructure
- **Secure Wallet Management**: Implemented non-custodial wallet system with encrypted key storage
- **API Integrations**: Connected to major exchanges and data providers for comprehensive market coverage
- **Telegram Bot**: Launched mobile-friendly Telegram interface for on-the-go trading

#### Advanced Analytics
- **Market Analysis Engine**: Built comprehensive market analysis and sentiment tracking system
- **Technical Analysis**: Integrated advanced charting and technical indicator analysis
- **Risk Management**: Implemented sophisticated risk assessment and portfolio optimization tools

---

*This manual is regularly updated to reflect the latest features and improvements. For technical support or questions, please refer to our documentation or contact our support team.*

**Version**: 2.2.0  
**Last Updated**: November 2025  
**Compatibility**: All supported blockchain networks (Solana, Ethereum, BSC, Base) 

---

## Upcoming Features (Roadmap)

### 🚀 **Planned for Future Release**

#### ⚡ **One-Click Trading**
- **Smart Swaps**: Execute token swaps with simple voice or text commands
- **Transfer Tokens**: Send cryptocurrencies to any address effortlessly
- **Best Price Finding**: Automatically finds the best rates across multiple exchanges
- **Slippage Protection**: Built-in safeguards to protect against unfavorable price movements

#### 🎤 **Voice Trading**
- **Voice Commands**: Execute trades using natural voice commands
- **Voice-Activated Analysis**: Get market insights through voice interactions
- **Hands-Free Trading**: Complete trading operations without typing

#### 💼 **AI as Fund Manager**
- **Automated Portfolio Management**: AI-powered fund management with automatic rebalancing
- **Strategic Asset Allocation**: Intelligent portfolio optimization based on market conditions
- **Performance-Based Management**: AI-driven trading decisions to maximize returns
- **Risk-Adjusted Strategies**: Advanced risk management with automated position sizing

*These features are currently in development and will be released in future updates. Stay tuned for announcements!*

---

## Frequently Asked Questions (FAQ)

### Q: What is the AI Trading Assistant?
A: The AI Trading Assistant is an intelligent cryptocurrency trading companion that combines advanced AI technology with real-time market data to provide comprehensive trading support for both beginners and experienced traders.

### Q: What blockchain networks does the assistant support?
A: The assistant supports Solana, Ethereum, BSC (Binance Smart Chain), and Base networks for multi-chain trading and portfolio management.

### Q: How does the Agent Marketplace work?
A: The Agent Marketplace allows you to browse, search, and subscribe to pre-built trading agents created by the community. You can filter by category, search by keywords, and discover agents that match your trading style. You can also create your own custom agents with specific instructions.

### Q: What are the different agent categories?
A: The marketplace includes 7 categories: **Indicator Hub** (technical indicators and signals), **Strategy Lab** (trading strategies), **Signal Scanner** (market signals), **KOL Radar** (influencer tracking), **Auto Briefing** (automated market reports), **Market Pulse** (market sentiment), and **Token Deep Dive** (token analysis).

### Q: How does the conversation system work?
A: The assistant uses natural language processing to understand your requests in plain English, remembers conversation history, supports multi-turn conversations, and automatically recognizes whether you want to trade, analyze, or get information.

### Q: What trading features are available?
A: Currently available features include: technical analysis (TA) with liquidation heatmap, liquidity analysis, market data access, project deep dive analysis, strategy backtesting with real-time streaming, wallet position analysis, order recommendations, 24/7 signal agents, and summary agents. One-click trading, voice trading, and AI fund management features are planned for future release.

### Q: How does wallet management work?
A: The system does not provide automatic wallet creation or smart wallet management. You need to manually add your wallet addresses through the preference settings (Telegram or Web interface). Once addresses are bound, the system automatically analyzes your wallet data and positions on Orderly/WooFi Network, providing:
- Real-time position tracking and monitoring
- Order recommendations based on your positions and market conditions
- Position risk control suggestions (stop-loss, take-profit, position sizing)
- Portfolio overview and performance analysis

### Q: How does the Telegram integration work?
A: You can monitor your portfolio directly from Telegram, receive real-time alerts on your mobile device, use voice messages for interaction, upload charts or screenshots for AI-powered analysis, and use the assistant in group chats.

### Q: What is the multi-agent architecture?
A: The system uses specialized AI agents including a Planning Agent (coordinator), Analysis Agent (market research), Trading Agent (execution), Transfer Agent (portfolio management), Backtesting Agent (strategy testing), and Image Analysis Agent (chart reading).

### Q: How does backtesting work?
A: The Backtesting Agent helps you test trading strategies against historical data with real-time streaming updates. It provides strategy simulation, risk analysis, performance metrics, and optimization suggestions. The system supports code generation and execution in secure containers.

### Q: What data sources does the assistant use?
A: The assistant integrates with DexScreener, CoinGecko, Binance API, Moralis, and RootData for market data; CryptoPanic, Perplexity AI, Gemini Search, Grok Search, Twitter API, and Tavily Search for information; and direct RPC connections to blockchain networks.

### Q: How secure is the system?
A: The system is non-custodial (you control your private keys), uses encrypted storage, provides transaction verification, offers risk warnings, and includes audit trails and multi-signature support for enhanced security.

### Q: Can I customize the assistant's behavior?
A: Yes! You can customize language, response style, timezone, trading level, and create custom agents with specific instructions. The assistant also learns from your preferences and conversation history.

### Q: What are the use cases for different user types?
A: For beginners: learning, safe trading, and market education. For experienced traders: advanced analysis, strategy testing, portfolio management, and automated trading. For investors: research, risk management, performance tracking, and market timing insights. 
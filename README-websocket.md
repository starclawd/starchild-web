# WebSocket 封装使用指南

本项目对 `react-use-websocket` 库进行了封装，提供了更便捷的 WebSocket 连接和数据订阅功能。以下是使用指南。

## 基本概念

- **WebSocket 连接**: 通过 `useWebSocketConnection` 创建和管理 WebSocket 连接
- **数据订阅**: 通过专用 hooks 订阅特定类型的数据流
- **多通道订阅**: 支持同时订阅多个数据通道

## 核心 Hooks

### 1. 基础连接 Hook

```tsx
import { useWebSocketConnection } from 'src/store/websocket/hooks'

const MyComponent = () => {
  const { sendMessage, lastMessage, isOpen } = useWebSocketConnection()

  // 使用 sendMessage 发送消息
  // 通过 lastMessage 获取最新消息
  // isOpen 判断连接是否建立
}
```

### 2. K线数据订阅

```tsx
import { useKlineSubscription } from 'src/store/websocket/hooks'

const MyComponent = () => {
  const { klineData } = useKlineSubscription({
    symbol: 'btcusdt', // 交易对
    interval: '1m', // 时间间隔
  })

  // klineData 包含最新的 K线数据
}
```

### 3. 交易数据订阅

```tsx
import { useTradeSubscription } from 'src/store/websocket/hooks'

const MyComponent = () => {
  const { data: tradeData } = useTradeSubscription('btcusdt')

  // tradeData 包含最新的交易数据
}
```

### 4. 行情数据订阅

```tsx
import { useTickerSubscription } from 'src/store/websocket/hooks'

const MyComponent = () => {
  const { data: tickerData } = useTickerSubscription('btcusdt')

  // tickerData 包含 24 小时行情数据
}
```

### 5. 深度数据订阅

```tsx
import { useDepthSubscription } from 'src/store/websocket/hooks'

const MyComponent = () => {
  const { data: depthData } = useDepthSubscription('btcusdt', 20)

  // depthData 包含市场深度数据，默认 20 档
}
```

### 6. 通用订阅

```tsx
import { useWebSocketSubscription } from 'src/store/websocket/hooks'

const MyComponent = () => {
  const { data } = useWebSocketSubscription('btcusdt@bookTicker')

  // 订阅任意类型的频道
}
```

### 7. 多频道订阅

```tsx
import { useMultiChannelSubscription } from 'src/store/websocket/hooks'

const MyComponent = () => {
  const { dataMap } = useMultiChannelSubscription(['btcusdt@trade', 'ethusdt@trade', 'bnbusdt@trade'])

  // dataMap 包含所有频道的最新数据
  // 格式: { 'btcusdt@trade': { ... }, 'ethusdt@trade': { ... } }
}
```

## 工具函数

`src/store/websocket/utils.ts` 文件提供了多种工具函数：

```tsx
import {
  formatKlineChannel,
  formatTradeChannel,
  formatTickerChannel,
  formatDepthChannel,
  createSubscribeMessage,
  createUnsubscribeMessage,
} from 'src/store/websocket/utils'

// 格式化频道名称
const klineChannel = formatKlineChannel('btcusdt', '1m')
const tradeChannel = formatTradeChannel('btcusdt')

// 创建订阅/取消订阅消息
const subMsg = createSubscribeMessage(klineChannel)
const unsubMsg = createUnsubscribeMessage(klineChannel)
```

## 完整示例

查看 `src/components/WebSocketExample.tsx` 文件，了解如何在组件中使用这些 hooks。

## 注意事项

1. 所有 hooks 在组件卸载时会自动取消订阅
2. 连接断开时会自动重连
3. 可通过 Redux DevTools 查看连接状态
4. 使用 TypeScript 类型可获得更好的代码提示

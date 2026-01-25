---
name: websocket
description: WebSocket 使用规则。当需要处理 WebSocket 连接、实时数据订阅、K线数据时使用此技能。
---

# WebSocket 使用规则

> 详细文档：[README-websocket.md](../../../README-websocket.md)

## Hooks 位置

```
src/store/websocket/
├── hooks.tsx   # WebSocket Hooks
└── utils.ts    # 工具函数
```

## 核心 Hooks

### 基础连接

```typescript
import { useWebSocketConnection } from 'src/store/websocket/hooks'

const { sendMessage, lastMessage, isOpen } = useWebSocketConnection()
```

### K线数据

```typescript
import { useKlineSubscription } from 'src/store/websocket/hooks'

const { klineData } = useKlineSubscription({
  symbol: 'btcusdt',
  interval: '1m',
})
```

### 交易数据

```typescript
import { useTradeSubscription } from 'src/store/websocket/hooks'

const { data: tradeData } = useTradeSubscription('btcusdt')
```

### 行情数据

```typescript
import { useTickerSubscription } from 'src/store/websocket/hooks'

const { data: tickerData } = useTickerSubscription('btcusdt')
```

### 深度数据

```typescript
import { useDepthSubscription } from 'src/store/websocket/hooks'

const { data: depthData } = useDepthSubscription('btcusdt', 20)
```

### 通用订阅

```typescript
import { useWebSocketSubscription } from 'src/store/websocket/hooks'

const { data } = useWebSocketSubscription('btcusdt@bookTicker')
```

### 多频道订阅

```typescript
import { useMultiChannelSubscription } from 'src/store/websocket/hooks'

const { dataMap } = useMultiChannelSubscription([
  'btcusdt@trade',
  'ethusdt@trade',
])
// dataMap: { 'btcusdt@trade': {...}, 'ethusdt@trade': {...} }
```

## 工具函数

```typescript
import {
  formatKlineChannel,
  formatTradeChannel,
  formatTickerChannel,
  formatDepthChannel,
  createSubscribeMessage,
  createUnsubscribeMessage,
} from 'src/store/websocket/utils'

const klineChannel = formatKlineChannel('btcusdt', '1m')
const subMsg = createSubscribeMessage(klineChannel)
```

## ⚠️ 注意事项

1. 组件卸载时自动取消订阅
2. 连接断开时自动重连
3. 可通过 Redux DevTools 查看连接状态

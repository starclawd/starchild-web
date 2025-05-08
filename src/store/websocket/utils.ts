/**
 * 定义 WebSocket 消息类型接口
 */
export interface WebSocketMessage<T = any> {
  stream?: string;
  data?: T;
  id?: number;
  result?: any;
  error?: any;
}

/**
 * K线数据接口
 */
export interface KlineData {
  e: string; // 事件类型
  E: number; // 事件时间
  s: string; // 交易对
  k: {
    t: number; // 开盘时间
    T: number; // 收盘时间
    s: string; // 交易对
    i: string; // 间隔
    f: number; // 第一笔成交ID
    L: number; // 最后一笔成交ID
    o: string; // 开盘价
    c: string; // 收盘价
    h: string; // 最高价
    l: string; // 最低价
    v: string; // 成交量
    n: number; // 成交笔数
    x: boolean; // 是否完结
    q: string; // 成交额
    V: string; // 主动买入成交量
    Q: string; // 主动买入成交额
    B: string; // 忽略
  };
}

/**
 * 解析 WebSocket 消息数据
 * @param message 原始消息对象
 * @returns 解析后的消息数据
 */
export function parseWebSocketMessage<T = any>(message: MessageEvent): WebSocketMessage<T> | null {
  try {
    return JSON.parse(message.data);
  } catch (error) {
    return null;
  }
}

/**
 * 创建订阅消息
 * @param channel 频道名称
 * @param id 消息ID
 * @returns 格式化的订阅消息
 */
export function createSubscribeMessage(channel: string | string[], id: number = Date.now()): string {
  const params = Array.isArray(channel) ? channel : [channel];
  return JSON.stringify({
    method: 'SUBSCRIBE',
    params,
    id
  });
}

/**
 * 创建取消订阅消息
 * @param channel 频道名称
 * @param id 消息ID
 * @returns 格式化的取消订阅消息
 */
export function createUnsubscribeMessage(channel: string | string[], id: number = Date.now()): string {
  const params = Array.isArray(channel) ? channel : [channel];
  return JSON.stringify({
    method: 'UNSUBSCRIBE',
    params,
    id
  });
}

/**
 * 格式化 K线消息频道名称
 * @param symbol 交易对
 * @param interval 时间间隔
 * @param timeZone 可选的时区参数，例如 "+8" 或 "+08:00"
 * @returns 格式化的频道名称
 */
export function formatKlineChannel(symbol: string, interval: string, timeZone?: string): string {
  // 基础频道名称
  let channelName = `${symbol.toLowerCase()}@kline_${interval}`;
  
  // 如果提供了时区，添加到频道名称中，格式：<symbol>@kline_<interval>@+08:00
  if (timeZone) {
    // 确保时区格式正确 (例如 +08:00)
    let formattedTimeZone = timeZone;
    
    // 如果时区是一个数字或者只有小时部分，添加适当的格式
    if (/^[+-]?\d+$/.test(timeZone)) {
      // 只有小时，转换为 +HH:00 格式
      const hours = parseInt(timeZone.replace(/[^0-9]/g, ''), 10);
      const sign = timeZone.startsWith('-') ? '-' : '+';
      formattedTimeZone = `${sign}${hours < 10 ? '0' : ''}${hours}:00`;
    } else if (/^[+-]\d+:\d+$/.test(timeZone)) {
      // 已经是 +HH:MM 格式，确保小时部分是两位数
      const parts = timeZone.split(':');
      const hours = parseInt(parts[0].replace(/[^0-9]/g, ''), 10);
      const sign = timeZone.startsWith('-') ? '-' : '+';
      formattedTimeZone = `${sign}${hours < 10 ? '0' : ''}${hours}:${parts[1]}`;
    }
    
    // 添加时区到频道名
    channelName += `@${formattedTimeZone}`;
  }
  
  return channelName;
}

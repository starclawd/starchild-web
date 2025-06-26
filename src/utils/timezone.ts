/**
 * 将时区转换为币安API格式
 * @param timezone - 时区字符串，例如 'Asia/Shanghai'
 * @returns 币安API格式的时区偏移量，例如 '8' 或 '-5'
 */
export const convertToBinanceTimeZone = (timezone?: string, isForWebSocket: boolean = false): string => {
  try {
    if (!timezone) return '0'; // 没有时区时返回UTC
    
    // 获取指定时区的当前偏移量（分钟）
    const date = new Date();
    
    // 创建指定时区的日期时间格式化器
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'longOffset'
    });
    
    // 获取时区偏移信息
    const timeZoneParts = formatter.formatToParts(date);
    const timeZoneOffsetPart = timeZoneParts.find(part => part.type === 'timeZoneName');
    
    if (!timeZoneOffsetPart) return '0';
    
    // 提取偏移字符串，例如 "GMT+08:00" 或 "GMT-05:00"
    const offsetMatch = timeZoneOffsetPart.value.match(/GMT([+-])(\d{2}):?(\d{2})?/);
    
    if (!offsetMatch) return '0';
    
    // 解析偏移组件
    const sign = offsetMatch[1]; // + 或 -
    const hours = parseInt(offsetMatch[2], 10);
    const minutes = offsetMatch[3] ? parseInt(offsetMatch[3], 10) : 0;
    
    // 确保在有效范围内 [-12:00 to +14:00]
    const absHours = hours + (minutes / 60);
    if ((sign === '+' && absHours > 14) || (sign === '-' && absHours > 12)) {
      return '0'; // 超出范围时返回UTC
    }
    
    // 构建时区字符串
    // 对于REST API，不带+号; 对于WebSocket，保留+号
    let formattedOffset;
    if (isForWebSocket || sign === '-') {
      // WebSocket需要完整格式或者负数时保留符号
      formattedOffset = sign + hours;
    } else {
      // REST API的正数时区不需要+号
      formattedOffset = hours.toString();
    }
    
    // 如果有分钟，添加分钟部分
    if (minutes > 0) {
      formattedOffset += ':' + (minutes < 10 ? '0' : '') + minutes;
    }
    
    return formattedOffset;
  } catch (error) {
    console.error('binance timezone conversion error:', error);
    return '0'; // 出错时返回UTC
  }
};
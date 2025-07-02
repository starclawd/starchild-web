import { UTCTimestamp } from 'lightweight-charts';

export const createCustomTimeFormatter = (timezone: string, selectedPeriod: string) => {
  return (timestamp: UTCTimestamp): string => {
    try {
      const utcDate = new Date(timestamp * 1000);
      
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };
      
      if (['1d', '3d', '1w'].includes(selectedPeriod)) {
        return utcDate.toLocaleDateString('en-US', {
          timeZone: timezone,
          month: '2-digit',
          day: '2-digit',
        });
      }
      
      return utcDate.toLocaleString('en-US', options).replace(',', '');
    } catch (error) {
      console.error('时间格式化错误:', error);
      return new Date(timestamp * 1000).toLocaleString();
    }
  };
};
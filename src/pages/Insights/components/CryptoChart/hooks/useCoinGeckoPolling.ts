import { useEffect, useCallback } from 'react';
import { useGetCoinData, useKlineSubData } from 'store/insights/hooks';
import { useGetConvertPeriod } from 'store/insightscache/hooks';
import { KlineSubDataType } from 'store/insights/insights';

interface UseCoinGeckoPollingProps {
  isBinanceSupport: boolean;
  historicalDataLoaded: boolean;
  symbol: string;
  paramSymbol: string;
  selectedPeriod: string;
}

export const useCoinGeckoPolling = ({
  isBinanceSupport,
  historicalDataLoaded,
  symbol,
  paramSymbol,
  selectedPeriod
}: UseCoinGeckoPollingProps) => {
  const [klinesubData, setKlinesubData] = useKlineSubData();
  const triggerGetCoinData = useGetCoinData();
  const getConvertPeriod = useGetConvertPeriod();

  const createKlineSubData = useCallback((
    coinData: any, 
    symbol: string, 
    period: string
  ) => {
    if (!coinData || !coinData.market_data) return null;
    
    const now = Date.now();
    const marketData = coinData.market_data;
    
    const currentPrice = marketData.current_price?.usd || 0;
    const high24h = marketData.high_24h?.usd || currentPrice;
    const low24h = marketData.low_24h?.usd || currentPrice;
    const priceChange24h = marketData.price_change_24h || 0;
    const priceChangePercentage24h = marketData.price_change_percentage_24h || 0;
    
    const priceChangePercentage1h = marketData.price_change_percentage_1h_in_currency?.usd || 0;
    const priceChange1h = currentPrice * priceChangePercentage1h / 100;
    
    let openPrice = currentPrice;
    let period_change = 0;
    
    const convertedPeriod = getConvertPeriod(period as any, false);
    if (convertedPeriod === '1h') {
      openPrice = currentPrice - priceChange1h;
      period_change = priceChangePercentage1h;
    } else if (convertedPeriod === '1d') {
      openPrice = currentPrice - priceChange24h;
      period_change = priceChangePercentage24h;
    }
    
    openPrice = Math.max(0.000001, openPrice);

    const klineData: KlineSubDataType = {
      stream: `${symbol.toLowerCase()}@kline_${period}`,
      data: {
        e: 'kline',
        E: now,
        s: symbol.toUpperCase(),
        k: {
          t: now - (convertedPeriod === '1h' ? 3600000 : 86400000),
          T: now,
          s: symbol.toUpperCase(),
          i: convertedPeriod,
          f: 0,
          L: 0,
          o: openPrice.toString(),
          c: currentPrice.toString(),
          h: high24h.toString(),
          l: low24h.toString(),
          v: '0',
          n: 0,
          x: false,
          q: '0',
          V: '0',
          Q: '0',
          B: '0'
        }
      }
    };
    
    return klineData;
  }, [getConvertPeriod]);

  useEffect(() => {
    if (!isBinanceSupport && historicalDataLoaded && symbol) {
      const convertedPeriod = getConvertPeriod(selectedPeriod as any, false);
      
      const fetchCoinData = async () => {
        try {
          const response: any = await triggerGetCoinData(symbol);
          if (response?.data?.data) {
            const formattedData = createKlineSubData(
              response.data.data, 
              paramSymbol, 
              convertedPeriod
            );
            if (formattedData) {
              setKlinesubData(formattedData);
            }
          }
        } catch (error) {
          console.error('获取CoinGecko价格数据错误:', error);
        }
      };
      
      fetchCoinData();
      
      const intervalId = setInterval(fetchCoinData, 60000);
      
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [
    isBinanceSupport, 
    historicalDataLoaded, 
    symbol, 
    paramSymbol,
    selectedPeriod, 
    triggerGetCoinData, 
    createKlineSubData, 
    setKlinesubData,
    getConvertPeriod
  ]);

  return {
    klinesubData,
    setKlinesubData
  };
};
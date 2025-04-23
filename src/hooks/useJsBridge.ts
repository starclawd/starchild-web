import { useCallback, useEffect, useState } from 'react';

export const useJsBridge = () => {
  const [bridgeReady, setBridgeReady] = useState(false);

  useEffect(() => {
    const checkBridge = () => {
      if (window.jsBridge) {
        setBridgeReady(true);
        return;
      }
      
      // 如果没有找到 jsBridge，500ms 后重试
      setTimeout(checkBridge, 500);
    };

    checkBridge();
  }, []);

  const callHandler = useCallback((handlerName: string, data?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!window.jsBridge) {
        reject(new Error('JSBridge 未初始化'));
        return;
      }

      try {
        window.jsBridge.callHandler(handlerName, data, (response) => {
          if (response?.code === 0 || response?.success) {
            resolve(response.data || response);
          } else {
            reject(response);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  const registerHandler = useCallback((handlerName: string, handler: (data: any, responseCallback: (response: any) => void) => void) => {
    if (!window.jsBridge) {
      console.error('JSBridge 未初始化');
      return;
    }

    window.jsBridge.registerHandler(handlerName, handler);
  }, []);

  // 具体的 getAuthToken 实现
  const getAuthToken = useCallback(async (): Promise<string> => {
    try {
      const response = await callHandler('getAuthToken');
      return response?.token || '';
    } catch (error) {
      console.error('获取 AuthToken 失败:', error);
      throw error;
    }
  }, [callHandler]);

  return {
    bridgeReady,
    callHandler,
    registerHandler,
    getAuthToken,
  };
};

export default useJsBridge;

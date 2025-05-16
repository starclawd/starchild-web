import { useCallback, useEffect, useState } from 'react';
import { useAuthToken } from 'store/logincache/hooks';
import { isPro } from 'utils/url';

// 为TypeScript声明window上的flutter_inappwebview和holominds属性
declare global {
  interface Window {
    flutter_inappwebview?: {
      callHandler: (handlerName: string, data?: any, callback?: (response: any) => void) => void;
      registerHandler: (handlerName: string, handler: (data: any, responseCallback: (response: any) => void) => void) => void;
    };
    holominds?: {
      setAuthToken: (token: string) => void;
      clearAuthToken: () => void;
    };
  }
}

export const useJsBridge = () => {
  const [bridgeReady, setBridgeReady] = useState(false);
  const [, setAuthToken] = useAuthToken();

  useEffect(() => {
    // 初始化window.holominds对象
    if (!window.holominds) {
      window.holominds = {
        setAuthToken: (token: string) => {
          setAuthToken(token);
        },
        clearAuthToken: () => {
          setAuthToken('');
        }
      };
    }

    const checkBridge = () => {
      if (window.flutter_inappwebview) {
        setBridgeReady(true);
        return;
      }
      
      // 如果没有找到 jsBridge，500ms 后重试
      setTimeout(checkBridge, 500);
    };

    checkBridge();
  }, [setAuthToken]);

  const callHandler = useCallback((handlerName: string, data?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!window.flutter_inappwebview) {
        reject(new Error('JSBridge 未初始化'));
        return;
      }

      try {
        window.flutter_inappwebview.callHandler(handlerName, data, (response) => {
          resolve(response || '');
        });
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  const registerHandler = useCallback((handlerName: string, handler: (data: any, responseCallback: (response: any) => void) => void) => {
    if (!window.flutter_inappwebview) {
      console.error('JSBridge 未初始化');
      return;
    }

    window.flutter_inappwebview.registerHandler(handlerName, handler);
  }, []);

  // 具体的 getAuthToken 实现
  const getAuthToken = useCallback(async (): Promise<any> => {
    try {
      const response = await callHandler('getAuthToken');
      if (!isPro) {
        console.log('getAuthToken', response)
      }
      setAuthToken(response)
    } catch (error) {
      console.error('获取 AuthToken 失败:', error);
      throw error;
    }
  }, [setAuthToken, callHandler]);

  return {
    bridgeReady,
    callHandler,
    registerHandler,
    getAuthToken,
  };
};

export default useJsBridge;

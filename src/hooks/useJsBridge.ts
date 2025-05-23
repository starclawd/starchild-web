import { useCallback, useEffect, useState } from 'react';
import { useIsMobile } from 'store/application/hooks';
import { useIsLogin } from 'store/login/hooks';
import { useAuthToken } from 'store/logincache/hooks';
import { useAddNewThread, useIsChatPageLoaded, useSendAiContent } from 'store/tradeai/hooks';

// 为TypeScript声明window上的flutter_inappwebview和holominds属性
declare global {
  interface Window {
    flutter_inappwebview?: {
      callHandler: (handlerName: string, data?: any, callback?: (response: any) => void) => void;
      registerHandler: (handlerName: string, handler: (data: any, responseCallback: (response: any) => void) => void) => void;
    };
    holominds?: {
      isLogin: boolean;
      isChatPageLoaded?: boolean;
      setAuthToken: (token: string) => void;
      clearAuthToken: () => void;
      sendChatContent: () => void;
      realSendChatContent: () => void;
    };
  }
}

export const useJsBridge = () => {
  const isMobile = useIsMobile()
  const isLogin = useIsLogin()
  const [bridgeReady, setBridgeReady] = useState(false);
  const [, setAuthToken] = useAuthToken();
  const sendAiContent = useSendAiContent()
  const addNewThread = useAddNewThread()
  const [isChatPageLoaded] = useIsChatPageLoaded()
  const sendChatContent = useCallback(() => {
    addNewThread()
    setTimeout(() => {
      window.holominds?.realSendChatContent()
    }, 300)
  }, [addNewThread])

  const realSendChatContent = useCallback(() => {
    sendAiContent({
      value: 'Test try it in chat'
    })
  }, [sendAiContent])

  useEffect(() => {
    // 初始化window.holominds对象
    if (!window.holominds) {
      window.holominds = {
        isLogin, 
        isChatPageLoaded,
        setAuthToken: (token: string) => {
          setAuthToken(token);
        },
        clearAuthToken: () => {
          setAuthToken('');
        },
        sendChatContent,
        realSendChatContent,
      }
    } else {
      window.holominds.isLogin = isLogin
      window.holominds.isChatPageLoaded = isChatPageLoaded
      window.holominds.sendChatContent = sendChatContent
      window.holominds.realSendChatContent = realSendChatContent
    }
    const checkBridge = () => {
      if (window.flutter_inappwebview) {
        setBridgeReady(true);
        return;
      }
      
      // 如果没有找到 jsBridge，500ms 后重试
      setTimeout(checkBridge, 500);
    };
    if (isMobile) {
      checkBridge();
    }
  }, [isLogin, isMobile, isChatPageLoaded, setAuthToken, sendChatContent, realSendChatContent]);

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

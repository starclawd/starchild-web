/// <reference types="vite/client" />
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
  }
}

declare module 'pako' {
  declare function inflate(result: string | ArrayBuffer | null, data: any): string;
}
interface HTMLElement {
  mozRequestFullScreen: () => void;
  msRequestFullscreen: () => void;
  webkitRequestFullscreen: () => void;
}
interface Document {
  exitFullscreen: () => void;
  msExitFullscreen: () => void;
  mozCancelFullScreen: () => void;
  webkitExitFullscreen: () => void;
  fullscreenElement: () => void;
  mozFullScreenElement: () => void;
  webkitFullscreenElement: () => void;
}

declare module '*.avif' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
    const src: string;
    export default src;
}

declare module '*.mp3'

declare module '*.wav'

declare module '*.mp4'

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<
    SVGSVGElement
  > & { title?: string }>;

  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

type EthereumProvider = { request(...args: any): Promise<any> }

interface Window {
  // walletLinkExtension is injected by the Coinbase Wallet extension
  walletLinkExtension?: any
  ethereum?: {
    // value that is populated and returns true by the Coinbase Wallet mobile dapp browser
    isCoinbaseWallet?: boolean
    isMetaMask?: boolean
    isTrust?: boolean
    isRabby?: boolean
    isTokenPocket?: boolean
    isRainbow?: boolean
    isBitKeep?: boolean
    isOneKey?: boolean
    isPhantom?: boolean
    autoRefreshOnNetworkChange?: boolean
  }
  web3?: Record<string, unknown>
  chartWidget?: any
  TradingView?: any
  // 以下属性是为了给埋点的pageview使用
  isDark?: boolean
  timezone?: string
  // 当前链接钱包账号
  account?: string
  disConnected?: boolean
  userDarkMode?: boolean
  eventSourceStatue?: boolean
  abortController?: AbortController
  $onekey?: any
  okxwallet?: {
    isOkxWallet: boolean
    [props: string]: any
  }
  provider: EthereumProvider | undefined | null
  bitkeep?: any
  loginStatus?: any
}

declare module 'content-hash' {
  declare function decode(x: string): string
  declare function getCodec(x: string): string
}

declare module 'json-bigint' {
  declare function parse(x: any): any
  declare function stringify(x: any): string
}

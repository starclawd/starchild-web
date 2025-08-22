import { createAppKit } from '@reown/appkit/react'

import { WagmiProvider } from 'wagmi'
import { AppKitNetwork, base } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { isPro } from 'utils/url'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://dashboard.reown.com
const projectId = isPro ? '32f9ac10c4c98b54d1bda54db30de5c7' : 'cd2d5c159f5c22d166462f7d243d59d6'

// 2. Create a metadata object - optional
const metadata = isPro
  ? {
      name: 'Starchild',
      description: 'Starchild AI',
      url: 'https://iamstarchild.com',
      icons: ['https://iamstarchild.com/favicon.png'],
    }
  : {
      name: 'Starchild',
      description: 'Starchild AI',
      url: 'https://testnet.iamstarchild.com',
      icons: ['https://testnet.iamstarchild.com/favicon.png'],
    }

// 3. Set the networks
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [base]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
})

// 拦截 Coinbase metrics 请求的优化实现
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch

  // 创建一个空的 Response 对象用于复用
  const blockedResponse = new Response(null, {
    status: 204,
    statusText: 'No Content',
  })

  window.fetch = (...args: Parameters<typeof fetch>): Promise<Response> => {
    try {
      // 提取 URL，优化类型检查
      let url: string
      const firstArg = args[0]

      if (typeof firstArg === 'string') {
        url = firstArg
      } else if (firstArg instanceof URL) {
        url = firstArg.href
      } else if (firstArg && typeof firstArg === 'object' && 'url' in firstArg) {
        url = (firstArg as Request).url
      } else {
        // 如果无法提取 URL，直接调用原始 fetch
        return originalFetch(...args)
      }

      // 更精确的 URL 匹配 - 使用正则表达式确保是完整的域名匹配
      if (/cca-lite\.coinbase\.com\/metrics/.test(url)) {
        console.debug('🚫 Blocked Coinbase metrics request:', url)
        return Promise.resolve(blockedResponse.clone())
      }

      return originalFetch(...args)
    } catch (error) {
      // 如果拦截过程中出现错误，回退到原始 fetch
      console.warn('Error in fetch interceptor:', error)
      return originalFetch(...args)
    }
  }
}

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  featuredWalletIds: [
    '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709',
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
  ],
  features: {
    analytics: false, // Optional - defaults to your Cloud configuration
    email: false,
    socials: [],
    history: false,
  },
  themeMode: 'dark',
})

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

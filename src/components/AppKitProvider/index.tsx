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

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  featuredWalletIds: ['971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709'],
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

"use client"

import React from "react"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { WagmiConfig, createConfig } from "wagmi"
import { liskSepolia, lisk } from "wagmi/chains"
import { http } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Define chains to use
const chains = [liskSepolia, lisk, ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [liskSepolia] : [])]

// Create wagmi config using the http transport directly
const wagmiConfig = createConfig({
  chains,
  transports: {
    [lisk.id]: http(),
    [liskSepolia.id]: http(),
  },
})

// Create React Query client outside of component to avoid re-creation on render
const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  // Use state to track if component is mounted
  const [mounted, setMounted] = React.useState(false)

  // Use useEffect to update mounted state after initial render
  React.useEffect(() => {
    setMounted(true)

    // Cleanup function
    return () => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("walletconnect")
      }
    }
  }, [])

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null
  }

  // Only render providers when mounted (client-side)
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}

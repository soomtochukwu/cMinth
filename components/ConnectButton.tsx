"use client"

import { useState, useCallback } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [isOpen, setIsOpen] = useState(false)

  // Use callbacks for state updates to avoid updates during render
  const handleConnect = useCallback(
    (connector: any) => {
      connect({ connector })
      setIsOpen(false)
    },
    [connect],
  )

  const handleDisconnect = useCallback(() => {
    disconnect()
  }, [disconnect])

  if (isConnected && address) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900/60 backdrop-blur-md rounded-lg border border-gray-800/50 hover:bg-gray-800/60 transition-colors">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"></div>
            <span className="hidden md:inline text-sm font-medium">
              {address.substring(0, 6)}...{address.substring(address.length - 4)}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-4">
            <div className="text-sm text-gray-400">Connected as</div>
            <div className="font-mono text-sm">
              {address.substring(0, 6)}...{address.substring(address.length - 4)}
            </div>
            <button
              onClick={handleDisconnect}
              className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-md text-sm font-medium transition-colors"
            >
              Disconnect
            </button>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg text-white font-medium transition-all duration-300 shadow-lg shadow-cyan-500/20"
          disabled={isPending}
        >
          {isPending ? "Connecting..." : "Connect Wallet"}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-4">
          <h3 className="font-medium">Connect a wallet</h3>
          <div className="space-y-2">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => handleConnect(connector)}
                disabled={!connector.ready || isPending}
                className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-md text-sm font-medium transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{connector.name}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

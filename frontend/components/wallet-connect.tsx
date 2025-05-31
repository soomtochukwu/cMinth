"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, ExternalLink, Copy, LogOut } from "lucide-react"
import { useWalletStore } from "@/store/wallet-store"
import toast from "react-hot-toast"

export function WalletConnect() {
  const { isConnected, address, balance, connect, disconnect } = useWalletStore()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      // Simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 2000))
      connect()
      toast.success("Wallet connected successfully!")
    } catch (error) {
      toast.error("Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast.success("Wallet disconnected")
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success("Address copied to clipboard!")
    }
  }

  if (isConnected && address) {
    return (
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </p>
                  <Button variant="ghost" size="sm" onClick={copyAddress} className="p-1 h-auto">
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    Connected
                  </Badge>
                  <span className="text-sm text-slate-400">{balance} ETH</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="p-2">
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="p-2 text-red-400 border-red-400 hover:bg-red-400/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-6 py-3 text-lg font-semibold"
      >
        {isConnecting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-5 h-5 mr-2" />
            Connect Wallet
          </>
        )}
      </Button>
    </motion.div>
  )
}

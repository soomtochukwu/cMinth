import { create } from "zustand"

interface WalletState {
  isConnected: boolean
  address: string | null
  balance: number
  connect: () => void
  disconnect: () => void
}

export const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  address: null,
  balance: 0,
  connect: () =>
    set({
      isConnected: true,
      address: "0x1234567890123456789012345678901234567890",
      balance: 2.5,
    }),
  disconnect: () =>
    set({
      isConnected: false,
      address: null,
      balance: 0,
    }),
}))
import { create } from "zustand"
import { readContract } from "@wagmi/core"
import { Cr8orAbi, Cr8orAddress } from "@/lib/var"
// Option 1: Try these common wagmi config locations
// import { config } from "@/lib/wagmi"
// import { config } from "@/config/wagmi"
// import { config } from "@/wagmi.config"
// import { config } from "../wagmi"
// import { config } from "./wagmi"

// Option 2: If you don't have a separate config file, create it inline
import { createConfig, http } from 'wagmi'
import { lisk, liskSepolia } from 'wagmi/chains' // adjust chains as needed

const config = createConfig({
  chains: [liskSepolia], // adjust to your target chains
  transports: {
    [liskSepolia.id]: http(),
  },
})

interface NFT {
  id: string
  title: string
  description: string
  creator: string
  price: number
  image: string
  audio?: string
  type: "audio" | "art"
  tags?: string[]
  createdAt: string
  tokenId: number
  owner: string
}

interface NFTState {
  nfts: NFT[]
  isLoading: boolean
  error: string | null
  addNFT: (nft: NFT) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchNFTs: () => Promise<NFT[]>
}

export const useNFTStore = create<NFTState>((set, get) => ({
  nfts: [],
  isLoading: false,
  error: null,
  addNFT: (nft) => set((state) => ({ nfts: [nft, ...state.nfts] })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  fetchNFTs: async (): Promise<NFT[]> => {
    set({ isLoading: true, error: null })
    try {
      // 1. Get total supply
      const totalSupply = (await readContract(config, {
        address: Cr8orAddress,
        abi: Cr8orAbi,
        functionName: "totalSupply",
      })) as bigint

      const totalSupplyNumber = Number(totalSupply)

      if (totalSupplyNumber === 0) {
        set({ nfts: [], isLoading: false })
        return [] // Return empty array when no NFTs
      }

      // 2. Fetch all tokenURIs and metadata with error handling
      const nftPromises = []
      for (let i = 0; i < totalSupplyNumber; i++) {
        nftPromises.push(
          (async () => {
            try {
              // Get tokenId (assuming 1-indexed tokens)
              const tokenId = i + 1;

              // 3. Get tokenURI
              const tokenURI = (await readContract(config, {
                address: Cr8orAddress,
                abi: Cr8orAbi,
                functionName: "tokenURI",
                args: [BigInt(tokenId - 1)],
              })) as string

              if (!tokenURI) {
                console.warn(`Empty tokenURI for token ${tokenId}`)
                return null
              }

              // 4. Fetch metadata from tokenURI (handle ipfs:// links)
              let url = tokenURI
              if (url.startsWith("ipfs://")) {
                url = url.replace("ipfs://", "https://ipfs.io/ipfs/")
              }

              // Add timeout and better error handling for metadata fetch
              const controller = new AbortController()
              const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

              const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                  'Accept': 'application/json',
                }
              })
              clearTimeout(timeoutId)

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
              }

              const meta = await response.json()

              // Get owner of the token
              let owner = ""
              try {
                owner = (await readContract(config, {
                  address: Cr8orAddress,
                  abi: Cr8orAbi,
                  functionName: "ownerOf",
                  args: [BigInt(tokenId)],
                })) as string
              } catch (ownerError) {
                console.warn(`Could not fetch owner for token ${tokenId}:`, ownerError)
              }

              // 5. Return NFT object with fallback values
              return {
                id: tokenId.toString(),
                title: meta.name || meta.title || `Token #${tokenId}`,
                description: meta.description || "",
                creator: meta.creator || meta.artist || "",
                price: meta.price || 0,
                image: meta.image || "",
                audio: meta.audio || meta.animation_url,
                type: (meta.type as "audio" | "art") || (meta.audio || meta.animation_url ? "audio" : "art"),
                tags: meta.attributes?.map((attr: any) => attr.value) || meta.tags || [],
                createdAt: meta.createdAt || new Date().toISOString(),
                tokenId,
                owner,
              } as NFT
            } catch (tokenError) {
              console.error(`Failed to fetch token ${i + 1}:`, tokenError)
              return null
            }
          })()
        )
      }

      // Wait for all promises and filter out failed ones
      const results = await Promise.allSettled(nftPromises)
      const nfts = results
        .filter((result): result is PromiseFulfilledResult<NFT> =>
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value)

      set({ nfts, isLoading: false })
      return nfts // Return the fetched NFTs
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch NFTs'
      console.error("Failed to fetch NFTs", error)
      set({ error: errorMessage, isLoading: false })
      return [] // Return empty array on error
    }
  },
}))
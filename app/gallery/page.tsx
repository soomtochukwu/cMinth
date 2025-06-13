"use client"

import { useState, useEffect } from "react"
import { useReadContract } from "wagmi"
import { Minth_abi, Minth_address } from "@/utils/var"
import Link from "next/link"
import Image from "next/image"
import { ConnectButton } from "@/components/ConnectButton"
import ParticleBackground from "@/components/ParticleBackground"

interface NFT {
  id: number
  owner: string
  uri: string
  metadata?: {
    name: string
    description: string
    image: string
    attributes: Array<{
      trait_type: string
      value: string
    }>
  }
  imageUrl: string
}

export default function GalleryPage() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Read total supply from contract
  const { data: totalSupply } = useReadContract({
    abi: Minth_abi,
    address: Minth_address as `0x${string}`,
    functionName: "totalSupply",
  })

  // Fetch NFT data
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!totalSupply) return

        const supply = Number(totalSupply)
        const nftData: NFT[] = []

        // For demo purposes, we'll just show some placeholder NFTs
        // In a real app, you would fetch each token by ID
        for (let i = 1; i <= Math.min(supply, 10); i++) {
          // This would normally fetch from the contract
          const placeholderNFT: NFT = {
            id: i,
            owner: `0x${i}23456789abcdef0123456789abcdef01234567`,
            uri: `ipfs://placeholder${i}`,
            metadata: {
              name: `NFT #${i}`,
              description: `A beautiful NFT created with Minth #${i}`,
              image: `ipfs://placeholder${i}/image`,
              attributes: [
                {
                  trait_type: "Creator",
                  value: `Artist${i}`,
                },
              ],
            },
            imageUrl: `/placeholder.svg?height=400&width=400&text=NFT+%23${i}`,
          }
          nftData.push(placeholderNFT)
        }

        setNfts(nftData)
      } catch (err) {
        console.error("Error fetching NFTs:", err)
        setError("Failed to load NFTs. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNFTs()
  }, [totalSupply])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <ParticleBackground />

      {/* Header */}
      <header className="relative z-10 w-full backdrop-blur-md border-b border-gray-800/50">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <Link
              href="/"
              className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 text-transparent bg-clip-text"
            >
              MINTH
            </Link>
            <p className="text-sm text-gray-400 mt-1">NFT Gallery</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-white transition-colors"
            >
              Create NFT
            </Link>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 text-transparent bg-clip-text">
            NFT Gallery
          </h1>
          <p className="text-gray-400">
            Explore all the NFTs created with Minth. Connect your wallet to see your own creations.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-t-cyan-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-300">Loading NFTs...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-800/50 hover:bg-red-700/50 rounded-md text-white transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        )}

        {!isLoading && !error && nfts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">No NFTs Found</h3>
            <p className="text-gray-500 mb-6">Be the first to create an NFT with Minth!</p>
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg text-white font-medium transition-all duration-300 shadow-lg shadow-purple-500/20"
            >
              Create NFT
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 backdrop-blur-md py-4">
        <div className="container mx-auto px-4 flex flex-wrap justify-center md:justify-between items-center gap-4">
          <p className="text-sm text-gray-500">Use desktop for best experience</p>

          <div className="flex flex-wrap gap-4 items-center">
            <Link
              href={`https://sepolia-blockscout.lisk.com/address/${Minth_address}?tab=contract`}
              target="_blank"
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View Smart Contract
            </Link>

            <Link
              href="https://github.com/soomtochukwu/"
              target="_blank"
              className="text-sm flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>GitHub</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>

            <Link
              href="https://somtochukwu-ko.vercel.app/"
              target="_blank"
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Portfolio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NFTCard({ nft }: { nft: NFT }) {
  return (
    <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-800/50 shadow-lg shadow-cyan-500/10 overflow-hidden transition-all duration-300 hover:shadow-cyan-500/20 hover:scale-[1.02]">
      <div className="relative aspect-square overflow-hidden bg-black/50">
        <Image
          src={nft.imageUrl || "/placeholder.svg"}
          alt={nft.metadata?.name || `NFT #${nft.id}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1">{nft.metadata?.name || `NFT #${nft.id}`}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {nft.metadata?.description || "A beautiful NFT created with Minth"}
        </p>
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Owner: {nft.owner.substring(0, 6)}...{nft.owner.substring(nft.owner.length - 4)}
          </div>
          <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">View</button>
        </div>
      </div>
    </div>
  )
}

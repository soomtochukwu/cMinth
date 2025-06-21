"use client";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { Minth_abi, Minth_address } from "@/utils/var";
import Link from "next/link";
import Image from "next/image";
import ParticleBackground from "@/components/ParticleBackground";
import WalletConnectButton from "@/components/walletConnectButton";
export interface NFTAttribute {
  trait_type: string;
  value: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
}

export interface NFT {
  id: number;
  owner: string;
  uri: string;
  metadata: NFTMetadata;
  imageUrl: string;
}
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function GalleryPage() {
  const //
    [nfts, setNfts] = useState<NFT[]>([]),
    [isLoading, setIsLoading] = useState(true),
    [error, setError] = useState<string | null>(null),
    // Read total supply from contract
    { data: totalSupply } = useReadContract({
      abi: Minth_abi,
      address: Minth_address as `0x${string}`,
      functionName: "totalSupply",
    });

  // Fetch NFT data
  useEffect(() => {
    fetch("/api/getMetadata")
      .then((res) => res.json())
      .then((data) => {
        setNfts(data);
        console.log(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load metadata:", err);
        setIsLoading(false);
      });
  }, [totalSupply]);

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
              Home
            </Link>
            <Link
              href="/create"
              className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-white transition-colors"
            >
              Create NFT
            </Link>
            <WalletConnectButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 text-transparent bg-clip-text">
            NFT Gallery
          </h1>
          <p className="text-gray-400">
            Explore all the NFTs created with Minth. Connect your wallet to see
            your own creations.
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
          <motion.div
            className=" relative"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nfts.map((nft) => (
                <NFTCard key={Math.random()} nft={nft} />
              ))}
            </div>
          </motion.div>
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
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              No NFTs Found
            </h3>
            <p className="text-gray-500 mb-6">
              Be the first to create an NFT with Minth!
            </p>
            <Link
              href="/create"
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg text-white font-medium transition-all duration-300 shadow-lg shadow-purple-500/20"
            >
              Create NFT
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

function NFTCard({ nft }: { nft: NFT }) {
  return (
    <div
      key={Math.random()}
      className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-800/50 shadow-lg shadow-cyan-500/10 w-full overflow-hidden transition-all duration-300 hover:shadow-cyan-500/20 hover:scale-[1.02]"
    >
      <div className="relative w-full aspect-square h-fit flex items-center justify-center overflow-hidden bg-black/50">
        <img
          src={nft.imageUrl || "/placeholder.svg"}
          alt={nft.metadata?.name || `NFT #${nft.id}`}
          className="object-cover w-full p-2"
          width={100}
          height={100}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1">
          {nft.metadata?.name || `NFT #${nft.id}`}
        </h3>
        <p className="text-gray-400 text-wrap text-sm mb-3 line-clamp-2">
          {nft.metadata?.description || "A beautiful NFT created with Minth"}
        </p>
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Owner:{" "}
            {String(nft?.owner).replace(
              String(nft?.owner).slice(3, String(nft?.owner).length - 3),
              "..."
            )}
          </div>
          <button
            title="coming soon"
            className="text-sm bg-cyan-800 rounded-lg p-2  text-cyan-400 hover:text-cyan-300 transition-colors"
            style={{
              filter: "brightness(0.3)",
            }}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

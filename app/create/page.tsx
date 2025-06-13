"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import CanvasDrawing from "@/components/canvas/CanvasDrawing"
import Link from "next/link"
import { useAccount } from "wagmi"
import { Minth_address } from "@/utils/var"
import NFTPreview from "@/components/NFTPreview"
import MintButton from "@/components/MintButton"
import ParticleBackground from "@/components/ParticleBackground"
import { ConnectButton } from "@/components/ConnectButton"

export default function Home() {
  const [image, setImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [stage, setStage] = useState<string | null>(null)
  const { address, isConnected } = useAccount()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropAreaRef = useRef<HTMLDivElement>(null)

  // Use callback for state updates
  const handleImageGenerated = useCallback((file: File, url: string) => {
    setImage(file)
    setImageUrl(url)
    setIsDrawerOpen(false)
  }, [])

  const handleStageChange = useCallback((newStage: string | null) => {
    setStage(newStage)
  }, [])

  const handleDrawerToggle = useCallback(() => {
    setIsDrawerOpen((prev) => !prev)
  }, [])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setImageUrl(URL.createObjectURL(file))
    }
  }, [])

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    if (url) {
      setImageUrl(url)
    }
  }, [])

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add("border-cyan-500")
      dropAreaRef.current.classList.remove("border-gray-700")
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("border-cyan-500")
      dropAreaRef.current.classList.add("border-gray-700")
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("border-cyan-500")
      dropAreaRef.current.classList.add("border-gray-700")
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        setImage(file)
        setImageUrl(URL.createObjectURL(file))
      }
    }
  }, [])

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
            <p className="text-sm text-gray-400 mt-1">Create & Mint Your NFT Masterpieces</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/gallery"
              className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-white transition-colors"
            >
              NFT Gallery
            </Link>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          {/* Left Panel - Tools */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-800/50 shadow-lg shadow-cyan-500/10 p-6 transition-all">
              <h2 className="text-xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-purple-600 text-transparent bg-clip-text">
                Create Your NFT
              </h2>

              <div className="space-y-6">
                <button
                  onClick={handleDrawerToggle}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 rounded-lg text-white font-medium transition-all duration-300 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                    <path d="M2 2l7.586 7.586"></path>
                    <circle cx="11" cy="11" r="2"></circle>
                  </svg>
                  Draw Your Own NFT
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900/60 text-gray-400">or</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-400">Upload Image</label>
                  <div
                    ref={dropAreaRef}
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg hover:border-cyan-600 transition-colors duration-300"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-500"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-cyan-400 hover:text-cyan-300 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            ref={fileInputRef}
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900/60 text-gray-400">or</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="image-url" className="block text-sm font-medium text-gray-400">
                    Image URL
                  </label>
                  <div className="mt-1">
                    <input
                      type="url"
                      name="image-url"
                      id="image-url"
                      className="block w-full rounded-md border-gray-700 bg-gray-800/50 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm p-3"
                      placeholder="https://example.com/image.png"
                      onChange={handleUrlChange}
                    />
                  </div>
                </div>

                <MintButton
                  image={image}
                  imageUrl={imageUrl}
                  address={address}
                  isConnected={isConnected}
                  onStageChange={handleStageChange}
                  stage={stage}
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <NFTPreview imageUrl={imageUrl} />
        </div>
      </main>

      {/* Canvas Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleDrawerToggle}></div>
          <div className="absolute inset-4 md:inset-16 bg-gray-900/90 backdrop-blur-md rounded-xl border border-gray-800/50 shadow-2xl overflow-hidden">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleDrawerToggle}
                className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700/80 text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <CanvasDrawing onImageGenerated={handleImageGenerated} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 backdrop-blur-md py-4">
        <div className="container mx-auto px-4 flex flex-wrap justify-center md:justify-between items-center gap-4">
          <p className="text-sm text-gray-500">Use desktop for best experience</p>

          <div className="flex flex-wrap gap-4 items-center">
            <Link href="/" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              Home
            </Link>
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

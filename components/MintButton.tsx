"use client"

import { useState } from "react"
import { useWriteContract } from "wagmi"
import { Minth_abi, Minth_address } from "@/utils/var"
import { PinataSDK } from "pinata"
import Progress from "@/components/Progress"

interface MintButtonProps {
  image: File | null
  imageUrl: string | null
  address: string | undefined
  isConnected: boolean
  onStageChange: (stage: string | null) => void
  stage: string | null
}

export default function MintButton({ image, imageUrl, address, isConnected, onStageChange, stage }: MintButtonProps) {
  const { writeContractAsync, isPending } = useWriteContract()
  const [isLoading, setIsLoading] = useState(false)

  const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_JWT,
    pinataGateway: process.env.NEXT_PUBLIC_gate,
  })

  const pinImage = async () => {
    try {
      onStageChange("pinning")
      setIsLoading(true)

      if (!image && imageUrl) {
        // Fetch image from URL if we only have a URL
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const fileName = imageUrl.split("/").pop() || "image.png"
        image = new File([blob], fileName, { type: blob.type })
      }

      if (!image) {
        throw new Error("No image to upload")
      }

      // Upload the image to IPFS
      const NFT_image = await (async () => {
        const pin = await pinata.upload.file(image as File)
        onStageChange("1st stage")
        console.log("Image pinned:", pin.IpfsHash)
        return pin
      })()

      // Create and upload metadata
      const metadata = {
        attributes: [
          {
            trait_type: "Name",
            value: `${(image as File).name}`,
          },
          {
            trait_type: "Owner",
            value: address,
          },
        ],
        description: `Minted for ${address} by Minth`,
        image: `ipfs://${NFT_image.IpfsHash}`,
        name: address?.slice(0, 6),
      }

      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      })

      const file2 = new File([metadataBlob], `metadata_${(image as File).name}.json`, {
        type: "application/json",
      })

      const NFT_image_Metadata = await (async () => {
        const pin = await pinata.upload.file(file2)
        onStageChange("2nd stage")
        console.log("Metadata pinned:", pin.IpfsHash)
        onStageChange("pinned")
        return pin
      })()

      return NFT_image_Metadata
    } catch (error: any) {
      console.error("Error pinning to IPFS:", error)
      throw error
    }
  }

  const handleMint = async () => {
    if (!imageUrl && !image) {
      alert("Please upload an image or enter a valid URL")
      return
    }

    if (!isConnected || !address) {
      alert("Please connect your wallet to mint an NFT")
      return
    }

    try {
      setIsLoading(true)
      onStageChange("minting")

      const NFT = await pinImage()

      await writeContractAsync({
        abi: Minth_abi,
        address: Minth_address as `0x${string}`,
        functionName: "safeMint",
        args: [`ipfs://${NFT.IpfsHash}`],
      })

      onStageChange("mining")

      // In a real app, we would listen for the transaction to be mined
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        onStageChange("minted")
        setIsLoading(false)

        setTimeout(() => {
          onStageChange(null)
        }, 3000)
      }, 2000)
    } catch (error: any) {
      console.error("Minting error:", error)
      alert(`Error minting NFT: ${error.message || error}`)
      setIsLoading(false)
      onStageChange(null)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleMint}
        disabled={isLoading || !imageUrl || isPending}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
          isLoading || !imageUrl || isPending
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/20"
        }`}
      >
        {isLoading || isPending ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
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
              <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
              <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
              <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
            </svg>
            Mint NFT
          </>
        )}
      </button>

      {stage && (
        <div className="h-6">
          <Progress
            progressBarBG="bg-gradient-to-r from-cyan-600 to-purple-600"
            color="text-white"
            stages={["pinning", "1st stage", "2nd stage", "pinned", "minting", "mining", "minted"]}
            currentStage={stage}
          />
        </div>
      )}
    </div>
  )
}

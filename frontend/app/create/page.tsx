"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/file-upload"
import { NFTPreview } from "@/components/nft-preview"
import { WalletConnect } from "@/components/wallet-connect"
import { useForm } from "react-hook-form"
import { useWalletStore } from "@/store/wallet-store"
import { useNFTStore } from "@/store/nft-store"
import { AnimatedBackground } from "@/components/animated-background"
import { Sparkles, Upload, Eye, Zap } from "lucide-react"
import toast from "react-hot-toast"

interface NFTFormData {
  title: string
  description: string
  creator: string
  price: string
  tags: string
  type: "audio" | "art"
}

const steps = [
  { id: 1, title: "Upload Files", icon: Upload },
  { id: 2, title: "Add Details", icon: Eye },
  { id: 3, title: "Preview & Mint", icon: Zap },
]

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<{ main?: File; artwork?: File }>({})
  const [isUploading, setIsUploading] = useState(false)
  const [isMinting, setIsMinting] = useState(false)

  const { isConnected } = useWalletStore()
  const { addNFT } = useNFTStore()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NFTFormData>()

  const formData = watch()

  const handleFileUpload = (files: { main?: File; artwork?: File }) => {
    setUploadedFiles(files)
    if (files.main) {
      setCurrentStep(2)
    }
  }

  const onSubmit = async (data: NFTFormData) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!uploadedFiles.main) {
      toast.error("Please upload a file first")
      return
    }

    setIsMinting(true)

    try {
      // Simulate IPFS upload and minting
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const newNFT = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        creator: data.creator,
        price: Number.parseFloat(data.price),
        image: uploadedFiles.artwork
          ? URL.createObjectURL(uploadedFiles.artwork)
          : "/placeholder.svg?height=400&width=400",
        audio: data.type === "audio" ? URL.createObjectURL(uploadedFiles.main) : undefined,
        type: data.type,
        tags: data.tags.split(",").map((tag) => tag.trim()),
        createdAt: new Date().toISOString(),
        tokenId: Math.floor(Math.random() * 10000),
        owner: "0x1234...5678",
      }

      addNFT(newNFT)
      toast.success("NFT minted successfully! 🎉")

      // Reset form
      setCurrentStep(1)
      setUploadedFiles({})
    } catch (error) {
      toast.error("Failed to mint NFT. Please try again.")
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />

      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Create Your NFT
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Transform your digital content into valuable NFTs with built-in royalty splits
            </p>
          </motion.div>

          {/* Wallet Connection */}
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                  <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
                  <p className="text-slate-300 mb-6">Connect your wallet to start minting NFTs and earning royalties</p>
                  <WalletConnect />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex justify-center">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = currentStep === step.id
                  const isCompleted = currentStep > step.id

                  return (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`
                        flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                        ${
                          isActive
                            ? "border-purple-500 bg-purple-500/20 text-purple-300"
                            : isCompleted
                              ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                              : "border-slate-600 bg-slate-800/50 text-slate-400"
                        }
                      `}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`ml-2 font-medium ${isActive ? "text-purple-300" : isCompleted ? "text-emerald-300" : "text-slate-400"}`}
                      >
                        {step.title}
                      </span>
                      {index < steps.length - 1 && (
                        <div className={`w-8 h-0.5 mx-4 ${isCompleted ? "bg-emerald-500" : "bg-slate-600"}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">
                    {currentStep === 1 && "Upload Your Content"}
                    {currentStep === 2 && "Add NFT Details"}
                    {currentStep === 3 && "Review & Mint"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentStep === 1 && <FileUpload onFilesUploaded={handleFileUpload} />}

                  {currentStep === 2 && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          {...register("title", { required: "Title is required" })}
                          placeholder="Enter NFT title"
                          className="bg-slate-800/50 border-slate-600 text-white"
                        />
                        {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
                      </div>

                      <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          {...register("description", { required: "Description is required" })}
                          placeholder="Describe your NFT"
                          className="bg-slate-800/50 border-slate-600 text-white min-h-[100px]"
                        />
                        {errors.description && (
                          <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="creator">Creator Name *</Label>
                        <Input
                          id="creator"
                          {...register("creator", { required: "Creator name is required" })}
                          placeholder="Your name or artist name"
                          className="bg-slate-800/50 border-slate-600 text-white"
                        />
                        {errors.creator && <p className="text-red-400 text-sm mt-1">{errors.creator.message}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="type">Content Type *</Label>
                          <Select {...register("type", { required: true })}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="audio">Audio</SelectItem>
                              <SelectItem value="art">Digital Art</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="price">Price (ETH) *</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.001"
                            {...register("price", { required: "Price is required", min: 0.001 })}
                            placeholder="0.1"
                            className="bg-slate-800/50 border-slate-600 text-white"
                          />
                          {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input
                          id="tags"
                          {...register("tags")}
                          placeholder="music, electronic, ambient"
                          className="bg-slate-800/50 border-slate-600 text-white"
                        />
                      </div>

                      <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600"
                          disabled={!formData.title || !formData.description || !formData.creator || !formData.price}
                        >
                          Preview
                        </Button>
                      </div>
                    </form>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="bg-slate-800/30 rounded-xl p-4">
                        <h4 className="font-semibold mb-2 text-purple-300">Royalty Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Creator Royalty:</span>
                            <span className="text-emerald-400 font-medium">90%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Platform Fee:</span>
                            <span className="text-slate-400">10%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(2)}
                          className="flex-1"
                          disabled={isMinting}
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleSubmit(onSubmit)}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600"
                          disabled={!isConnected || isMinting}
                        >
                          {isMinting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Minting...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 mr-2" />
                              Mint NFT
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Preview Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <NFTPreview formData={formData} uploadedFiles={uploadedFiles} isVisible={currentStep >= 2} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

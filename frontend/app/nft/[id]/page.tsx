"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  Share2,
  ExternalLink,
  Volume2,
  User2,
  AlertCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useNFTStore } from "@/store/nft-store";
// import { useWalletStore } from "@/store/wallet-store";
import { AudioPlayer } from "@/components/audio-player";
import { AnimatedBackground } from "@/components/animated-background";
import { PurchaseModal } from "@/components/purchase-modal";
import toast from "react-hot-toast";
import { useAccount, useChainId, useConfig } from "wagmi";
import { Cr8orAddress } from "@/lib/var";
import Link from "next/link";
import Rates from "@/components/Rates";

export default function NFTDetailPage() {
  const //
    // const { isConnected } = useWalletStore();
    { isConnected, address } = useAccount(),
    chainId = useChainId(),
    { chains } = useConfig(),
    { nfts, fetchNFTs } = useNFTStore(),
    currentChain = chains.find((c) => c.id === chainId),
    params = useParams(),
    [isLiked, setIsLiked] = useState(false),
    [showPurchaseModal, setShowPurchaseModal] = useState(false),
    nft = nfts.find((n) => n.id === params.id),
    handlePurchase = () => {
      console.log(nft?.id, params.id);

      if (!isConnected) {
        toast.error("Please connect your wallet first");
        return;
      }
      setShowPurchaseModal(true);
    },
    handleShare = () => {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    },
    handleRefresh = async () => {
      const freshNFTs = await fetchNFTs();
      console.log("Got fresh NFTs:", freshNFTs);
    };

  useEffect(() => {
    handleRefresh();
  }, []);

  if (!nft) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h2 className="text-2xl font-bold mb-2">NFT Not Found</h2>
          <p className="text-slate-400">
            The NFT you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />

      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Media Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <img
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.title}
                      className="w-full h-full object-cover"
                    />
                    {nft.type === "audio" && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center">
                          <Volume2 className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                          <p className="text-lg font-medium">Audio NFT</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {nft.audio && (
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-purple-300">
                      Audio Player
                    </h3>
                    <AudioPlayer src={nft.audio} title={nft.title} />
                  </CardContent>
                </Card>
              )}

              {nft.type === "audio" && !nft.audio && (
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-4 text-purple-300">
                      Audio Preview
                    </h3>
                    <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                      <p className="text-slate-300">
                        Audio preview is not available for this NFT.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Details Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Title and Actions */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                      {nft.title}
                    </h1>
                    <Badge
                      variant="secondary"
                      className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                    >
                      {nft.type === "audio" ? "Audio NFT" : "Digital Art"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-2 ${
                        isLiked
                          ? "text-red-400 border-red-400"
                          : "text-slate-400 border-slate-600"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                      />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="p-2 text-slate-400 border-slate-600"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-slate-300 text-lg leading-relaxed">
                  {nft.description}
                </p>
              </div>

              {/* Creator Info */}
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <User2 />
                    </Avatar>
                    <div>
                      <p className="text-sm text-slate-400">Current Owner</p>
                      <p className="font-semibold text-white">
                        <Link
                          target="_blank"
                          className="p-1 flex items-center gap-1"
                          href={
                            currentChain?.blockExplorers?.default.url +
                            "/address/" +
                            nft.owner
                          }
                        >
                          {nft.owner.replace(
                            nft.owner.slice(5, nft.owner.length - 5),
                            "..."
                          )}{" "}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price and Purchase */}
              <Card className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">
                        Current Price
                      </p>
                      <Rates nftPrice={nft.price} />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400 mb-1">Token ID</p>
                      <p className="font-mono text-purple-300">
                        #{nft.tokenId}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handlePurchase}
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 text-lg"
                    disabled={!isConnected}
                  >
                    {isConnected
                      ? "Purchase NFT"
                      : "Connect Wallet to Purchase"}
                  </Button>
                </CardContent>
              </Card>

              {/* Royalty Information */}
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-purple-300">
                    Royalty Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Creator Royalty</span>
                      <span className="text-emerald-400 font-medium">90%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Platform Fee</span>
                      <span className="text-slate-400">10%</span>
                    </div>
                    <Separator className="bg-slate-700" />
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">
                        Creator Earnings per Sale
                      </span>
                      <span className="text-purple-300 font-medium">
                        <Rates nftPrice={nft.price * 0.9} />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              {nft.tags && nft.tags.length > 0 && (
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-purple-300">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {nft.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contract Info */}
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-purple-300">
                    Contract Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Contract Address</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-300">
                          {Cr8orAddress.replace(
                            Cr8orAddress.slice(5, Cr8orAddress.length - 5),
                            "..."
                          )}
                        </span>
                        <Button variant="ghost" size="sm" className="p-1">
                          <Link
                            target="_blank"
                            className="p-1"
                            href={
                              currentChain?.blockExplorers?.default.url +
                              "/address/" +
                              Cr8orAddress
                            }
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Token Standard</span>
                      <span className="text-slate-300">ERC-721</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Blockchain</span>
                      <span className="text-slate-300">LISK L2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <PurchaseModal
        nft={nft}
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />
    </div>
  );
}

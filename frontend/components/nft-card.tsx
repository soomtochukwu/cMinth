"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Play, Eye, UserCheck2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Rates from "./Rates";

interface NFT {
  id: string;
  title: string;
  creator: string;
  price: number;
  image: string;
  audio?: string;
  type: "audio" | "art";
  owner: string;
  tags?: string[];
}

interface NFTCardProps {
  nft: NFT;
  viewMode?: "grid" | "list";
}

export function NFTCard({ nft, viewMode = "grid" }: NFTCardProps) {
  const //
    [isLiked, setIsLiked] = useState(false),
    [isHovered, setIsHovered] = useState(false);
  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-full rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={nft.image || "/placeholder.svg"}
                  alt={nft.title}
                  className="w-full h-full object-cover"
                />
                {nft.type === "audio" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className=" text-wrap font-semibold text-white truncate">
                      {nft.title}
                    </h3>
                    <p className="text-slate-400 text-sm">by {nft.creator}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-purple-500/20 text-purple-300 border-purple-500/30 ml-2"
                  >
                    {nft.type === "audio" ? "Audio" : "Art"}
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <Rates nftPrice={nft.price} />

                  <div className="flex w-full sm:w-auto space-x-4 justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-2 ${isLiked
                        ? "text-red-400 border-red-400"
                        : "text-slate-400 border-slate-600"
                        }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                      />
                    </Button>
                    <Link href={`/nft/${nft.id}`}>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-cyan-600"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden group">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={nft.image || "/placeholder.svg"}
              alt={nft.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {nft.type === "audio" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <motion.div
                  animate={{ scale: isHovered ? 1.2 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Play className="w-12 h-12 text-purple-400" />
                </motion.div>
              </div>
            )}

            <div className="absolute top-4 left-4">
              <Badge
                variant="secondary"
                className="bg-purple-500/20 text-purple-300 border-purple-500/30 backdrop-blur-sm"
              >
                {nft.type === "audio" ? "Audio" : "Art"}
              </Badge>
            </div>

            <div className="absolute top-4 right-4">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLiked(!isLiked);
                }}
                className={`p-2 backdrop-blur-sm ${isLiked
                  ? "text-red-400 border-red-400 bg-red-400/10"
                  : "text-slate-400 border-slate-600 bg-slate-900/50"
                  }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-4 left-4 right-4"
            >
              <Link href={`/nft/${nft.id}`}>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 backdrop-blur-sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="p-6 space-y-4">
            <div className="min-w-0 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-purple-300 truncate">
                {nft.title}
              </h3>

              <div title="Owner" className="flex items-center gap-2 mt-1">
                <UserCheck2Icon size={20} className="text-yellow-600" />
                <p className="text-slate-400 text-sm truncate">
                  {nft.owner.replace(nft.owner.slice(5, nft.owner.length), "...")}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Rates nftPrice={nft.price} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

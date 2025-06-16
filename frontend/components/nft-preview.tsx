"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Music, ImageIcon } from "lucide-react";
import Rates from "./Rates";

interface NFTPreviewProps {
  formData: any;
  uploadedFiles: { main?: File; artwork?: File };
  isVisible: boolean;
}

export function NFTPreview({
  formData,
  uploadedFiles,
  isVisible,
}: NFTPreviewProps) {
  if (!isVisible) {
    return (
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 h-fit">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            NFT Preview
          </h3>
          <p className="text-slate-400">
            Complete the form to see your NFT preview
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 sticky top-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">👁️</span>
              NFT Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Preview */}
            <div className="aspect-square rounded-xl overflow-hidden bg-slate-800/50 relative">
              {uploadedFiles.artwork ? (
                <img
                  src={
                    URL.createObjectURL(uploadedFiles.artwork) ||
                    "/placeholder.svg"
                  }
                  alt="NFT Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {formData.type === "audio" ? (
                    <Music className="w-16 h-16 text-purple-400" />
                  ) : (
                    <ImageIcon className="w-16 h-16 text-cyan-400" />
                  )}
                </div>
              )}

              {formData.type && (
                <div className="absolute top-4 left-4">
                  <Badge
                    variant="secondary"
                    className="bg-purple-500/20 text-purple-300 border-purple-500/30 backdrop-blur-sm"
                  >
                    {formData.type === "audio" ? "Audio NFT" : "Digital Art"}
                  </Badge>
                </div>
              )}
            </div>

            {/* NFT Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {formData.title || "Untitled NFT"}
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  {formData.description || "No description provided"}
                </p>
              </div>

              {/* Creator Info */}
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-purple-600 text-white text-sm">
                    {formData.creator
                      ? formData.creator.charAt(0).toUpperCase()
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs text-slate-400">Creator</p>
                  <p className="text-sm font-medium text-white">
                    {formData.creator || "Unknown Creator"}
                  </p>
                </div>
              </div>

              {/* Price */}
              {formData.price && <Rates nftPrice={Number(formData.price)} />}

              {/* Tags */}
              {formData.tags && (
                <div>
                  <p className="text-sm text-slate-400 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags
                      .split(",")
                      .map((tag: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-slate-600 text-slate-300 text-xs"
                        >
                          {tag.trim()}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

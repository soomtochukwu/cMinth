"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, Clock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface NFT {
  id: string;
  title: string;
  creator: string;
  price: number;
  image: string;
  type: "audio" | "art";
}

interface PurchaseModalProps {
  nft: NFT;
  isOpen: boolean;
  onClose: () => void;
}

export function PurchaseModal({ nft, isOpen, onClose }: PurchaseModalProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  const handlePurchase = async () => {
    setIsPurchasing(true);

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setPurchaseComplete(true);
      toast.success("NFT purchased successfully! 🎉");

      setTimeout(() => {
        onClose();
        setPurchaseComplete(false);
      }, 2000);
    } catch (error) {
      toast.error("Purchase failed. Please try again.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const platformFee = nft.price * 0.1;
  const creatorEarnings = nft.price * 0.9;
  const gasEstimate = 0.005;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {purchaseComplete ? "Purchase Complete!" : "Purchase NFT"}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {purchaseComplete ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
              <p className="text-slate-300">
                You now own{" "}
                <span className="text-purple-300 font-semibold">
                  {nft.title}
                </span>
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* NFT Preview */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">
                        {nft.title}
                      </h3>
                      <p className="text-slate-400 text-sm">by {nft.creator}</p>
                      <Badge
                        variant="secondary"
                        className="bg-purple-500/20 text-purple-300 border-purple-500/30 mt-1"
                      >
                        {nft.type === "audio" ? "Audio NFT" : "Digital Art"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Purchase Details */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">NFT Price</span>
                    <span className="text-white font-medium">
                      {nft.price} LSK
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Platform Fee (10%)</span>
                    <span className="text-slate-400">
                      {platformFee.toFixed(4)} LSK
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">
                      Creator Earnings (90%)
                    </span>
                    <span className="text-emerald-400">
                      {creatorEarnings.toFixed(4)} LSK
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Estimated Gas</span>
                    <span className="text-slate-400">{gasEstimate} LSK</span>
                  </div>

                  <Separator className="bg-slate-600" />

                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Total</span>
                    <span className="text-white font-bold text-lg">
                      {(nft.price + gasEstimate).toFixed(4)} LSK
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Security Features */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Shield className="w-6 h-6 text-emerald-400" />
                  <span className="text-xs text-slate-400">Secure</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Zap className="w-6 h-6 text-purple-400" />
                  <span className="text-xs text-slate-400">Instant</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Clock className="w-6 h-6 text-cyan-400" />
                  <span className="text-xs text-slate-400">24/7</span>
                </div>
              </div>

              {/* Purchase Button */}
              <Button
                onClick={handlePurchase}
                disabled={isPurchasing}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 text-lg"
              >
                {isPurchasing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Transaction...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Purchase for {nft.price} LSK
                  </>
                )}
              </Button>

              <p className="text-xs text-slate-400 text-center">
                By purchasing, you agree to our terms of service and confirm
                ownership transfer via blockchain.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

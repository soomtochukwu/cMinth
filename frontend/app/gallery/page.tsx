"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Grid, List } from "lucide-react";
import { NFTCard } from "@/components/nft-card";
import { useNFTStore } from "@/store/nft-store";
import { AnimatedBackground } from "@/components/animated-background";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

export default function MarketplacePage() {
  const //
    { nfts, isLoading, fetchNFTs } = useNFTStore(),
    [searchTerm, setSearchTerm] = useState(""),
    [sortBy, setSortBy] = useState("newest"),
    [filterBy, setFilterBy] = useState("all"),
    [viewMode, setViewMode] = useState<"grid" | "list">("grid"),
    //
    filteredNFTs = nfts.filter((nft) => {
      const matchesSearch =
        nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.creator.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === "all" || nft.type === filterBy;
      return matchesSearch && matchesFilter;
    }),
    [isMobile, setIsMobile] = useState(false),
    handleRefresh = async () => {
      if (nfts.length > 0) return;
      const freshNFTs = await fetchNFTs();
      console.log("Got fresh NFTs:", freshNFTs);
    };

  useEffect(() => {
    handleRefresh();
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {

    isMobile ? setViewMode("list") : setViewMode("grid");
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />

      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Discover Amazing NFTs
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Explore unique digital art and audio content from creators around
              the world
            </p>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Search NFTs, creators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>

                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-40 bg-slate-800/50 border-slate-600 text-white">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="art">Digital Art</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-slate-800/50 border-slate-600 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="p-2"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="p-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge
                variant="secondary"
                className="bg-purple-500/20 text-purple-300 border-purple-500/30"
              >
                {filteredNFTs.length} NFTs found
              </Badge>
            </div>
          </motion.div>

          {/* NFT Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-800/50 rounded-2xl p-4 animate-pulse"
                >
                  <div className="aspect-square bg-slate-700 rounded-xl mb-4"></div>
                  <div className="h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`grid gap-6 ${viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
                }`}
            >
              {filteredNFTs.map((nft, index) => (
                <motion.div key={nft.id} variants={itemVariants}>
                  <NFTCard nft={nft} viewMode={viewMode} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {filteredNFTs.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-2 text-slate-300">
                No NFTs found
              </h3>
              <p className="text-slate-400">
                Try adjusting your search or filters, refreshing the page, or{" "}
                <b className="text-white">connecting your wallet</b> if you
                haven't yet.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

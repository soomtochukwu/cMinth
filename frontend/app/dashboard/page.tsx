"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, ShoppingBag, TrendingUp, Sparkles } from "lucide-react";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { NFTGrid } from "@/components/dashboard/NftGrid";
import { AnimatedBackground } from "@/components/animated-background";
import { useAccount } from "wagmi";
import { useNFTStore } from "@/store/nft-store";
import useDashboardStats from "@/hooks/use-dashboard-stats";
import useUserNFTs from "@/hooks/use-user-nfts";
import useUserActivities from "@/hooks/use-user-activities";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/DashboardStats";
import { EarningsChart } from "@/components/dashboard/EarningsChart";

const mockEarningsData = [
  { month: "Dec", primary: 0, royalties: 0 },
  { month: "Jan", primary: 0, royalties: 0 },
  { month: "Feb", primary: 0, royalties: 0 },
  { month: "Mar", primary: 0, royalties: 0 },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { address: account, isConnected } = useAccount();
  const setUserAddress = useNFTStore((state) => state.setUserAddress);
  const { stats, fetchDashboardData, refreshDashboard } = useDashboardStats();
  const { createdNFTs, purchasedNFTs, allNFTs, isLoading } = useUserNFTs();
  const { activities, fetchUserActivities } = useUserActivities();

  // Updating the userAddress in the store when account changes
  useEffect(
    function () {
      setUserAddress(account || null);
    },
    [account, setUserAddress]
  );

  // Fetching dashboard data onmount
  useEffect(
    function () {
      if (account && isConnected) {
        fetchDashboardData(account);
        fetchUserActivities(account);
      }
    },
    [account, isConnected, fetchDashboardData, fetchUserActivities]
  );

  // Manually refreshing the dashboard
  const handleRefresh = async () => {
    if (!account) return;
    setIsRefreshing(true);

    try {
      await refreshDashboard();
    } catch (error) {
      console.error("Failed to refresh dashboard:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Transforming NFTs to match the frontend format
  const transformedNFTs = (nfts: typeof createdNFTs) => {
    return nfts.map((nft) => ({
      id: nft.id,
      title: nft.title,
      description: nft.description,
      image: nft.image || "/placeholder.svg?height=200&width=300",
      price: nft.price.toString(),
      status: "minted" as const, // You can enhance this logic based on your contract
      royalty: 10,
      createdAt: nft.createdAt,
    }));
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-24 bg-slate-950">
        <AnimatedBackground />

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
              <p className="text-slate-300 mb-6">
                Connect your wallet to view your NFT dashboard with real-time
                blockchain data
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 text-white bg-slate-950">
      <AnimatedBackground />

      <div className="relative container mx-auto px-4 pb-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="created">Created</TabsTrigger>
            <TabsTrigger value="collected">Purchased</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="NFTs Created"
                value={stats.nftsCreated}
                description="Total minted by you"
                // trend={{ value: 12, isPositive: true }}
                icon={<Palette className="h-4 w-4 text-blue-500" />}
              />
              <StatsCard
                title="NFTs Purchased"
                value={stats.nftsPurchased}
                description="In your collection"
                // trend={{ value: 8, isPositive: true }}
                icon={<ShoppingBag className="h-4 w-4 text-green-500" />}
              />
              <StatsCard
                title="Total Earnings"
                value={`${stats.totalEarnings} ETH`}
                description="Lifetime earnings"
                // trend={{ value: 23, isPositive: true }}
                icon={<TrendingUp className="h-4 w-4 text-purple-500" />}
              />
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EarningsChart
                data={mockEarningsData}
                totalEarnings={stats.totalEarnings}
                monthlyChange={0}
              />
              <ActivityFeed activities={activities} />
            </div>

            {/* Recent NFTs */}
            <NFTGrid
              nfts={transformedNFTs(allNFTs.slice(0, 3))}
              title="Recent Creations"
            />
          </TabsContent>

          <TabsContent value="created">
            <NFTGrid
              nfts={transformedNFTs(createdNFTs)}
              title="Your Created NFTs"
            />
          </TabsContent>

          <TabsContent value="purchased">
            <NFTGrid
              nfts={transformedNFTs(purchasedNFTs)}
              title="Your NFT Collection"
            />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityFeed activities={activities} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

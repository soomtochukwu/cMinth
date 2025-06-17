"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Palette,
  ShoppingBag,
  TrendingUp,
  Users,
  Plus,
  Settings,
  Bell,
  Home,
  Search,
} from "lucide-react";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { NFTGrid } from "@/components/dashboard/NftGrid";
import { EarningsChart } from "@/components/dashboard/EarningsChart";
import { StatsCard } from "@/components/dashboard/DashboardStats";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatedBackground } from "@/components/animated-background";

// Mock data - replace with real API calls
const mockStats = {
  nftsCreated: 24,
  nftsPurchased: 12,
  totalEarnings: "15.7",
};

const mockNFTs = [
  {
    id: "1",
    title: "Digital Harmony #001",
    description: "Abstract digital art with vibrant colors",
    image: "/placeholder.svg?height=200&width=300",
    price: "2.5",
    status: "listed" as const,
    views: 234,
    likes: 45,
    royalty: 10,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Cosmic Dreams",
    description: "Space-themed generative art",
    image: "/placeholder.svg?height=200&width=300",
    price: "1.8",
    status: "sold" as const,
    views: 567,
    likes: 89,
    royalty: 15,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    title: "Urban Pulse",
    description: "City-inspired audio-visual NFT",
    image: "/placeholder.svg?height=200&width=300",
    price: "3.2",
    status: "minted" as const,
    views: 123,
    likes: 23,
    royalty: 12,
    createdAt: "2024-01-20",
  },
];

const mockActivities = [
  {
    id: "1",
    type: "sale" as const,
    title: "Cosmic Dreams sold",
    description: "Your NFT was purchased by @artlover123",
    amount: "1.8 ETH",
    timestamp: "2024-01-20T10:30:00Z",
  },
  {
    id: "2",
    type: "mint" as const,
    title: "Urban Pulse minted",
    description: "Successfully minted new NFT with 12% royalty",
    timestamp: "2024-01-20T09:15:00Z",
  },
  {
    id: "3",
    type: "purchase" as const,
    title: "Purchased Neon Nights",
    description: "Added to your collection from @creator456",
    amount: "0.9 ETH",
    timestamp: "2024-01-19T16:45:00Z",
  },
];

const mockEarningsData = [
  { month: "Dec", primary: 4.2, royalties: 0.8 },
  { month: "Jan", primary: 6.1, royalties: 1.2 },
  { month: "Feb", primary: 3.8, royalties: 1.5 },
  { month: "Mar", primary: 8.3, royalties: 2.1 },
];

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/marketplace", label: "Marketplace", icon: Search },
  { href: "/create", label: "Create", icon: Plus },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br via-purple-900 to-slate-900">
      <AnimatedBackground />

      <div className="container mx-auto px-4 pb-8">
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
                value={mockStats.nftsCreated}
                description="Total minted by you"
                trend={{ value: 12, isPositive: true }}
                icon={<Palette className="h-4 w-4 text-blue-500" />}
              />
              <StatsCard
                title="NFTs Purchased"
                value={mockStats.nftsPurchased}
                description="In your collection"
                trend={{ value: 8, isPositive: true }}
                icon={<ShoppingBag className="h-4 w-4 text-green-500" />}
              />
              <StatsCard
                title="Total Earnings"
                value={`${mockStats.totalEarnings} ETH`}
                description="Lifetime earnings"
                trend={{ value: 23, isPositive: true }}
                icon={<TrendingUp className="h-4 w-4 text-purple-500" />}
              />
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EarningsChart
                data={mockEarningsData}
                totalEarnings={mockStats.totalEarnings}
                monthlyChange={23}
              />
              <ActivityFeed activities={mockActivities} />
            </div>

            {/* Recent NFTs */}
            <NFTGrid nfts={mockNFTs.slice(0, 3)} title="Recent Creations" />
          </TabsContent>

          <TabsContent value="created">
            <NFTGrid
              nfts={mockNFTs.filter((nft) =>
                ["minted", "listed", "sold"].includes(nft.status)
              )}
              title="Your Created NFTs"
            />
          </TabsContent>

          <TabsContent value="collected">
            <NFTGrid
              nfts={mockNFTs.filter((nft) => nft.status === "sold")}
              title="Your NFT Collection"
            />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityFeed activities={mockActivities} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

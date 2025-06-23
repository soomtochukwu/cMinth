"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Heart, Share2, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import Rates from "../Rates"

interface NFT {
  id: string
  title: string
  description: string
  image: string
  price: string
  status: "minted"
  royalty: number
  createdAt: string
}

interface NFTGridProps {
  nfts: NFT[]
  title: string
}

export function NFTGrid({ nfts, title }: NFTGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "minted":
        return "bg-blue-500"
      case "listed":
        return "bg-green-500"
      case "sold":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.map((nft) => (
          <Card key={nft.id} className="overflow-hidden">
            <div className="relative">
              <Image
                src={nft.image || "/placeholder.svg"}
                alt={nft.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <Badge className={`absolute top-2 right-2 ${getStatusColor(nft.status)}`}>{nft.status}</Badge>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{nft.title}</CardTitle>
              <CardDescription className="text-sm">{nft.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Rates nftPrice={Number(nft.price)} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

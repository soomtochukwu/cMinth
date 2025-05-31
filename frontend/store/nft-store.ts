import { create } from "zustand"

interface NFT {
  id: string
  title: string
  description: string
  creator: string
  price: number
  image: string
  audio?: string
  type: "audio" | "art"
  tags?: string[]
  createdAt: string
  tokenId: number
  owner: string
}

interface NFTState {
  nfts: NFT[]
  isLoading: boolean
  addNFT: (nft: NFT) => void
  setLoading: (loading: boolean) => void
}

// Update the mockNFTs array to use valid audio URLs or remove them
const mockNFTs: NFT[] = [
  {
    id: "1",
    title: "Ethereal Waves",
    description:
      "A mesmerizing ambient track that captures the essence of digital consciousness flowing through cyberspace.",
    creator: "SoundScape",
    price: 0.5,
    image: "/placeholder.svg?height=400&width=400",
    // Remove the non-existent audio file reference
    type: "audio",
    tags: ["ambient", "electronic", "meditation"],
    createdAt: "2024-01-15T10:30:00Z",
    tokenId: 1001,
    owner: "0x1234...5678",
  },
  {
    id: "2",
    title: "Neon Dreams",
    description:
      "A vibrant digital artwork exploring the intersection of technology and human emotion in a cyberpunk aesthetic.",
    creator: "PixelMaster",
    price: 1.2,
    image: "/placeholder.svg?height=400&width=400",
    type: "art",
    tags: ["cyberpunk", "neon", "digital"],
    createdAt: "2024-01-14T15:45:00Z",
    tokenId: 1002,
    owner: "0x5678...9012",
  },
  {
    id: "3",
    title: "Cosmic Journey",
    description:
      "An epic orchestral piece that takes listeners on a journey through the cosmos, blending classical and electronic elements.",
    creator: "CosmicComposer",
    price: 0.8,
    image: "/placeholder.svg?height=400&width=400",
    // Remove the non-existent audio file reference
    type: "audio",
    tags: ["orchestral", "space", "epic"],
    createdAt: "2024-01-13T09:20:00Z",
    tokenId: 1003,
    owner: "0x9012...3456",
  },
  {
    id: "4",
    title: "Abstract Emotions",
    description:
      "A powerful abstract piece that visualizes the complexity of human emotions through bold colors and dynamic forms.",
    creator: "AbstractArtist",
    price: 0.6,
    image: "/placeholder.svg?height=400&width=400",
    type: "art",
    tags: ["abstract", "emotions", "colorful"],
    createdAt: "2024-01-12T14:10:00Z",
    tokenId: 1004,
    owner: "0x3456...7890",
  },
]

export const useNFTStore = create<NFTState>((set) => ({
  nfts: mockNFTs,
  isLoading: false,
  addNFT: (nft) => set((state) => ({ nfts: [nft, ...state.nfts] })),
  setLoading: (loading) => set({ isLoading: loading }),
}))

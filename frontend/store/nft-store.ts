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
    title: "Laho",
    description:
      "A mesmerizing ambient track that captures the essence of digital consciousness flowing through cyberspace.",
    creator: "Shallipopi",
    price: 150,
    image: "/music/cover/laho.png?height=400&width=400",
    // Remove the non-existent audio file reference
    type: "audio",
    audio: "/music/laho.mp3",
    tags: ["Afropop", "High", "Weed"],
    createdAt: "2024-01-15T10:30:00Z",
    tokenId: 1001,
    owner: "0x1234...5678",
  },
  {
    id: "2",
    title: "OT",
    description:
      "...Screenshots taken according to Santiago's instruction during the first class (orientation) .",
    creator: "MaZiOfWeb3",
    price: 2000,
    image: "/OT.png",
    type: "art",
    tags: ["blockchain", "bootcamp", "task"],
    createdAt: "2025-04-14T15:45:00Z",
    tokenId: 1002,
    owner: "0x5678...9012",
  },
  {
    id: "3",
    title: "Rush",
    description:
      "An epic orchestral piece that takes listeners on a journey through the cosmos, blending classical and electronic elements.",
    creator: "Ayra Star",
    price: 137.32,
    image: "/music/cover/rush.png?height=400&width=400",
    // Remove the non-existent audio file reference
    type: "audio",
    audio: "/music/rush.mp3",
    tags: ["Afropop", "Vibes", "epic"],
    createdAt: "2024-01-13T09:20:00Z",
    tokenId: 1003,
    owner: "0x9012...3456",
  },
  {
    id: "4",
    title: "MaziOfWeb3",
    description:
      "Ghibli portrait.",
    creator: "MaziOfWeb3",
    price: 500,
    image: "/me.jpg",
    type: "art",
    tags: ["AI", "fun", "colorful", "innit"],
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

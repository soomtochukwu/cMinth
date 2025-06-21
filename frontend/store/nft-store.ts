import { create } from "zustand";
import { readContract } from "@wagmi/core";
import { Cr8orAbi, Cr8orAddress } from "@/lib/var";
import { createConfig, http } from "wagmi";
import { lisk, liskSepolia, localhost } from "wagmi/chains";
import { formatEther } from "viem";

const config = createConfig({
  chains: [lisk, liskSepolia, localhost],
  transports: {
    [liskSepolia.id]: http(),
    [localhost.id]: http(),
    [lisk.id]: http(),
  },
});

interface NFT {
  id: string;
  title: string;
  description: string;
  creator: string;
  price: number;
  image: string;
  audio?: string;
  type: "audio" | "art";
  tags?: string[];
  createdAt: string;
  tokenId: number;
  owner: string;
}

export interface Activity {
  id: string;
  type: "mint" | "purchase" | "sale";
  title: string;
  description: string;
  timestamp: string;
  tokenId?: string;
  amount?: string;
}

interface DashboardStats {
  nftsCreated: number;
  nftsPurchased: number;
  totalEarnings: string;
  loading: boolean;
  error: string | null;
}

interface NFTState {
  nfts: NFT[];
  isLoading: boolean;
  error: string | null;
  dashboardStats: DashboardStats;
  activities: Activity[];
  userAddress: string | null;
  addNFT: (nft: NFT) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUserAddress: (address: string | null) => void;
  fetchNFTs: () => Promise<NFT[]>;
  fetchDashboardData: (userAddress: string) => Promise<void>;
  fetchUserActivites: (userAddress: string) => Promise<Activity[]>;
  refreshDashboard: () => Promise<void>;
}

export const useNFTStore = create<NFTState>((set, get) => ({
  nfts: [],
  isLoading: false,
  error: null,
  userAddress: null,
  dashboardStats: {
    nftsCreated: 0,
    nftsPurchased: 0,
    totalEarnings: "0",
    loading: false,
    error: null,
  },
  activities: [],
  addNFT: (nft) => set((state) => ({ nfts: [nft, ...state.nfts] })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setUserAddress: (address) => set({ userAddress: address }),
  fetchNFTs: async (): Promise<NFT[]> => {
    set({ isLoading: true, error: null });
    try {
      // 1. Get total supply
      const totalSupply = (await readContract(config, {
        address: Cr8orAddress,
        abi: Cr8orAbi,
        functionName: "totalSupply",
      })) as bigint;

      const totalSupplyNumber = Number(totalSupply);

      if (totalSupplyNumber === 0) {
        set({ nfts: [], isLoading: false });
        return []; // Return empty array when no NFTs
      }

      // 2. Fetch all tokenURIs and metadata with error handling
      const nftPromises = [];
      for (let i = 0; i < totalSupplyNumber; i++) {
        nftPromises.push(
          (async () => {
            try {
              // Get tokenId (assuming 1-indexed tokens)
              const tokenId = i;

              // 3. Get tokenURI
              const tokenURI = (await readContract(config, {
                address: Cr8orAddress,
                abi: Cr8orAbi,
                functionName: "tokenURI",
                args: [BigInt(tokenId)],
              })) as string;

              if (!tokenURI) {
                console.warn(`Empty tokenURI for token ${tokenId}`);
                return null;
              }

              // 4. Fetch metadata from tokenURI (handle ipfs:// links)
              let url = tokenURI;
              if (url.startsWith("ipfs://")) {
                url = url.replace("ipfs://", "https://ipfs.io/ipfs/");
              }

              // Add timeout and better error handling for metadata fetch
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

              const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                  Accept: "application/json",
                },
              });
              clearTimeout(timeoutId);

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const meta = await response.json();

              // Get owner of the token
              let owner = "";
              try {
                owner = (await readContract(config, {
                  address: Cr8orAddress,
                  abi: Cr8orAbi,
                  functionName: "ownerOf",
                  args: [BigInt(tokenId)],
                })) as string;
              } catch (ownerError) {
                console.warn(
                  `Could not fetch owner for token ${tokenId}:`,
                  ownerError
                );
              }

              // 5. Return NFT object with fallback values
              return {
                id: tokenId.toString(),
                title: meta.title,
                description: meta.description || "",
                creator: meta.creator || meta.artist || "",
                price: meta.price || 0,
                image: meta.image || "",
                audio: meta.audio,
                type: meta.type,
                tags: meta.tags || [],
                createdAt: meta.createdAt,
                tokenId,
                owner,
              } as NFT
            } catch (tokenError) {
              console.error(`Failed to fetch token ${i + 1}:`, tokenError);
              return null;
            }
          })()
        );
      }

      // Wait for all promises and filter out failed ones
      const results = await Promise.allSettled(nftPromises);
      const nfts = results
        .filter(
          (result): result is PromiseFulfilledResult<NFT> =>
            result.status === "fulfilled" && result.value !== null
        )
        .map((result) => result.value);

      set({ nfts, isLoading: false });
      return nfts; // Return the fetched NFTs
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch NFTs";
      console.error("Failed to fetch NFTs", error);
      set({ error: errorMessage, isLoading: false });
      return []; // Return empty array on error
    }
  },
  fetchDashboardData: async (userAddress: string): Promise<void> => {
    if (!userAddress) return;

    set((state) => ({
      dashboardStats: { ...state.dashboardStats, loading: true, error: null },
    }));

    try {
      // Getting the current nfts if they aren't available
      let { nfts } = get();
      if (nfts.length === 0) {
        nfts = await get().fetchNFTs();
      }

      // Calculating the NFTs created by the user
      const nftsCreated = nfts.filter(
        (nft) => nft.creator.toLowerCase() === userAddress.toLowerCase()
      ).length;

      // Calculating the NFTs purchased by the user
      const nftsPurchased = nfts.filter(
        (nft) =>
          nft.owner.toLowerCase() === userAddress.toLowerCase() &&
          nft.creator.toLowerCase() !== userAddress.toLowerCase()
      ).length;

      // Getting creator earnings from contract
      let totalEarnings = "0";
      try {
        const earnings = (await readContract(config, {
          address: Cr8orAddress,
          abi: Cr8orAbi,
          functionName: "creatorEarnings",
          args: [userAddress as `0x${string}`],
        })) as bigint;

        totalEarnings = formatEther(earnings);
      } catch (earningsError) {
        console.warn("Could not fetch creator earnings", earningsError);
      }

      set((state) => ({
        dashboardStats: {
          nftsCreated,
          nftsPurchased,
          totalEarnings,
          loading: false,
          error: null,
        },
      }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch dashboard data";
      console.error("Failed to fetch dashboard data", err);

      set((state) => ({
        dashboardStats: {
          ...state.dashboardStats,
          loading: false,
          error: errorMessage,
        },
      }));
    }
  },
  fetchUserActivites: async (userAddress: string): Promise<Activity[]> => {
    if (!userAddress) return [];

    try {
      const activities: Activity[] = [];
      const { nfts } = get();

      // Getting user's created NFTs for mint activities
      const userCreatedNFTs = nfts.filter(
        (nft) => nft.creator.toLowerCase() === userAddress.toLowerCase()
      );

      // Adding the mint activities
      userCreatedNFTs.forEach((nft) => {
        activities.push({
          id: `mint-${nft.tokenId}`,
          type: "mint",
          title: `${nft.title} minted`,
          description: "Successfully minted new NFT",
          timestamp: nft.createdAt,
          tokenId: nft.tokenId.toString(),
        });
      });

      // Getting the nfts that the user purchased
      const userPurchasedNFTs = nfts.filter(
        (nft) =>
          nft.owner.toLowerCase() === userAddress.toLowerCase() &&
          nft.creator.toLowerCase() !== userAddress.toLowerCase()
      );

      userPurchasedNFTs.forEach((nft) => {
        activities.push({
          id: `purchase-${nft.tokenId}`,
          type: "purchase",
          title: `${nft.title} purchased`,
          description: `Added to your collection from ${nft.creator.slice(0, 6)}...${nft.creator.slice(-4)}`,
          timestamp: new Date().toISOString(), // get the actual purchase date later
          tokenId: nft.tokenId.toString(),
          amount: nft.price > 0 ? `${nft.price} ETH` : undefined,
        });
      });

      // Sorting the activities by most recent first
      const sortedActivities = activities
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 10);

      set({ activities: sortedActivities });
      return sortedActivities;
    } catch (error) {
      console.error("Failed to fetch user activities:", error);
      return [];
    }
  },
  refreshDashboard: async (): Promise<void> => {
    const { userAddress, fetchNFTs, fetchDashboardData, fetchUserActivites } =
      get();

    if (!userAddress) return;

    try {
      await fetchNFTs();

      await Promise.all([
        fetchDashboardData(userAddress),
        fetchUserActivites(userAddress),
      ]);
    } catch (error) {
      console.error("Failed to refresh dashboard:", error);
    }
  },
}));

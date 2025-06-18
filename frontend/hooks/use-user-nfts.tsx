import { useNFTStore } from "@/store/nft-store";

export default function useUserNFTs() {
  const store = useNFTStore();
  const userAddress = store.userAddress;

  const createdNFTs = store.nfts.filter(
    (nft) =>
      userAddress && nft.creator.toLowerCase() === userAddress.toLowerCase()
  );

  const purchasedNFTs = store.nfts.filter(
    (nft) =>
      userAddress &&
      nft.owner.toLowerCase() === userAddress.toLowerCase() &&
      nft.creator.toLowerCase() !== userAddress.toLowerCase()
  );

  return {
    createdNFTs,
    purchasedNFTs,
    allNFTs: store.nfts,
    isLoading: store.isLoading,
  };
}

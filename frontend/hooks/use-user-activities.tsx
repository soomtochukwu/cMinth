import { useNFTStore } from "@/store/nft-store";

export default function useUserActivities() {
  const store = useNFTStore();
  return {
    activities: store.activities,
    fetchUserActivities: store.fetchUserActivites,
  };
}

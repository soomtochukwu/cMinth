import { useNFTStore } from "@/store/nft-store";

export default function useDashboardStats() {
  const store = useNFTStore();
  return {
    stats: store.dashboardStats,
    fetchDashboardData: store.fetchDashboardData,
    refreshDashboard: store.refreshDashboard,
  };
};
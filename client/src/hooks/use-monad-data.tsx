import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { MonadApi } from "@/lib/monad-api";
import { BlockchainData } from "@/types/blockchain";

export function useMonadData(autoRefresh: boolean = true) {
  const [api] = useState(() => new MonadApi());

  const { data, isLoading, error, refetch } = useQuery<BlockchainData>({
    queryKey: ['/api/monad/dashboard-data'],
    queryFn: async () => {
      try {
        return await api.getDashboardData();
      } catch (err) {
        console.error('Failed to fetch Monad data:', err);
        throw new Error(err instanceof Error ? err.message : 'Unknown error occurred');
      }
    },
    refetchInterval: autoRefresh ? 3000 : false,
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors
      if (failureCount >= 3) return false;
      
      // Don't retry for authentication errors
      if (error?.message?.includes('401') || error?.message?.includes('403')) {
        return false;
      }
      
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Manual refresh function
  const refresh = () => {
    refetch();
  };

  return {
    data,
    isLoading,
    error,
    refresh
  };
}

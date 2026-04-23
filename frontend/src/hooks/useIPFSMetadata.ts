import { useQuery } from '@tanstack/react-query';
import { fetchFromIPFS, ProjectMetadata } from '../ipfs';

export const useIPFSMetadata = (cid: string | undefined) => {
  return useQuery<ProjectMetadata | null>({
    queryKey: ['ipfsMetadata', cid],
    queryFn: async () => {
      if (!cid) return null;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
        const result = await fetchFromIPFS(cid);
        clearTimeout(timeout);
        return result;
      } catch (error) {
        console.error('Failed to fetch IPFS metadata:', error);
        return null; // Returns null so UI can show fallback instead of spinning forever
      }
    },
    enabled: !!cid,
    staleTime: 60000,
    retry: 2,
    retryDelay: 2000,
  });
};

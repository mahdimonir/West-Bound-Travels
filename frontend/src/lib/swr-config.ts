import { SWRConfiguration } from 'swr';
import { fetcher } from './apiClient';

/**
 * Global SWR configuration
 * Provides sensible defaults for data fetching and caching
 */
export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: false,
  dedupingInterval: 2000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
};

export default swrConfig;

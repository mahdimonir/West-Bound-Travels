import useSWR from 'swr';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationsResponse {
  notifications: Notification[];
}

/**
 * SWR hook for fetching user notifications
 * Automatically refetches and caches data
 */
export function useNotifications() {
  const { data, error, isLoading, mutate } = useSWR<NotificationsResponse>(
    '/notifications',
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    notifications: data?.notifications || [],
    isLoading,
    isError: error,
    mutate,
  };
}

import api from '@/lib/api';

/**
 * SWR-compatible fetcher function
 * Automatically includes auth token and handles errors
 */
export async function fetcher<T = unknown>(path: string): Promise<T> {
  try {
    const data = await api.get<T>(path);
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch data';
    throw new Error(message);
  }
}

/**
 * API client wrapper with methods for all HTTP verbs
 */
export const apiClient = {
  get: <T = unknown>(path: string) => fetcher<T>(path),
  post: <T = unknown>(path: string, body?: object) => api.post<T>(path, body),
  put: <T = unknown>(path: string, body?: object) => api.put<T>(path, body),
  delete: <T = unknown>(path: string) => api.del<T>(path),
};

export default apiClient;

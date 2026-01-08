const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface ApiError {
  message: string;
}

async function request<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(url, { ...options, headers });
    const contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
      let message = `Request failed (${res.status})`;
      if (contentType.includes("application/json")) {
        const data = await res.json();
        message = (data as ApiError).message || message;
      }
      throw new Error(message);
    }

    if (contentType.includes("application/json")) {
      return res.json() as Promise<T>;
    }
    return res.text() as Promise<T>;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    throw new Error(msg);
  }
}

export const api = {
  get: <T = unknown>(path: string, config?: { params?: Record<string, unknown> }) => {
    let url = path;
    if (config?.params) {
      const queryParams = new URLSearchParams();
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url += `${url.includes('?') ? '&' : '?'}${queryString}`;
      }
    }
    return request<T>(url, { method: "GET" });
  },
  post: <T = unknown>(path: string, body?: object) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T = unknown>(path: string, body?: object) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T = unknown>(path: string, body?: object) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  del: <T = unknown>(path: string) => request<T>(path, { method: "DELETE" }),
};

export default api;

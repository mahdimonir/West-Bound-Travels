import { Destination } from "@/types";
import api from "../api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const destinationsService = {
  /** Get all destinations (public) */
  getDestinations: () => api.get<ApiResponse<Destination[]>>("/destinations"),
  /** Alias for getDestinations */
  getAll: () => api.get<ApiResponse<Destination[]>>("/destinations"),

  /** Get single destination by ID */
  getDestination: (id: string) => api.get<ApiResponse<Destination>>(`/destinations/${id}`),

  /** Create destination (admin, multipart) */
  createDestination: async (
    data: Partial<Destination>,
    files?: FileList
  ): Promise<ApiResponse<Destination>> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val !== undefined) {
        formData.append(key, typeof val === "object" ? JSON.stringify(val) : String(val));
      }
    });
    if (files) {
      Array.from(files).forEach((f) => formData.append("images", f));
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/destinations`,
      { method: "POST", headers, body: formData }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create destination");
    }
    return res.json();
  },

  /** Update destination (admin, multipart) */
  updateDestination: async (
    id: string,
    data: Partial<Destination>,
    files?: FileList
  ): Promise<ApiResponse<Destination>> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val !== undefined) {
        formData.append(key, typeof val === "object" ? JSON.stringify(val) : String(val));
      }
    });
    if (files) {
      Array.from(files).forEach((f) => formData.append("images", f));
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/destinations/${id}`,
      { method: "PUT", headers, body: formData }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update destination");
    }
    return res.json();
  },

  /** Delete destination (admin) */
  deleteDestination: (id: string) => api.del<ApiResponse<void>>(`/destinations/${id}`),
};

export default destinationsService;

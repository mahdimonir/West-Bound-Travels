import { Boat } from "@/types";
import api from "../api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const boatsService = {
  /** Get all boats (public) */
  getBoats: () => api.get<ApiResponse<Boat[]>>("/boats"),

  /** Get single boat by ID */
  getBoat: (id: string) => api.get<ApiResponse<Boat>>(`/boats/${id}`),

  /** Create boat (admin, multipart) */
  createBoat: async (
    data: Partial<Boat>,
    files?: FileList
  ): Promise<ApiResponse<Boat>> => {
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
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/boats`,
      { method: "POST", headers, body: formData }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create boat");
    }
    return res.json();
  },

  /** Update boat (admin, multipart) */
  updateBoat: async (
    id: string,
    data: Partial<Boat>,
    files?: FileList
  ): Promise<ApiResponse<Boat>> => {
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
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/boats/${id}`,
      { method: "PUT", headers, body: formData }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update boat");
    }
    return res.json();
  },

  /** Delete boat (admin) */
  deleteBoat: (id: string) => api.del<ApiResponse<void>>(`/boats/${id}`),
};

export default boatsService;

import { BlogPost } from "@/types";
import api from "../api";

export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface BlogWithDetails extends BlogPost {
  id: string;
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const blogsService = {
  /** Get published blogs (public) */
  getPublished: () => api.get<ApiResponse<BlogWithDetails[]>>("/blogs/published"),

  /** Get blog by slug (public) */
  getBySlug: (slug: string) => api.get<ApiResponse<BlogWithDetails>>(`/blogs/${slug}`),

  /** Get all blogs (admin) */
  getAll: () => api.get<ApiResponse<BlogWithDetails[]>>("/blogs"),

  /** Create blog (admin, multipart) */
  create: async (
    data: Partial<BlogPost>,
    files?: FileList
  ): Promise<ApiResponse<BlogWithDetails>> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val !== undefined) {
        formData.append(key, typeof val === "object" ? JSON.stringify(val) : String(val));
      }
    });
    if (files) {
      Array.from(files).forEach((f) => formData.append("image", f));
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/blogs`,
      { method: "POST", headers, body: formData }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create blog");
    }
    return res.json();
  },

  /** Update blog (admin, multipart) */
  update: async (
    id: string,
    data: Partial<BlogPost>,
    files?: FileList
  ): Promise<ApiResponse<BlogWithDetails>> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val !== undefined) {
        formData.append(key, typeof val === "object" ? JSON.stringify(val) : String(val));
      }
    });
    if (files) {
      Array.from(files).forEach((f) => formData.append("image", f));
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/blogs/${id}`,
      { method: "PATCH", headers, body: formData }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update blog");
    }
    return res.json();
  },

  /** Delete blog (admin) */
  delete: (id: string) => api.del<ApiResponse<void>>(`/blogs/${id}`),

  /** Update blog status (admin) */
  updateStatus: (id: string, status: BlogStatus) =>
    api.put<ApiResponse<BlogWithDetails>>(`/blogs/${id}/status`, { status }),
};

export default blogsService;

import api from "../api";

export interface GalleryItem {
  id: string;
  url: string;
  caption?: string;
  destination?: string;
  category?: string; // Category for organizing gallery images
  createdAt: string;
  // Backend compatibility fields
  src?: string;
  alt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const galleryService = {
  /** List all gallery images (public) */
  list: () => api.get<ApiResponse<GalleryItem[]>>("/gallery"),

  /** Upload gallery image (admin, multipart) */
  create: async (
    data: { caption?: string; destination?: string; category?: string },
    files: FileList
  ): Promise<ApiResponse<GalleryItem>> => {
    const formData = new FormData();
    if (data.caption) formData.append("caption", data.caption);
    if (data.destination) formData.append("destination", data.destination);
    if (data.category) formData.append("category", data.category);
    Array.from(files).forEach((f) => formData.append("image", f));

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/gallery`,
      { method: "POST", headers, body: formData }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to upload image");
    }
    return res.json();
  },

  /** Remove gallery image (admin) */
  remove: (id: string) => api.del<ApiResponse<void>>(`/gallery/${id}`),
};

export default galleryService;

import api from "../api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  preferences?: {
    mealType?: string;
    notifications?: boolean;
    [key: string]: any;
  };
  role: "CUSTOMER" | "ADMIN" | "MODERATOR";
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const usersService = {
  /** Get current user profile */
  getMe: () => api.get<ApiResponse<UserProfile>>("/users/me"),

  /** Update current user profile */
  updateMe: (data: Partial<Pick<UserProfile, "name" | "phone" | "bio" | "preferences">>) =>
    api.put<ApiResponse<UserProfile>>("/users/me", data),

  /** Upload avatar (multipart form) */
  updateAvatar: async (file: File): Promise<ApiResponse<UserProfile>> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/users/me/avatar`,
      { method: "POST", headers, body: formData }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to upload avatar");
    }
    return res.json();
  },

  /** Get all users (admin) */
  getAllUsers: () => api.get<ApiResponse<UserProfile[]>>("/users/admin/all"),

  /** Get admins list (admin) */
  getAdmins: () => api.get<ApiResponse<UserProfile[]>>("/users/admin/admins"),

  /** Update user role (admin) */
  updateUserRole: (userId: string, role: UserProfile["role"]) =>
    api.patch<ApiResponse<UserProfile>>(`/users/admin/${userId}/role`, { role }),
};

export default usersService;

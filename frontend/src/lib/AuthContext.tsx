"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "./api";

interface AuthResponseUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN" | "MODERATOR";
  phone?: string;
  avatar?: string;
  bio?: string;
  preferences?: any;
}

interface AuthResponse {
  success: boolean;
  user: AuthResponseUser;
  token: string;
}

type Role = "CUSTOMER" | "ADMIN" | "MODERATOR" | null;

interface User {
  id?: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
  bio?: string;
  preferences?: {
    mealType?: string;
    notifications?: boolean;
    [key: string]: any;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<User | null>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  });

  const authChannel = useMemo(() => {
    if (typeof window !== "undefined" && typeof BroadcastChannel !== "undefined") {
      return new BroadcastChannel("auth_sync");
    }
    return null;
  }, []);

  useEffect(() => {
    if (!authChannel) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "LOGIN") {
        setUser(event.data.user);
        setToken(event.data.token);
      } else if (event.data.type === "LOGOUT") {
        setUser(null);
        setToken(null);
      } else if (event.data.type === "UPDATE_USER") {
        setUser(event.data.user);
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(event.data.user));
        }
      }
    };

    authChannel.onmessage = handleMessage;
    
    // Cleanup: close the channel when component unmounts
    return () => {
      try {
        authChannel.close();
      } catch (error) {
        // Channel might already be closed
        console.warn("BroadcastChannel already closed");
      }
    };
  }, [authChannel]);

  useEffect(() => {
    // Keep legacy localStorage listener for fallback or other non-BroadcastChannel needs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "token") {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");
        setUser(savedUser ? JSON.parse(savedUser) : null);
        setToken(savedToken);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Helper function to safely post messages to BroadcastChannel
  const safePostMessage = (data: any) => {
    if (!authChannel) return;
    try {
      authChannel.postMessage(data);
    } catch (error) {
      // Channel might be closed, ignore the error
      console.warn("Failed to post message to BroadcastChannel:", error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    
    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    
    // Broadcast update to other tabs
    safePostMessage({
      type: "UPDATE_USER",
      user: updatedUser,
    });
  };

  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    try {
      const res = (await api.post("/auth/login", {
        email,
        password,
      })) as AuthResponse;
      const { user: u, token: t } = res;
      const normalizedUser: User = {
        id: u.id,
        name: u.name,
        email: u.email,
        role: (u.role as Role) ?? "CUSTOMER",
        phone: (u as any).phone,
        avatar: (u as any).avatar,
        bio: (u as any).bio,
        preferences: (u as any).preferences,
      };
      setUser(normalizedUser);
      setToken(t);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        localStorage.setItem("token", t);
        safePostMessage({ type: "LOGIN", user: normalizedUser, token: t });
      }
      return normalizedUser;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      throw new Error(message);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<User | null> => {
    try {
      const res = (await api.post("/auth/register", {
        name,
        email,
        password,
        phone,
      })) as AuthResponse;
      const { user: u, token: t } = res;
      const normalizedUser: User = {
        id: u.id,
        name: u.name,
        email: u.email,
        role: (u.role as Role) ?? "CUSTOMER",
        phone: (u as any).phone,
        avatar: (u as any).avatar,
        bio: (u as any).bio,
        preferences: (u as any).preferences,
      };
      setUser(normalizedUser);
      setToken(t);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        localStorage.setItem("token", t);
        safePostMessage({ type: "LOGIN", user: normalizedUser, token: t });
      }
      return normalizedUser;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      safePostMessage({ type: "LOGOUT" });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateUser, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

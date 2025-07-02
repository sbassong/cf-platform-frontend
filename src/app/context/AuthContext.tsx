"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { signOut as nextAuthSignOut } from "next-auth/react";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);


  useEffect(() => {
    // ref-based guard to prevent the effect from
    // running more than once in React's Strict Mode (in development).
    if (hasFetched.current) {
      return;
    }
    hasFetched.current = true;

    const checkBackendSession = async () => {
      try {
        const res = await fetch("/api/auth/session", {
          credentials: "include",
        });
        if (res.ok) {
          const userData: User = await res.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("No active backend session found.");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkBackendSession();
  }, []);

  const signOut = async () => {
    const isGoogleSession = document.cookie.includes("authjs.session-token");

    await fetch(`${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/auth/signout`, {
      method: "POST",
      credentials: "include",
    });

    // If it was a Google session, also sign out from NextAuth.js
    if (isGoogleSession) {
      await nextAuthSignOut({ redirect: false });
    }

    setUser(null);
    window.location.href = "/signin";
  };

  const value = { user, isLoading, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
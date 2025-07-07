"use client";

import React, { createContext, useContext, ReactNode } from "react";
import useSWR, { useSWRConfig } from "swr";
import { signOut as nextAuthSignOut } from "next-auth/react";
import type { User } from "@/types";
import { fetcher } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, error, isLoading } = useSWR<User | null>(
    "/auth/session",
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  const { mutate } = useSWRConfig();

  const signOut = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/auth/signout`, {
      method: "POST",
      credentials: "include",
    });
    await nextAuthSignOut({ redirect: false });

    mutate("/auth/session", null, false);
    window.location.href = "/signin";
  };

  const value = {
    user: user || null,
    isLoading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';


interface User {
  name: string;
  email: string;
  // will add any other fields that are common between your NestJS user and Google user
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: nextAuthSession, status: nextAuthStatus } = useSession();

  useEffect(() => {
    const checkBackendSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const userData = await res.json();
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

    if (nextAuthStatus === 'authenticated' && nextAuthSession?.user) {
      // Priority 1: User is logged in with NextAuth
      setUser({
        name: nextAuthSession.user.name ?? "User",
        email: nextAuthSession.user.email ?? "",
      });
      setIsLoading(false);
    } else if (nextAuthStatus !== 'loading') {
      // Priority 2: NextAuth is done loading and there's no user,
      // so we check for a session from backend.
      checkBackendSession();
    }
  }, [nextAuthSession, nextAuthStatus]);

  const signOut = async () => {
    // sign out from the NestJS backend (since custom cookie was set)
    await fetch(`${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/auth/signout`, {
      method: 'POST',
      credentials: 'include',
    });
    // and sign out from NextAuth
    await nextAuthSignOut({ redirect: true, callbackUrl: '/signin' });
    setUser(null);
  };

  const value = { user: user, isLoading, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
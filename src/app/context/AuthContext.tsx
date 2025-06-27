'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import type { User } from '@/types';

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
        const res = await fetch('/api/auth/session', {
          credentials: 'include',
        });
        if (res.ok) {
          const userData: User = await res.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('No active backend session found.');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (nextAuthStatus === 'authenticated' && nextAuthSession?.user) {
      // If there's a NextAuth session, we still need to fetch the full
      // user object from our backend to get the profile information.
      checkBackendSession();
    } else if (nextAuthStatus !== 'loading') {
      // If NextAuth is done and there's no session, check for a credentials-based session.
      checkBackendSession();
    }
  }, [nextAuthSession, nextAuthStatus]);

  const signOut = async () => {
    // Sign out from the NestJS backend
    await fetch(`${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/auth/signout`, {
      method: 'POST',
      credentials: 'include',
    });

    // Sign out from NextAuth.js if it was a Google session
    if (nextAuthSession) {
      await nextAuthSignOut({ redirect: true, callbackUrl: '/signin' });
    }

    setUser(null);
    window.location.href = '/signin';
  };

  const value = { user, isLoading, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
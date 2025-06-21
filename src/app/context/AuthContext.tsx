"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  userId: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

// create the Context and Provider Component
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkUserStatus() {
      try {
        // handles forwarding the cookie to the NestJS backend.
        const response = await fetch('/api/auth/session');

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user status", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    checkUserStatus();
  }, []);

  const value = { user, setUser, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// This is the custom hook components will use to access the context's values.
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
"use client"; // Context is a client-side feature, so this file must be a client component.

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // A library to decode JWTs

// Define the shape of the data stored in our context
interface User {
  userId: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

// 1. Create the Context
// The initial value is undefined because we won't have the user info right away.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Create the Provider Component
// This component will wrap our entire application and provide the context to all children.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On initial load, check if a token exists in local storage
  useEffect(() => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        // Decode the token to get user information
        const decodedUser: User = jwtDecode(token);
        setUser(decodedUser);
      }
    } catch (error) {
      console.error("Failed to decode token", error);
      // If token is invalid, ensure user state is null
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Create the Custom Hook
// This is the hook our components will use to access the context's values.
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
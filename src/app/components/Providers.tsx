// Necessary middle man component so that we can use session provider and 
// custom auth provider (which are inherently client component since they pass
// state) in layout
"use client";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../context/AuthContext"; // Your custom provider
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}
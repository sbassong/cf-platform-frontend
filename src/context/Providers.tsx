// Necessary middle man component so that we can use session provider and 
// custom auth provider (which are inherently client components since they pass
// state) in layout
"use client";
import { AuthProvider } from "./AuthContext";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
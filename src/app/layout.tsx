import type { Metadata } from "next";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import Providers from "../context/Providers";
import Navbar from "@/components/navbar/NavBar";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  title: "Childfree app",
  description: "Platform for the childfree community",
  icons: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("min-h-screen bg-background font-sans antialiased pt-14")}
      >
        <Providers>
          <Navbar />
          {children}
          <SonnerToaster />
        </Providers>
      </body>
    </html>
  );
}

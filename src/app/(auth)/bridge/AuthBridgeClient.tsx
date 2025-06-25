"use client";

import { useEffect, useState } from 'react';
import type { Session } from 'next-auth';

export default function AuthBridgeClient({ session }: { session: Session | null }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      const completeLogin = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/auth/provider`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: session.user?.email }),
              credentials: 'include',
            }
          );

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to create session with backend.');
          }

          window.location.href = '/';

        } catch (err: any) {
          setError(err.message || 'Could not complete sign-in. Please try again.');
          console.error(err);
        }
      };

      completeLogin();
    } else {
      setError("Session not found. You may need to sign in again.");
    }
  }, [session]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <p className="font-semibold text-red-500">Authentication Error</p>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Completing sign-in, please wait...</p>
    </div>
  );
}
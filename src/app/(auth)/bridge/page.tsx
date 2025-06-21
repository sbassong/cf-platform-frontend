"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthBridgePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      const completeLogin = async () => {
        try {
          // This fetch call comes from the BROWSER.
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/auth/provider`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: session?.user?.email }),
              credentials: 'include',
            }
          );
          const userres = res.json()
          console.log({userres})

          if (!res.ok) {
            throw new Error('Failed to create session with backend.');
          }

          // The NestJS cookie is now set! Redirect to the main app.
          // A window redirect ensures a full page reload, allowing AuthContext to re-check the session.
          window.location.href = '/about';

        } catch (err) {
          setError('Could not complete sign-in. Please try again.');
          console.error(err);
        }
      };

      completeLogin();
    }

    // If for some reason the session isn't authenticated, redirect to sign-in
    if (status === 'unauthenticated') {
      router.replace('/signin');
    }
  }, [status, session, router]);

  // Display a loading or error message to the user
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="font-semibold text-red-500">Authentication Error</p>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Completing sign-in, please wait...</p>
    </div>
  );
}
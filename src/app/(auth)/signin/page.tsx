'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useAuth } from '../../context/AuthContext'; 

export default function SigninPage() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGoogleLogin = async () => {
    // Use the `signIn` function from next-auth for the Google provider.
    // Set a callbackUrl to tell NextAuth where to go after success.
    // This will cause a page reload, triggering AuthContext's useEffect.
    console.log("google login triggered")
    const signUSer = await signIn('google', { callbackUrl: '/about' });
    console.log({signUSer})
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/auth/signin`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        }
      );

      const userData = await res.json();
      if (!res.ok) {
        throw new Error('Invalid email or password');
      }

      setUser(userData); // Update the global state with the returned user
      // router.push('/'); // Redirect to a protected page
      setError("successfully signed in!")
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-black rounded-2xl shadow-md">
        <h2 className="text-center text-2xl font-bold">Sign in</h2>

        <div className="space-y-2">
          <button onClick={handleGoogleLogin} className="w-full bg-red-500 text-white py-2 rounded">
            Sign in with Google
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 my-4">
          <div className="border-t w-full" />
          <span className="text-gray-400">or</span>
          <div className="border-t w-full" />
        </div>

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Sign in with Email
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Not a member yet?{' '}
          <Link href="/signup" className="text-blue-600 font-medium">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

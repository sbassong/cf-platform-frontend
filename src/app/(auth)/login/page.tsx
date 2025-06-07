'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    console.log(res)
    if (!res?.ok) setError('Invalid email or password')
    else console.log("signed in with user ", email)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-black rounded-2xl shadow-md">
        <h2 className="text-center text-2xl font-bold">Sign in</h2>

        <div className="space-y-2">
          <button onClick={() => signIn('google')} className="w-full bg-red-500 text-white py-2 rounded">
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

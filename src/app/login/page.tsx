'use client';

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Welcome Back 👋</h1>
        <p className="text-sm text-center text-gray-500">Sign in with your social account</p>

        <div className="space-y-4">
          <button
            onClick={() => signIn('google')}
            className="w-full px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition font-medium"
          >
            Continue with Google
          </button>
          <button
            onClick={() => signIn('github')}
            className="w-full px-4 py-2 rounded-lg text-white bg-gray-800 hover:bg-gray-900 transition font-medium"
          >
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

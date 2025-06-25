"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/bridge" });
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/auth/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Invalid email or password");
      }

      window.location.href = '/'; // reloads app so authcontext can update session
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-black rounded-2xl shadow-md">
        <h2 className="text-center text-2xl font-bold">Sign in</h2>

        <div className="space-y-2">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white py-2 rounded"
            data-cy="google-signin-button"
          >
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
            data-cy="signin-email"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            data-cy="signin-password"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
            data-cy="signin-submit"
          >
            Sign in with Email
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Not a member yet?{" "}
          <Link href="/signup" className="text-blue-600 font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

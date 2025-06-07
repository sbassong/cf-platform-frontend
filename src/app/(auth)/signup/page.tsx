'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';


export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirm) {
      return setError("Passwords must match.")
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/login"); // Redirect on success
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to sign up.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-black rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Create an Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-md text-center">{error}</p>}

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3"
            required
          />

          <input
            type="password"
            name="confirm"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-xl p-3 font-semibold hover:bg-blue-700"
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">or</div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => signIn('google')}
            className="w-full border border-gray-300 rounded-xl p-3 hover:bg-gray-50"
          >
            Sign up with Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}


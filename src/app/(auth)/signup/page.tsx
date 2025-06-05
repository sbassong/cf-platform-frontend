'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';


export default function SignUpPage() {
  interface form {
    name: string;
    email: string;
    password: string;
    confirm: string;
  }
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      return setError("Passwords don't match");
    }
    // console.log({form})
    try {
      const res = await fetch('/api/auth/signup', {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    // headers: { "Content-Type": "application/json" },
    body: form,
  });
      console.log("res from submit", res)
      // if (!res.ok) {
      //   const { message } = await res.json();
      //   console.log(message)
      //   throw new Error(message || 'Sign up failed');
      // }

      // router.push('/login'); // or auto-signin
    } catch (err: any) {
      console.error(err)
      setError(err.message);
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
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3"
            required
          />

          <input
            type="password"
            name="confirm"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-xl p-3 font-semibold hover:bg-blue-700"
          >
            Sign Up
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


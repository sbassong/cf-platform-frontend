'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Welcome, {session.user?.email}</h1>
      <button
        onClick={() => signOut()}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Sign out
      </button>
    </div>
  );
}

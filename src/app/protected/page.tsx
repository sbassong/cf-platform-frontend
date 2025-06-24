'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; 
import SignOutButton from '../components/SignOutButton';


export default function ProtectedPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading session...</p>
      </div>
    );
  }

  // check for 'user' here to prevent a brief flash of content before the redirect happens.
  if (user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Welcome to the Protected Page!</h1>
        <p className="mt-2">This content is only visible to logged-in users.</p>
        <p className="mt-4">
          Your Username: <span className="font-mono bg-gray-100 p-1 rounded">{user.name}</span>
        </p>
        <p>
          Your User ID: <span className="font-mono bg-gray-100 p-1 rounded">{user.email}</span>
        </p>

        <div className="mt-6">
          <SignOutButton />
        </div>
      </div>
    );
  }

  // If there's no user after loading, this will be rendered briefly before the redirect.
  // Returning null is clean and prevents any content flashing.
  return null;
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function ProtectedPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    // While loading, or if user is null (before redirect happens),
    // show a loading state. This prevents the page content from
    // flashing for unauthenticated users.
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Loading...</p>
          <p className="text-sm text-gray-500">
            Verifying authentication status.
          </p>
        </div>
      </div>
    );
  }

  // If loading is complete and a user exists, render the page content.
  return (
    <div className="max-w-4xl mx-auto mt-24 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Protected Dashboard
      </h1>
      <p className="text-gray-600 mb-6">
        This page is protected. Only authenticated users can see it.
      </p>

      {/* Display user and profile information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
          Your Information
        </h2>
        <div>
          <h3 className="text-lg font-medium text-gray-800">
            Welcome, {user.profile.displayName}!
          </h3>
          <p className="text-sm text-gray-500">@{user.profile.username}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">User Role:</span> {user.role}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Profile ID:</span> {user.profile._id}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">User ID:</span> {user._id}
          </p>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Raw User Object:</h3>
          <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-x-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
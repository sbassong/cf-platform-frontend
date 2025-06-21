"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // Your global auth context

export default function SignOutButton() {
  const router = useRouter();
  const { setUser } = useAuth();


  const handleSignOut = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include', // required for browser to send cookie with req
      });

    } catch (error) {
      console.error("An error occurred during sign out:", error);
    } finally {
      setUser(null);
      router.push("/signin");
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
    >
      Sign Out
    </button>
  );
}
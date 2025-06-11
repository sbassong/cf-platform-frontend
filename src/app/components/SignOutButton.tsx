"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function SignOutButton() {
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSignOut = async () => {
    try {
      // 1. Call the backend endpoint to clear the httpOnly cookie
      await fetch(`${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/auth/signout`, { method: 'POST' }); // Assuming you have a BFF proxy or the correct full URL
    } catch (error) {
      console.error("Failed to sign out", error);
    } finally {  
      setUser(null); // 2. Clear the user state in your application regardless
      router.push("/signin"); // 3. Redirect to the sign-in page
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
    >
      Sign Out
    </button>
  );
}
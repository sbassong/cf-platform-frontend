"use client";

import { useAuth } from "../context/AuthContext";

export default function SignOutButton() {
  const { signOut } = useAuth();

  return (
    <button
      onClick={signOut}
      className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
      data-cy="signout-button"
    >
      Sign Out
    </button>
  );
}

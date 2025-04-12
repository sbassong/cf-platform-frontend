"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function ProtectedPage() {
  const { data: session } = useSession();

  if (!session) return <button onClick={() => signIn()}>Sign in</button>;
  return (
    <div>
      <h1>Welcome, {session.user?.email}</h1>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
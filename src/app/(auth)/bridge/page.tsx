// This approach is to bypass the issue with the client version of this page
// not getting session from useSession. Since this is now server-side, we can
// use auth which properly reads the authjs- cookie.

import { auth } from "../../../../auth";
import AuthBridgeClient from "./AuthBridgeClient";
import { SessionProvider } from 'next-auth/react';

import { redirect } from 'next/navigation';

export default async function AuthBridgePage() {
  const session = await auth();

  if (!session) {
    redirect('/signin?error=SessionNotFound');
  }

  // Only AuthBridgeClient needs the session provider
  // having it here solves issue with multiple fetch
  // calls to session controller.
  return (
    <SessionProvider>
      <AuthBridgeClient session={session} />
    </SessionProvider>
  );
}
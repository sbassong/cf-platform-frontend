// This approach is to bypass the issue with the client version of this page
// not getting session from useSession. Since this is now server-side, we can
// use auth which properly reads the authjs- cookie.

import { auth } from "../../../../auth";
import AuthBridgeClient from "./AuthBridgeClient";
import { redirect } from 'next/navigation';

export default async function AuthBridgePage() {
  const session = await auth();

  if (!session) {
    redirect('/signin?error=SessionNotFound');
  }

  return <AuthBridgeClient session={session} />;
}
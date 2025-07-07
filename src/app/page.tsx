import { auth } from "../../auth";
import { cookies } from "next/headers";
import Landing from "../components/landing/Landing";
import Feed from "../components/landing/Feed";

export default async function HomePage() {
  const nextAuthSession = await auth();

  const cookieStore = await cookies();
  const backendToken = cookieStore.get("access_token")?.value;

  // The user is considered logged in if EITHER session exists.
  if (!nextAuthSession && !backendToken) {
    return <Landing />;
  }

  return <Feed />;
}
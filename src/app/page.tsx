import { auth } from "../../auth";
import { cookies } from "next/headers";
import { LandingPage } from "./components/LandingPage";
import Feed from "./components/Feed";

export default async function HomePage() {
  const nextAuthSession = await auth();

  const cookieStore = await cookies();
  const backendToken = cookieStore.get("access_token")?.value;

  // The user is considered logged in if EITHER session exists.
  if (!nextAuthSession && !backendToken) {
    return <LandingPage />;
  }

  // If either session exists, show the feed
  return <Feed />;
}
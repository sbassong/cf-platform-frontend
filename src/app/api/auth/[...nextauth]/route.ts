import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // --- THIS IS THE ADDED CONFIGURATION ---
  // Explicitly tell NextAuth.js to use the "jwt" strategy for sessions.
  // This ensures the jwt and session callbacks are always used.
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log("THIS IS JWT RUNNING ++++");
      // console.log({account})
      // console.log({profile})
      if (account && profile) {
        try {
          const user = await axios.post(
            `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/users/oauth`,
            {
              email: profile.email,
              name: profile.name,
              avatarUrl: profile.picture || profile.avatar_url,
              provider: account.provider,
              providerId: profile.sub || profile.id,
            }
          );

          // console.log({ user });
          // call NestJS to create a cookie-based session
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/auth/provider`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: profile.email }),
            }
          );

          const userData = await res.json();
          // console.log({userData})
          console.log("CALLED PROVIDER CONTROLER ++++");
          return userData;
        } catch (err: unknown) {
          if (err && typeof err === "object" && "message" in err) {
            console.error("Error during social sign-in bridge:", err.message);
            return { ...token, error: "SocialSignInError" };
          } else {
            console.error("Error syncing user with backend:", err);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      console.log({token})
      if (token.userId) {
        session.userId = token.userId;
      }
      console.log({ session });
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

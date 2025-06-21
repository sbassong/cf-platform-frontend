import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import axios from "axios";
import { type NextAuthConfig } from "next-auth";

export const config = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SIGN IN CALLBACK RUNNING ++++");
      if (account && profile?.email) {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/users/oauth`,
            {
              email: profile.email,
              name: profile.name,
              avatarUrl: profile.picture,
              provider: account.provider,
              providerId: user.id, // 'sub' from the JWT is typically the user.id
            }
          );
          return true; // Return true to continue the sign-in process
        } catch (err: any) {
          console.error("Error syncing OAuth user with backend:", err.message);
          // To send the error to the client, you can return a redirect URL
          // Or return false to stop the sign-in process
          return false;
        }
      }
      return false; // Deny sign-in if account or profile is missing
    },
    async jwt({ token, profile }) {
      console.log("JWT CALLBACK RUNNING ++++");
      // The user object is only passed on the first sign-in.
      // We are persisting the email to the token.
      if (profile?.email) {
        token.email = profile.email;
      }
      return token;
    },
    async session({ session, token }) {
      console.log({ token });
      // The session callback receives the token.
      // We are ensuring the session.user object has the email from the token.
      if (token.email && session.user) {
        session.user.email = token.email as string;
      }
      console.log({ session });
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

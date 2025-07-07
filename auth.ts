import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import axios from "axios";
import { type NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface User {
    avatarUrl?: string;
  }
  interface Session {
    user?: {
      avatarUrl?: string;
      email?: string;
      name?: string;
    };
  }
}

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
      if (account?.provider === "google") {
        if (!profile?.email) {
          return false;
        }
        try {
          const oauthRes = await axios.post(
            `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/users/oauth`,
            {
              email: profile.email,
              name: profile.name,
              avatarUrl: profile.picture,
              provider: account.provider,
              providerId: user.id, // 'sub' from the JWT is typically the user.id
            }
          );
          return oauthRes
          return true;
        } catch (err: any) {
          console.error("Error syncing OAuth user with backend:", err.message);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, profile }) {
      if (profile?.email) {
        token.email = profile.email;
        token.name = profile.name;
        token.avatarUrl = profile.picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.email && session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.avatarUrl = token.avatarUrl as string | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";
// import jwt from 'jsonwebtoken';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.LOCAL_BACKEND_URL}/auth/signin`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          }
        );
        
        const user = await res.json();
        console.log({user})

        if (res.ok && user) return user;
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        try {
          const userRes = await axios.post(
            `${process.env.LOCAL_BACKEND_URL}/users/oauth`,
            {
              email: profile.email,
              name: profile.name,
              avatarUrl: profile.picture || profile.avatar_url,
              provider: account.provider,
              providerId: profile.sub || profile.id,
            }
          );

          console.log("useres", userRes?.data);
          token.userId = userRes.data._id;
        } catch (err) {
          console.error("Error syncing user with backend:", err.message);
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.userId = token.userId;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
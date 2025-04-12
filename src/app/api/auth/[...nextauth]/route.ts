import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import axios from "axios";
// import jwt from 'jsonwebtoken';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // NEED TO CHANGE METHOD NAME, IT INTEFERES WITH USE OF jwt module
    async jwt({ token, account, profile }) {
      console.log({account})
      console.log({profile})
      if (account && profile) {
        try {
          // NEED TO FIGURE OUR WHY WE GET A 404 HERE
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

          console.log("useres", userRes?.data)
          token.userId = userRes.data._id;
        } catch (err) {
          console.error(
            "Error syncing user with backend:",
            err.message
          );
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
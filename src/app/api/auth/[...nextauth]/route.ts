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
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log("THIS IS JWT RUNNING ++++");
      if (account && profile) {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/users/oauth`,
            {
              email: profile.email,
              name: profile.name,
              avatarUrl: profile.picture || profile.avatar_url,
              provider: account.provider,
              providerId: profile.sub || profile.id,
            }
          );

          token.email = profile.email;
          
        } catch (err: any) {
          console.error("Error syncing OAuth user with backend:", err.message);
          return { ...token, error: "OAuthUserSyncError" };
        }
      }
      return token;
    },
    async session({ session, token }) {
      console.log({ token });
      if (token.email) {
        session.user.email = token.email;
      }
      console.log({ session });
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

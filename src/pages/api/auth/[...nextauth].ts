import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  callbacks: {
    // https://next-auth.js.org/getting-started/typescript#module-augmentation
    // https://reffect.co.jp/react/next-auth#callbacks
    async session({ session, token }) {
      if (token.accessToken && token.expiresAt && token.email) {
        session.user.token = token.accessToken;
        session.user.expiresAt = token.expiresAt;
        session.user.email = token.email;
      }

      return session;
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.expiresAt = account.expires_at;
        token.email = user?.email;
      }

      return token;
    },
    async signIn() {
      return true;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "https://www.googleapis.com/auth/gmail.settings.basic",
            "https://www.googleapis.com/auth/gmail.labels",
            "https://www.googleapis.com/auth/admin.directory.domain.readonly",
            "https://www.googleapis.com/auth/admin.directory.group.member",
            "https://www.googleapis.com/auth/admin.directory.group",
            "https://www.googleapis.com/auth/admin.directory.user",
          ].join(" "),
        },
      },
    }),
  ],
};

export default NextAuth(authOptions);

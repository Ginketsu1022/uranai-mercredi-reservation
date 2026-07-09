import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.send",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      console.log("account =", account);

      if (account) {
        console.log("account.access_token =", account.access_token);
        token.accessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }) {
      console.log("token.accessToken =", token.accessToken);

      session.accessToken = token.accessToken as string | undefined;

      console.log("session.accessToken =", session.accessToken);

      return session;
    },
  },
});
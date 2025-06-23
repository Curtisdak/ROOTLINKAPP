import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import { handleJWT, handleSession } from "@/lib/auth-callbacks";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) return null;

        const isValid = await compare(credentials.password, user.hashedPassword);
        if (!isValid) return null;

        // Ensure email is always a string
        if (!user.email) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization:
        "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          firstname: profile.given_name ?? profile.name?.split(" ")[0],
          lastname: profile.family_name ?? profile.name?.split(" ")[1],
          email: profile.email,
          avatar: profile.picture,
          emailVerified: profile.email_verified ? new Date() : null,
          role: "USER",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    jwt: handleJWT,
    session: handleSession,

    async signIn({ user, account, profile }) {
      // If user signs in with Google
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile?.email || user.email! },
        });

        const linkedAccount = await prisma.account.findFirst({
          where: {
            provider: "google",
            providerAccountId: profile?.sub,
          },
        });

        if (existingUser && !linkedAccount) {
          // Email exists but no account linked to Google
          throw new Error("OAuthAccountNotLinked");
        }
      }

      return true;
    },

    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login", // Handle error=OAuthAccountNotLinked in UI
  },
};

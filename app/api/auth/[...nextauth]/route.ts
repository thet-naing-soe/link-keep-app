import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

import type { JWT } from 'next-auth/jwt';
import type { Session, User as AdapterUser } from 'next-auth';

// --- START DEBUG LOGS ---
console.log('\n--- NextAuth.js Env Vars Check ---');
console.log(
  'NEXTAUTH_URL (Vercel automatic or manual):',
  process.env.NEXTAUTH_URL
    ? process.env.NEXTAUTH_URL
    : 'NOT SET (or inferred by Vercel)'
);
console.log(
  'AUTH_SECRET:',
  process.env.AUTH_SECRET ? 'SET AND VISIBLE' : 'NOT SET/UNDEFINED'
);
console.log(
  'AUTH_GITHUB_ID:',
  process.env.AUTH_GITHUB_ID ? 'SET AND VISIBLE' : 'NOT SET/UNDEFINED'
);
console.log(
  'AUTH_GITHUB_SECRET:',
  process.env.AUTH_GITHUB_SECRET ? 'SET AND VISIBLE' : 'NOT SET/UNDEFINED'
);

// For more detailed inspection (DO NOT COMMIT THIS LONG-TERM, SECRETS WILL BE LOGGED!)
// console.log("DEBUG ENV VARS RAW VALUES:");
// console.log("AUTH_SECRET_RAW:", process.env.AUTH_SECRET);
// console.log("AUTH_GITHUB_ID_RAW:", process.env.AUTH_GITHUB_ID);
// console.log("AUTH_GITHUB_SECRET_RAW:", process.env.AUTH_GITHUB_SECRET);
console.log('--- End NextAuth.js Env Vars Check ---\n');
// --- END DEBUG LOGS ---

const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
  ],

  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token && token.id) {
        session.user.id = token.id as string;
      }
      console.log('NextAuth Callback: session triggered');
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: AdapterUser }) {
      if (user) {
        token.id = user.id;
      }
      console.log('NextAuth Callback: jwt triggered');
      return token;
    },
  },
  pages: {
    signIn: '/signin',
    error: '/api/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET!, // '!' tells TypeScript it will not be undefined
};

const { handlers } = NextAuth(authOptions);

export const { GET, POST } = handlers;

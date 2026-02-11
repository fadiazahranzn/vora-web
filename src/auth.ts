import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true, // STORY-005 Requirement: Link Google to existing accounts
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        })

        // BR-006: Account Lockout Logic (STORY-006)
        if (user?.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error(
            'Too many failed attempts. Please try again in 15 minutes.'
          )
        }

        if (!user || !user.passwordHash) {
          return null
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isPasswordValid) {
          // Increment failed attempts
          const newAttempts = user.failedLoginAttempts + 1
          const updates: any = { failedLoginAttempts: newAttempts }

          if (newAttempts >= 5) {
            // Lock for 15 minutes
            updates.lockedUntil = new Date(Date.now() + 15 * 60 * 1000)
          }

          await prisma.user.update({
            where: { id: user.id },
            data: updates,
          })

          return null
        }

        // Success: Reset failed attempts
        if (user.failedLoginAttempts > 0 || user.lockedUntil) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: 0,
              lockedUntil: null,
            },
          })
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image || user.avatarUrl,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

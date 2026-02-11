import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'
import { authConfig } from './auth.config'

// Use a direct PrismaClient for auth operations to avoid
// type inference issues from the soft-delete $extends wrapper.
const prisma = new PrismaClient()

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
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

        // Account Lockout Logic (STORY-006)
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
          const newAttempts = user.failedLoginAttempts + 1
          const updates: { failedLoginAttempts: number; lockedUntil?: Date } = {
            failedLoginAttempts: newAttempts,
          }

          if (newAttempts >= 5) {
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
})

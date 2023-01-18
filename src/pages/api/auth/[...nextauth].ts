import NextAuth, { type NextAuthOptions } from 'next-auth'
// Prisma adapter for NextAuth, optional and can be removed
import TwitterProvider from 'next-auth/providers/twitter'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

import { prisma } from '@/server/db'
import { env } from '@/env/server.mjs'

export const authOptions: NextAuthOptions = {
	// Include user.id on session
	callbacks: {
		session({ session, user }) {
			if (session.user) {
				session.user.id = user.id
			}
			return session
		}
	},
	// Configure one or more authentication providers
	adapter: PrismaAdapter(prisma),
	providers: [
		/**
		 * ...add more providers here
		 */
		TwitterProvider({
			clientId: env.TWITTER_CLIENT_SECRET,
			clientSecret: env.TWITTER_CLIENT_SECRET,
			version: '2.0' // opt-in to Twitter OAuth 2.0
		})
	]
}

export default NextAuth(authOptions)

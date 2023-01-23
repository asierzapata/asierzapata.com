import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

import { createSubscription } from '@/server/modules/subscriptions/create_subscription'

export const subscriptionRouter = createTRPCRouter({
	createSubscription: publicProcedure
		.input(
			z.object({
				email: z.string().email()
			})
		)
		.mutation(({ input }) => {
			return createSubscription({ email: input.email })
		})
})

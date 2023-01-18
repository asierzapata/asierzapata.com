import { z } from 'zod'
import { getPostsUseCase } from '@/server/modules/posts/get_posts_use_case'
import { searchPostsUseCase } from '@/server/modules/posts/search_posts_use_case'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const postRouter = createTRPCRouter({
	getLatestPosts: publicProcedure
		.input(
			z.object({
				numberOfPosts: z.number().min(1).max(5)
			})
		)
		.query(({ input }) => {
			return getPostsUseCase({ limit: input.numberOfPosts })
		}),
	searchPosts: publicProcedure
		.input(
			z.object({
				numberOfPosts: z.number().min(1).max(5),
				textQuery: z.string().trim()
			})
		)
		.query(({ input }) => {
			return searchPostsUseCase({
				textQuery: input.textQuery,
				limit: input.numberOfPosts
			})
		})
})

import { z } from 'zod'
import { getPostsUseCase } from '@/server/modules/posts/get_posts_use_case'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const postReactions = createTRPCRouter({})

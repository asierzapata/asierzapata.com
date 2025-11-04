import { defineCollection, z } from 'astro:content'

import { glob } from 'astro/loaders'

const posts = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/posts' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		date: z.date(),
		tags: z.array(z.string()).optional(),
		slug: z.string(),
	}),
})

export const collections = { posts }

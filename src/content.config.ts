import { defineCollection, z } from 'astro:content'

import { glob } from 'astro/loaders'

const posts = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/posts' }),
	schema: z.object({
		title: z.string(),
		draft: z.boolean().default(false),
		description: z.string().optional(),
		date: z.date(),
		tags: z.array(z.string()).optional(),
		slug: z.string(),
	}),
})

export const collections = { posts }

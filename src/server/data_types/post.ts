import { z } from "zod";

const PostTypesEnum = z.enum([
	'article',
	'snippet',
	'tutorial',
	'book-review'
])

const commonPost = {
	_id: z.string(),
	title: z.string(),
	slug: z.string(),
	estimatedDuration: z.number(),
	authorName: z.string(),
	mainImage: z.string(),
	publishedAt: z.string(),
	type: PostTypesEnum
}

const PostSchema = z.object({
	...commonPost,
	body: z.string(),
});

const PostSummarySchema = z.object(commonPost);

export function parsePosts(posts: unknown[]): Post[] {
	return posts.map(post => parsePost(post))
}

export function parsePost(post: unknown): Post {
	return PostSchema.parse(post)
}

export function parsePostSummaries(postSummaries: unknown[]): PostSummary[] {
	return postSummaries.map(postSummary => parsePostSummary(postSummary))
}

export function parsePostSummary(postSummary: unknown): PostSummary {
	return PostSummarySchema.parse(postSummary)
}

export type Post = typeof PostSchema._type
export type PostSummary = typeof PostSummarySchema._type
export type PostType = z.infer<typeof PostTypesEnum>

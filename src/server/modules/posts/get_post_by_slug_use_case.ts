import { getClient } from '@/server/services/sanity/client'
import { parsePosts } from '@/server/data_types/post'

export async function getPostBySlugUseCase(slug: string) {
	// We use the preview flag here since we would want to obtain individual posts in draft
	const posts = await getClient({ usePreview: true }).fetch<unknown[]>(
		`*[_type == "post" && slug.current == $slug] {
			_id,
			title,
			description,
			"slug": slug.current,
			"authorName": author->name,
			"type": type->slug.current,
			estimatedDuration,
			"mainImage": mainImage.asset->url,
			publishedAt,
			body
		}`,
		{ slug }
	)

	return parsePosts(posts)
}

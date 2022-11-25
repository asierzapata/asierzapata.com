import { z } from "zod";
import { getClient } from "~/services/sanity/client";

export async function getPostsUseCase(limit?: string, cursor?: string) {
	const posts = await getClient().fetch(
		`*[_type == "post" && _id > $lastId] | order(_id) [0...$limit] {
			_id,
			title,
			"slug": slug.current,
			estimatedTimeToRead,
			"mainImage": mainImage.asset->url,
			publishedAt
		}`,
		{ lastId: cursor || "", limit: limit || 5 }
	);
	const PostsListSchema = z.array(
		z.object({
			_id: z.string(),
			title: z.string(),
			slug: z.string(),
			estimatedTimeToRead: z.number(),
			mainImage: z.string(),
			publishedAt: z.string(),
		})
	);
	return PostsListSchema.parse(posts);
}

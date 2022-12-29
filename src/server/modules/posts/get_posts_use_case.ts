import { getClient } from "@/server/services/sanity/client";
import { parsePostSummaries } from "@/server/data_types/post";

export async function getPostsUseCase(limit?: number, cursor?: number) {
	const posts = await getClient().fetch(
		`*[_type == "post" && _id > $lastId] | order(_id) [0...$limit] {
			_id,
			title,
			"slug": slug.current,
			"authorName": author->name,
			"type": type->slug.current,
			estimatedDuration,
			"mainImage": mainImage.asset->url,
			publishedAt
		}`,
		{ lastId: cursor || "", limit: limit || 5 }
	);
	return parsePostSummaries(posts);
}

import { getClient } from "@/server/services/sanity/client";
import { parsePostSummaries } from "@/server/data_types/post";

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
	return parsePostSummaries(posts);
}

import { getClient } from "@/server/services/sanity/client";
import type { PostType } from "@/server/data_types/post";
import { parsePostSummaries } from "@/server/data_types/post";

export async function getPostsUseCase({
	postType,
	limit,
	cursor,
}: {
	postType?: PostType;
	limit?: number;
	cursor?: number;
} = {}) {
	let query = `*[_type == "post" && _id > $lastId] | order(_id) [0...$limit] {
		_id,
		title,
		"slug": slug.current,
		"authorName": author->name,
		"type": type->slug.current,
		estimatedDuration,
		"mainImage": mainImage.asset->url,
		publishedAt
	}`;
	if (postType) {
		query = `*[_type == "post" && type->slug.current == $postType && _id > $lastId] | order(_id) [0...$limit] {
			_id,
			title,
			"slug": slug.current,
			"authorName": author->name,
			"type": type->slug.current,
			estimatedDuration,
			"mainImage": mainImage.asset->url,
			publishedAt
		}`;
	}
	const posts = await getClient().fetch(query, {
		postType: postType || "",
		lastId: cursor || "",
		limit: limit || 5,
	});
	return parsePostSummaries(posts);
}

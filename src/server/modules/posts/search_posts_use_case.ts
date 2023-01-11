import { getClient } from "@/server/services/sanity/client";
import { parsePostSummaries } from "@/server/data_types/post";
import _ from "lodash";

export async function searchPostsUseCase({
	textQuery,
	limit,
}: {
	textQuery?: string;
	limit?: number;
} = {}) {
	const query = `*[_type == "post"] | score(boost(title match $textQuery, 2), title match "*" + $textQuery + "*") | order(_score desc) [0...$limit] {
		_id,
		title,
		"slug": slug.current,
		"authorName": author->name,
		"type": type->slug.current,
		estimatedDuration,
		"mainImage": mainImage.asset->url,
		publishedAt,
		_score
	} [ _score > 0 ]`;
	const posts = await getClient().fetch(query, {
		textQuery: _.toLower(textQuery) || "",
		limit: limit || 5,
	});
	return parsePostSummaries(posts);
}

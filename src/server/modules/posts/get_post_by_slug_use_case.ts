import { getClient } from "@/server/services/sanity/client";
import { parsePost } from "@/server/data_types/post";

export async function getPostBySlugUseCase(slug: string) {
	const post = await getClient().fetch(
		`*[_type == "post" && slug.current == $slug] {
			_id,
			title,
			"slug": slug.current,
			estimatedTimeToRead,
			"mainImage": mainImage.asset->url,
			publishedAt,
			body
		}`,
		{ slug }
	);

	return parsePost(post[0]);
}

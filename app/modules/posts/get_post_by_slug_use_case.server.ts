import { z } from "zod";
import { get } from "~/lib/get";
import { getClient } from "~/services/sanity/client";

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
	const PostSchema = z.object({
		_id: z.string(),
		title: z.string(),
		slug: z.string(),
		estimatedTimeToRead: z.number(),
		mainImage: z.string(),
		publishedAt: z.string(),
		body: z.string(),
	});

	return PostSchema.parse(post[0]);
}

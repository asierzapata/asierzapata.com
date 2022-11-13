import type { DataFunctionArgs } from "@remix-run/node";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";

import { getPostBySlug } from "~/modules/posts/use_cases/get_post_by_slug.server";

type LoaderData = {
	post: Awaited<ReturnType<typeof getPostBySlug>>;
};

export const loader = async ({ params }: DataFunctionArgs) => {
	invariant(params.slug, "params.slug is required");

	const post = await getPostBySlug(params.slug);

	invariant(post, `Post not found: ${params.slug}`);

	return json<LoaderData>({
		post
	});
};

export default function PostWithSlug() {
	const { post } = useLoaderData<typeof loader>();

	if (!post) {
		return (
			<main>
				<h1>Post not found</h1>
			</main>
		);
	}

	return (
		<main>
			<h1>{post.title}</h1>
			<h2>{post.subtitle}</h2>
			<h3>{post.estimatedTimeToRead}min</h3>
			<article>{post.markdown}</article>
		</main>
	);
}

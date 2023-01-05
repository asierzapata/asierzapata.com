import React from "react";

import invariant from "tiny-invariant";

/* ====================================================== */
/*                        Types                          */
/* ====================================================== */

import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { PostFeed } from "@/components/post_feed";

/* ====================================================== */
/*                     Data Loading                      */
/* ====================================================== */

import { renderPost } from "@/server/services/post_render";
import { getPostBySlugUseCase } from "@/server/modules/posts/get_post_by_slug_use_case";
import { getPostsUseCase } from "@/server/modules/posts/get_posts_use_case";

export async function getStaticProps(
	context: GetStaticPropsContext<{ slug: string }>
) {
	invariant(context.params, "context.params is empty");
	invariant(context.params.slug, "context.params.slug is required");

	const post = await getPostBySlugUseCase(context.params.slug);

	invariant(post, `Post not found: ${context.params.slug}`);

	const content = await renderPost(post.body);

	const posts = await getPostsUseCase();

	return {
		props: {
			posts,
			post,
			content,
		},
		revalidate: 60, // In seconds
	};
}

export async function getStaticPaths() {
	const posts = await getPostsUseCase();

	// Get the paths we want to pre-render based on posts
	const paths = posts.map((post) => ({
		params: { slug: post.slug },
	}));

	return { paths, fallback: "blocking" };
}

/* ====================================================== */
/*                      Component                        */
/* ====================================================== */

export default function PostWithId({
	posts,
	post,
	content,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		// <main className="mx-auto w-full py-6 md:w-10/12 lg:w-9/12 xl:w-7/12 2xl:w-5/12">
		<main>
			<PostFeed
				posts={posts}
				selectedPost={post}
				selectedPostContent={content}
			/>
		</main>
		// </main>
	);
}

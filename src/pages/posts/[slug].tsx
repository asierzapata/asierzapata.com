import React from "react";

import invariant from "tiny-invariant";

/* ====================================================== */
/*                        Types                          */
/* ====================================================== */

import type {
	GetStaticPropsContext,
	InferGetStaticPropsType
} from "next";

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { PostDetail } from "@/components/post_detail";

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

	return {
		props: {
			post,
			content,
		},
	};
}

export async function getStaticPaths() {
	const firstPosts = await getPostsUseCase({ limit: 5 })

	return {
		paths: firstPosts.map(post => ({ params: { slug: post.slug }})),
		fallback: "blocking"
	};
}


/* ====================================================== */
/*                      Component                         */
/* ====================================================== */

export default function PostWithId({
	post,
	content,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<PostDetail post={post} content={content} />
	);
}

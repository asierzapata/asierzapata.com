import React from "react";

import invariant from "tiny-invariant";
import _ from "lodash";

import { useQueryParam } from "@/lib/query_params";
import { useRouter } from "next/router";

/* ====================================================== */
/*                        Types                          */
/* ====================================================== */

import type {
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
} from "next";
import type { PostFeedFilters } from "@/components/post_feed";

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
import { parsePostType } from "@/server/data_types/post";

export async function getServerSideProps(
	context: GetServerSidePropsContext<{ slug: string }>
) {
	invariant(context.params, "context.params is empty");
	invariant(context.params.slug, "context.params.slug is required");

	const post = await getPostBySlugUseCase(context.params.slug);

	invariant(post, `Post not found: ${context.params.slug}`);

	const content = await renderPost(post.body);

	const posts = await getPostsUseCase({
		postType: !_.isEmpty(context.query.filterPostType)
			? parsePostType(context.query.filterPostType)
			: undefined,
	});

	return {
		props: {
			posts,
			post,
			content,
		},
	};
}

const parseFilterPostType = (value: unknown) => {
	if (!value || value === "") return "";
	return parsePostType(value);
};

/* ====================================================== */
/*                      Component                         */
/* ====================================================== */

export default function PostWithId({
	posts,
	post,
	content,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();

	const [filterPostType] = useQueryParam<PostFeedFilters>(
		"filterPostType",
		parseFilterPostType,
		""
	);

	const handlePostFilterSelected = React.useCallback(
		(filterPostType: PostFeedFilters) => {
			router.push({
				pathname: "/posts",
				query: { ..._.omit(router.query, "slug"), filterPostType },
			});
		},
		[router]
	);

	return (
		<PostFeed
			posts={posts}
			selectedPost={post}
			selectedPostContent={content}
			filterPostType={filterPostType}
			onPostFilterSelected={handlePostFilterSelected}
		/>
	);
}

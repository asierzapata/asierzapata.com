/* ====================================================== */
/*                      Components                       */
/* ====================================================== */

import { PostFeed } from "@/components/post_feed";

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type { InferGetStaticPropsType } from "next";

/* ====================================================== */
/*                     Data Loading                      */
/* ====================================================== */

import { getPostsUseCase } from "@/server/modules/posts/get_posts_use_case";

export const getStaticProps = async () => {
	const posts = await getPostsUseCase();

	return {
		props: {
			posts,
		},
	};
};

/* ====================================================== */
/*                   Implementation                      */
/* ====================================================== */

export default function Posts({
	posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<main>
			<PostFeed posts={posts} />
		</main>
	);
}

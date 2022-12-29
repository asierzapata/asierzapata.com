/* ====================================================== */
/*                      Components                       */
/* ====================================================== */

import { PostCard } from "@/components/post_card";

/* ====================================================== */
/*                        Types                          */
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
		<main className="p-6">
			<ul className="grid auto-rows-max grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
				{posts.map((post) => (
					<PostCard key={post.slug} post={post} />
				))}
			</ul>
		</main>
	);
}

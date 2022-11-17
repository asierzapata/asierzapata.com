import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { format } from "date-fns";

/* ====================================================== */
/*                     Data Loading                      */
/* ====================================================== */

import { getPublishedPosts } from "~/modules/posts/use_cases/get_published_posts.server";

type LoaderData = {
	posts: Awaited<ReturnType<typeof getPublishedPosts>>;
};

export const loader = async () => {
	return json<LoaderData>({
		posts: await getPublishedPosts({
			includeTranslatedPosts: true
		})
	});
};

/* ====================================================== */
/*                      Component                        */
/* ====================================================== */

const PostCard = ({
	postId,
	postThumbnail,
	postTitle,
	postEstimatedReadingTime,
	postPublishedDate
}: {
	postId: number;
	postThumbnail: string;
	postTitle: string;
	postEstimatedReadingTime: number;
	postPublishedDate: string;
}) => {
	return (
		<li key={postId}>
			<Link to={`${postId}`}>
				<article
					className="flex flex-col rounded-md px-4 py-4 max-w-sm b
					g-neutral-600 group transition duration-300 hover:bg-dark
					border border-transparent hover:border-orange
				hover:text-orange"
				>
					<img
						className="rounded-md aspect-auto mb-4 "
						src={postThumbnail}
						alt={postTitle}
					/>
					<span className="font-medium text-sm text-neutral-300 mb-4">
						{format(new Date(postPublishedDate), "MMMM do, yyyy")} |{" "}
						{postEstimatedReadingTime}min
					</span>
					<span className="font-medium text-xl text-neutral-300">
						{postTitle}
					</span>
				</article>
			</Link>
		</li>
	);
};

export default function Posts() {
	const { posts } = useLoaderData<typeof loader>();

	return (
		<main className="px-12 py-6">
			<ul>
				{posts.map((post) => (
					<PostCard
						key={post.id}
						postId={post.id}
						postThumbnail={post.thumbnail}
						postTitle={post.title}
						postEstimatedReadingTime={post.estimatedTimeToRead}
						postPublishedDate={post.publishedAt!}
					/>
				))}
			</ul>
		</main>
	);
}

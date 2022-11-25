import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { format } from "date-fns";
import { getPostsUseCase } from "~/modules/posts/get_posts_use_case.server";

/* ====================================================== */
/*                     Data Loading                      */
/* ====================================================== */

type LoaderData = {
	posts: Awaited<ReturnType<typeof getPostsUseCase>>;
};

export const loader = async () => {
	const posts = await getPostsUseCase();

	return json<LoaderData>({
		posts,
	});
};

/* ====================================================== */
/*                      Component                        */
/* ====================================================== */

const PostCard = ({
	slug,
	thumbnail,
	title,
	estimatedReadingTime,
	publishedDate,
}: {
	slug: string;
	thumbnail: string;
	title: string;
	estimatedReadingTime: number;
	publishedDate: string;
}) => {
	return (
		<li key={slug}>
			<Link to={slug}>
				<article
					className="flex flex-col rounded-md px-4 py-4 max-w-sm b
					g-neutral-600 group transition duration-300 hover:bg-dark
					border border-transparent hover:border-orange
				hover:text-orange"
				>
					<img
						className="rounded-md aspect-auto mb-4 "
						src={thumbnail}
						alt={title}
					/>
					<span className="font-medium text-sm text-neutral-300 mb-4">
						{format(new Date(publishedDate), "MMMM do, yyyy")} |{" "}
						{estimatedReadingTime}min
					</span>
					<span className="font-medium text-xl text-neutral-300">{title}</span>
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
						key={post.slug}
						slug={post.slug}
						thumbnail={post.mainImage}
						title={post.title}
						estimatedReadingTime={post.estimatedTimeToRead}
						publishedDate={post.publishedAt!}
					/>
				))}
			</ul>
		</main>
	);
}

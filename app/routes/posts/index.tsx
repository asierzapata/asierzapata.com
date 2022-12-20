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

// TODO: implement correct scaling of images https://hdoro.dev/performant-sanity-io-images and separate it into a component
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
			<Link className="w-full flex justify-center" to={slug} prefetch="intent">
				<article
					className="flex flex-col rounded-md px-4 py-4 h-full w-full max-w-sm
					group transition duration-300 hover:bg-lightBackground
					border border-transparent hover:border-primary
				hover:text-primary"
				>
					<img
						loading="lazy"
						className="rounded-md aspect-auto mb-4 h-full bg-grey"
						src={`${thumbnail}?auto=format&h=350&dpr=3`}
						alt={title}
					/>
					<span className="font-light text-sm text-text mb-4">
						{format(new Date(publishedDate), "MMMM do, yyyy")} |{" "}
						{estimatedReadingTime}min
					</span>
					<span className="font-medium text-xl text-text">{title}</span>
				</article>
			</Link>
		</li>
	);
};

export default function Posts() {
	const { posts } = useLoaderData<typeof loader>();

	return (
		<main className="p-6">
			<ul className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-max">
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

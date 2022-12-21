import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { format } from "date-fns";
import _ from "lodash";
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
				<div
					className="
						rounded w-80 h-80 bg-gradient-to-br
						hover:from-secondary hover:to-primary transition duration-300
						p-0.5 from-primary via-darkPrimary to-secondary
					"
				>
					<div
						className="
							flex flex-col justify-between h-full
							group transition duration-300 bg-background hover:bg-lightBackground
							rounded p-4
						"
					>
						<img
							loading="lazy"
							className="rounded aspect-auto mb-4 h-full bg-grey"
							src={`${thumbnail}?auto=format&h=350&dpr=3`}
							alt={title}
						/>
						<span className="font-light text-sm text-text group-hover:text-primary mb-4">
							{format(new Date(publishedDate), "MMMM do, yyyy")} |{" "}
							{estimatedReadingTime} min
						</span>
						<span className="font-medium text-xl text-text group-hover:text-primary">
							{title}
						</span>
					</div>
				</div>
			</Link>
		</li>
	);
};

export default function Posts() {
	const { posts } = useLoaderData<typeof loader>();

	return (
		<main className="p-6">
			<ul className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-max">
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

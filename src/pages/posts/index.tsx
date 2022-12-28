import { format } from "date-fns";

/* ====================================================== */
/*                      Components                       */
/* ====================================================== */

import Link from "next/link";
import Image from "next/image";

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
			<Link className="flex w-full justify-center" href={`/posts/${slug}`}>
				<div
					className="
						h-80 w-80 rounded bg-gradient-to-br
						from-primary via-darkPrimary to-secondary p-0.5
						transition duration-300 hover:from-secondary hover:to-primary
					"
				>
					<div
						className="
							group flex h-full flex-col
							justify-between rounded bg-background p-4 transition
							duration-300 hover:bg-lightBackground
						"
					>
						<Image
							loading="lazy"
							className="bg-grey mb-4 aspect-auto h-full rounded"
							src={`${thumbnail}?auto=format&h=204&w=276&dpr=3`}
							alt={title}
							height={204}
							width={276}
						/>
						<span className="mb-4 text-sm font-light text-text group-hover:text-primary">
							{format(new Date(publishedDate), "MMMM do, yyyy")} |{" "}
							{estimatedReadingTime} min
						</span>
						<span className="text-xl font-medium text-text group-hover:text-primary">
							{title}
						</span>
					</div>
				</div>
			</Link>
		</li>
	);
};

export default function Posts({
	posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<main className="p-6">
			<ul className="grid auto-rows-max grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
				{posts.map((post) => (
					<PostCard
						key={post.slug}
						slug={post.slug}
						thumbnail={post.mainImage}
						title={post.title}
						estimatedReadingTime={post.estimatedDuration}
						publishedDate={post.publishedAt}
					/>
				))}
			</ul>
		</main>
	);
}

import { Language } from "@prisma/client";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

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

export default function Posts() {
	const { posts } = useLoaderData<typeof loader>();

	// TODO: Change the preference correctly
	const userLanguage = Language.ENGLISH;

	return (
		<main>
			<h1>Posts</h1>
			<ul>
				{posts.map((post) => (
					<li key={post.id}>
						<Link to={`${post.id}`} className="text-blue-600 underline">
							{
								post.TranslatedPost.find(
									(translatedPost) => translatedPost.language === userLanguage
								)?.title
							}
						</Link>
					</li>
				))}
			</ul>
		</main>
	);
}

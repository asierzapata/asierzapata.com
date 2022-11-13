import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { format } from "date-fns";
import invariant from "tiny-invariant";

/* ====================================================== */
/*                        Types                          */
/* ====================================================== */

import type { DataFunctionArgs } from "@remix-run/node";

/* ====================================================== */
/*                     Data Loading                      */
/* ====================================================== */

import { getPostById } from "~/modules/posts/use_cases/get_post_by_id.server";
import { Language } from "@prisma/client";

type LoaderData = {
	post: Awaited<ReturnType<typeof getPostById>>;
};

export const loader = async ({ params }: DataFunctionArgs) => {
	invariant(params.id, "params.id is required");

	const parsedId = parseInt(params.id, 10);

	console.log(">>>>>>", parsedId);
	console.log(">>>>>>", parsedId < 0);

	invariant(isFinite(parsedId), "Id should be a finite number");
	invariant(parsedId > 0, "Id should be a positive number");

	const post = await getPostById({
		id: parsedId,
		includeTranslatedPosts: true
	});

	invariant(post, `Post not found: ${params.id}`);

	return json<LoaderData>({
		post
	});
};

/* ====================================================== */
/*                      Component                        */
/* ====================================================== */

export default function PostWithId() {
	const { post } = useLoaderData<typeof loader>();

	if (!post || post.status !== "PUBLISHED") {
		return (
			<main>
				<h1 className="text-2xl">Ops! You shouldn't be here 😱</h1>
			</main>
		);
	}

	const formatedPublishedDate = post.publishedAt
		? format(new Date(post.publishedAt), "MMMM do, yyyy")
		: "";

	// TODO: Change the preference correctly
	const userLanguage = Language.ENGLISH;

	const translatedPostToShow = post.TranslatedPost.find(
		(translatedPost) => translatedPost.language === userLanguage
	);

	if (!translatedPostToShow) {
		return (
			<main>
				<h1 className="text-2xl">Ops! You shouldn't be here 😱</h1>
			</main>
		);
	}

	return (
		<main>
			<h1 className="text-2xl">{translatedPostToShow.title}</h1>
			<h2 className="text-xl">{translatedPostToShow.subtitle}</h2>
			<h3>
				{formatedPublishedDate} | {translatedPostToShow.estimatedTimeToRead}min
			</h3>
			<article>{translatedPostToShow.content}</article>
		</main>
	);
}

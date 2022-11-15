import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { format } from "date-fns";
import invariant from "tiny-invariant";

import { getMDXComponent } from "mdx-bundler/client";

/* ====================================================== */
/*                        Types                          */
/* ====================================================== */

import type { DataFunctionArgs } from "@remix-run/node";
import { Language, TranslatedPost } from "@prisma/client";

/* ====================================================== */
/*                     Data Loading                      */
/* ====================================================== */

import { getPostById } from "~/modules/posts/use_cases/get_post_by_id.server";
import { renderPost } from "~/services/post_render/index.server";
import React from "react";

type LoaderData = {
	post: Awaited<ReturnType<typeof getPostById>>;
	translatedPostToShow: TranslatedPost;
	content: Awaited<ReturnType<typeof renderPost>>;
};

export const loader = async ({ params }: DataFunctionArgs) => {
	invariant(params.id, "params.id is required");

	const parsedId = parseInt(params.id, 10);

	invariant(isFinite(parsedId), "Id should be a finite number");
	invariant(parsedId > 0, "Id should be a positive number");

	const post = await getPostById({
		id: parsedId,
		includeTranslatedPosts: true
	});

	invariant(post, `Post not found: ${params.id}`);

	// TODO: Change the preference correctly
	const userLanguage = Language.ENGLISH;

	let translatedPostToShow = post.TranslatedPost.find(
		(translatedPost) => translatedPost.language === userLanguage
	);

	if (!translatedPostToShow) {
		translatedPostToShow = post.TranslatedPost.find(
			(translatedPost) => translatedPost.language === Language.ENGLISH
		);
	}

	invariant(translatedPostToShow, `Translated post not found: ${params.id}`);

	const content = await renderPost(translatedPostToShow.content);

	return json<LoaderData>({
		post,
		translatedPostToShow,
		content
	});
};

/* ====================================================== */
/*                      Component                        */
/* ====================================================== */

export default function PostWithId() {
	const { post, translatedPostToShow, content } =
		useLoaderData<typeof loader>();

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

	const Component = React.useMemo(
		() => getMDXComponent(content.code),
		[content.code]
	);

	if (!translatedPostToShow) {
		return (
			<main>
				<h1 className="text-2xl">Ops! You shouldn't be here 😱</h1>
			</main>
		);
	}

	return (
		<main className="py-6 mx-auto w-full md:w-10/12 lg:w-9/12 xl:w-7/12 2xl:w-5/12">
			<h1 className="text-4xl font-bold mb-2 px-12">
				{translatedPostToShow.title}
			</h1>
			<h3 className="font-thin mb-8 px-12">
				{formatedPublishedDate} | {translatedPostToShow.estimatedTimeToRead}min
			</h3>
			<img
				className="rounded-md aspect-auto mb-8"
				src={post.thumbnail}
				alt={translatedPostToShow.title}
			/>

			<article className="px-12">
				<Component
					components={{
						// https://mdxjs.com/docs/using-mdx/#components
						// https://mdxjs.com/table-of-components/
						h1: (props) => <h1 className="text-3xl mb-4" {...props} />,
						h2: (props) => <h2 className="text-2xl mb-4" {...props} />,
						h3: (props) => <h3 className="text-xl mb-4" {...props} />,
						h4: (props) => <h4 className="text-lg mb-4" {...props} />
					}}
				/>
			</article>
		</main>
	);
}

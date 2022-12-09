import React from "react";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { format } from "date-fns";
import invariant from "tiny-invariant";

import { getMDXComponent } from "mdx-bundler/client";

import SyntaxHighlighter from "react-syntax-highlighter";

const codeStyle = {
	hljs: {
		display: "block",
		overflowX: "auto",
		borderRadius: "0.25rem",
		padding: "1em 1.5rem",
		background: "#2e2f3e",
		color: "#fffffe",
	},
	"hljs-keyword": {
		color: "#e53170",
		fontWeight: "bold",
	},
	"hljs-selector-tag": {
		color: "#fffffe",
		fontWeight: "bold",
	},
	"hljs-literal": {
		color: "#fffffe",
		fontWeight: "bold",
	},
	"hljs-section": {
		color: "#fffffe",
		fontWeight: "bold",
	},
	"hljs-link": {
		color: "#fffffe",
	},
	"hljs-subst": {
		color: "#fffffe",
	},
	"hljs-string": {
		color: "#f25f4c",
	},
	"hljs-title": {
		color: "#ff8906",
		fontWeight: "bold",
	},
	"hljs-name": {
		color: "#ff8906",
		fontWeight: "bold",
	},
	"hljs-type": {
		color: "#ff8906",
		fontWeight: "bold",
	},
	"hljs-attribute": {
		color: "#e53170",
	},
	"hljs-symbol": {
		color: "#e53170",
	},
	"hljs-bullet": {
		color: "#e53170",
	},
	"hljs-built_in": {
		color: "#e53170",
	},
	"hljs-addition": {
		color: "#e53170",
	},
	"hljs-variable": {
		color: "#e53170",
	},
	"hljs-template-tag": {
		color: "#e53170",
	},
	"hljs-template-variable": {
		color: "#e53170",
	},
	"hljs-comment": {
		color: "#0f0e17",
	},
	"hljs-quote": {
		color: "#0f0e17",
	},
	"hljs-deletion": {
		color: "#0f0e17",
	},
	"hljs-meta": {
		color: "#0f0e17",
	},
	"hljs-doctag": {
		fontWeight: "bold",
	},
	"hljs-strong": {
		fontWeight: "bold",
	},
	"hljs-emphasis": {
		fontStyle: "italic",
	},
};

/* ====================================================== */
/*                        Types                          */
/* ====================================================== */

import type { DataFunctionArgs } from "@remix-run/node";

/* ====================================================== */
/*                     Data Loading                      */
/* ====================================================== */

import { renderPost } from "~/services/post_render/index.server";
import { getPostBySlugUseCase } from "~/modules/posts/get_post_by_slug_use_case.server";

type LoaderData = {
	post: Awaited<ReturnType<typeof getPostBySlugUseCase>>;
	content: Awaited<ReturnType<typeof renderPost>>;
};

export const loader = async ({ params }: DataFunctionArgs) => {
	invariant(params.slug, "params.slug is required");

	const post = await getPostBySlugUseCase(params.slug);

	invariant(post, `Post not found: ${params.slug}`);

	const content = await renderPost(post.body);

	return json<LoaderData>({
		post,
		content,
	});
};

/* ====================================================== */
/*                      Component                        */
/* ====================================================== */

export default function PostWithId() {
	const { post, content } = useLoaderData<typeof loader>();

	const formatedPublishedDate = post.publishedAt
		? format(new Date(post.publishedAt), "MMMM do, yyyy")
		: "";

	const Component = React.useMemo(
		() => getMDXComponent(content.code),
		[content.code]
	);

	return (
		<main className="py-6 mx-auto w-full md:w-10/12 lg:w-9/12 xl:w-7/12 2xl:w-5/12">
			<h1 className="text-4xl font-bold mb-2 px-12">{post.title}</h1>
			<h3 className="font-thin mb-8 px-12">
				{formatedPublishedDate} | {post.estimatedTimeToRead}min
			</h3>
			<img
				className="rounded-md aspect-auto mb-8"
				src={post.mainImage}
				alt={post.title}
			/>

			<article className="px-12 mb-8 selection:bg-darkPrimary selection:text-background">
				<Component
					components={{
						// https://mdxjs.com/docs/using-mdx/#components
						// https://mdxjs.com/table-of-components/
						h1: (props) => <h1 className="text-3xl my-4" {...props} />,
						h2: (props) => <h2 className="text-2xl my-4" {...props} />,
						h3: (props) => <h3 className="text-xl my-4" {...props} />,
						h4: (props) => <h4 className="text-lg my-4" {...props} />,
						p: (props) => <p className="my-2" {...props} />,
						// rome-ignore lint/a11y/useAnchorContent: on the props it is included
						a: (props) => <a className="text-primary underline" {...props} />,
						strong: (props) => (
							<strong className="text-primary font-bold" {...props} />
						),
						em: (props) => <em className="text-primary" {...props} />,
						ul: (props) => (
							<ul
								className="my-4 marker:text-primary list-disc list-inside"
								{...props}
							/>
						),
						ol: (props) => (
							<ol
								className="my-4 marker:text-primary list-decimal"
								{...props}
							/>
						),
						blockquote: (props) => (
							<blockquote
								className="bg-lightBackground bg-opacity-50 text-light rounded my-4 py-4 px-6 border-l-4 border-l-primary"
								{...props}
							/>
						),
						code: ({ className, ...props }) => {
							const match = /language-(\w+)/.exec(className || "");
							return match ? (
								<div className="my-4">
									<SyntaxHighlighter
										language={match[1]}
										PreTag="div"
										style={codeStyle}
										{...props}
									/>
								</div>
							) : (
								<code
									className={`${className} bg-dark text-primary rounded px-0.5 py-0.5`}
									{...props}
								/>
							);
						},
					}}
				/>
			</article>
		</main>
	);
}

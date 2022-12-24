import React from "react";

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

import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";

/* ====================================================== */
/*                     Data Loading                      */
/* ====================================================== */

import { renderPost } from "@/server/services/post_render";
import { getPostBySlugUseCase } from "@/server/modules/posts/get_post_by_slug_use_case";
import { getPostsUseCase } from "@/server/modules/posts/get_posts_use_case";
import Image from "next/image";

export async function getStaticProps(
	context: GetStaticPropsContext<{ slug: string }>
) {
	invariant(context.params, "context.params is empty");
	invariant(context.params.slug, "context.params.slug is required");

	const post = await getPostBySlugUseCase(context.params.slug);

	invariant(post, `Post not found: ${context.params.slug}`);

	const content = await renderPost(post.body);

	return {
		props: {
			post,
			content,
		},
		revalidate: 60, // In seconds
	};
}

export async function getStaticPaths() {
	const posts = await getPostsUseCase();

	// Get the paths we want to pre-render based on posts
	const paths = posts.map((post) => ({
		params: { slug: post.slug },
	}));

	return { paths, fallback: "blocking" };
}

/* ====================================================== */
/*                      Component                        */
/* ====================================================== */

export default function PostWithId({
	post,
	content,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	const formatedPublishedDate = post.publishedAt
		? format(new Date(post.publishedAt), "MMMM do, yyyy")
		: "";

	const Component = React.useMemo(
		() => getMDXComponent(content.code),
		[content.code]
	);

	return (
		<main className="mx-auto w-full py-6 md:w-10/12 lg:w-9/12 xl:w-7/12 2xl:w-5/12">
			<h1 className="mb-2 px-12 text-4xl font-bold">{post.title}</h1>
			<h3 className="mb-8 px-12 font-thin">
				{formatedPublishedDate} | {post.estimatedTimeToRead} min
			</h3>
			<Image
				className="mb-8 aspect-auto h-auto w-full rounded-md"
				src={post.mainImage}
				alt={post.title}
				width={700}
				height={475}
				sizes="100vw"
			/>

			<article className="mb-8 px-12 selection:bg-darkPrimary selection:text-background">
				<Component
					components={{
						// https://mdxjs.com/docs/using-mdx/#components
						// https://mdxjs.com/table-of-components/
						h1: (props) => <h1 className="my-6 text-3xl" {...props} />,
						h2: (props) => <h2 className="my-6 text-2xl" {...props} />,
						h3: (props) => <h3 className="my-6 text-xl" {...props} />,
						h4: (props) => <h4 className="my-6 text-lg" {...props} />,
						p: (props) => (
							<p className="my-6 text-justify indent-8" {...props} />
						),
						// rome-ignore lint/a11y/useAnchorContent: on the props it is included
						a: (props) => (
							<a
								className="text-primary underline"
								target="_blank"
								rel="noopener noreferrer"
								{...props}
							/>
						),
						strong: (props) => (
							<strong className="font-bold text-primary" {...props} />
						),
						em: (props) => <em className="text-primary" {...props} />,
						ul: (props) => (
							<ul
								className="my-4 list-inside list-disc marker:text-primary"
								{...props}
							/>
						),
						ol: (props) => (
							<ol
								className="my-4 list-decimal marker:text-primary"
								{...props}
							/>
						),
						blockquote: (props) => (
							<blockquote
								className="text-light my-4 rounded border-l-4 border-l-primary bg-lightBackground bg-opacity-50 py-4 px-6"
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
									className={`${className} bg-dark rounded px-0.5 py-0.5 text-primary`}
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

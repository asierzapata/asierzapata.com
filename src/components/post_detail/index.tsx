import React from 'react'

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

import type { Post } from '@/server/data_types/post'
import type { renderPost } from '@/server/services/post_render'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { format } from 'date-fns'
import { getMDXComponent } from 'mdx-bundler/client'

import SyntaxHighlighter from 'react-syntax-highlighter'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import Giscus from '@giscus/react'

/* ====================================================== */
/*                         Styles                         */
/* ====================================================== */

const codeStyle = {
	hljs: {
		display: 'block',
		'overflow-x': 'auto',
		borderRadius: '0.25rem',
		padding: '1em 1.5rem',
		background: '#2e2f3e',
		color: '#fffffe'
	},
	'hljs-keyword': {
		color: '#e53170',
		fontWeight: 'bold'
	},
	'hljs-selector-tag': {
		color: '#fffffe',
		fontWeight: 'bold'
	},
	'hljs-literal': {
		color: '#f25f4c',
		fontWeight: 'bold'
	},
	'hljs-section': {
		color: '#fffffe',
		fontWeight: 'bold'
	},
	'hljs-link': {
		color: '#e53170'
	},
	'hljs-subst': {
		color: '#fffffe'
	},
	'hljs-string': {
		color: '#f25f4c'
	},
	'hljs-title': {
		color: '#ff8906',
		fontWeight: 'bold'
	},
	'hljs-name': {
		color: '#ff8906',
		fontWeight: 'bold'
	},
	'hljs-type': {
		color: '#ff8906',
		fontWeight: 'bold'
	},
	'hljs-params': {
		color: '#ff8906',
		fontWeight: 'bold'
	},
	'hljs-number': {
		color: '#ff8906'
	},
	'hljs-selector-class': {
		color: '#ff8906'
	},
	'hljs-tag': {
		color: '#ff8906'
	},
	'hljs-selector-id': {
		color: '#ff8906'
	},
	'hljs-attribute': {
		color: '#e53170'
	},
	'hljs-symbol': {
		color: '#e53170'
	},
	'hljs-bullet': {
		color: '#e53170'
	},
	'hljs-built_in': {
		color: '#e53170'
	},
	'hljs-addition': {
		color: '#e53170'
	},
	'hljs-variable': {
		color: '#e53170'
	},
	'hljs-template-tag': {
		color: '#e53170'
	},
	'hljs-template-variable': {
		color: '#e53170'
	},
	'hljs-comment': {
		color: '#a7a9be'
	},
	'hljs-quote': {
		color: '#a7a9be'
	},
	'hljs-deletion': {
		color: '#a7a9be'
	},
	'hljs-meta': {
		color: '#a7a9be'
	},
	'hljs-doctag': {
		fontWeight: 'bold'
	},
	'hljs-strong': {
		fontWeight: 'bold'
	},
	'hljs-emphasis': {
		fontStyle: 'italic'
	},
	'hljs-attr': {
		color: '#ff8906',
		fontStyle: 'italic'
	}
}

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const PostDetail = ({
	isPreview,
	post,
	content
}: {
	isPreview: boolean
	post: Post
	content: Awaited<ReturnType<typeof renderPost>>
}) => {
	const formatedPublishedDate = post.publishedAt
		? format(new Date(post.publishedAt), 'MMMM do, yyyy')
		: ''

	const Component = React.useMemo(
		() => getMDXComponent(content.code),
		[content.code]
	)

	return (
		<div className="max-h-screen w-full overflow-y-auto">
			<div className="mx-auto w-11/12 pt-12 md:w-10/12 lg:w-9/12 xl:w-8/12 2xl:w-6/12">
				<Link
					href="/posts"
					className="flex items-center justify-start gap-2 px-5 text-sm font-light hover:text-primary active:text-primary"
				>
					<ArrowLeftIcon /> <span>See other posts</span>
				</Link>
				{isPreview ? (
					<div className="mt-8 flex w-full items-center gap-2 rounded bg-darkPrimary p-4">
						<ExclamationTriangleIcon />
						This is a draft!
					</div>
				) : null}
				<h1 className="mt-8 mb-2 px-12 text-4xl font-bold">{post.title}</h1>
				<h3 className="mb-8 px-12 font-thin">
					{formatedPublishedDate} | {post.estimatedDuration} min
				</h3>
				<Image
					className="mx-auto mb-8 aspect-auto h-auto rounded-md"
					src={post.mainImage}
					alt={post.title}
					width={700}
					height={475}
					sizes="100vw"
				/>
				<article className="mb-12 px-12 selection:bg-darkPrimary selection:text-background">
					<Component
						components={{
							// https://mdxjs.com/docs/using-mdx/#components
							// https://mdxjs.com/table-of-components/
							h1: props => (
								<h1
									className="my-6 text-3xl font-semibold text-darkPrimary"
									{...props}
								/>
							),
							h2: props => (
								<h2
									className="my-6 text-2xl font-semibold text-darkPrimary"
									{...props}
								/>
							),
							h3: props => (
								<h3
									className="my-6 text-xl font-semibold text-darkPrimary"
									{...props}
								/>
							),
							h4: props => (
								<h4
									className="my-6 text-lg font-semibold text-darkPrimary"
									{...props}
								/>
							),
							p: props => <p className="my-6 text-justify" {...props} />,
							a: props => (
								<a
									className="text-primary underline"
									target="_blank"
									rel="noopener noreferrer"
									{...props}
								/>
							),
							strong: props => (
								<strong className="font-bold text-primary" {...props} />
							),
							em: props => <em className="text-primary" {...props} />,
							ul: props => (
								<ul
									className="my-4 list-inside list-disc marker:text-primary"
									{...props}
								/>
							),
							ol: props => (
								<ol
									className="my-4 list-decimal marker:text-primary"
									{...props}
								/>
							),
							blockquote: props => (
								<blockquote
									className="text-light my-2 rounded border-l-4 border-l-primary bg-lightBackground bg-opacity-50 py-0.5 px-6"
									{...props}
								/>
							),
							img: props => (
								<Image
									className="mx-auto mb-8 aspect-auto h-auto rounded-md"
									width={700}
									height={475}
									sizes="100vw"
									alt={post.title}
									{...props}
								/>
							),
							code: ({ className, children, ...props }) => {
								const match = /language-(\w+)/.exec(className || '')
								return match ? (
									<div className="my-4">
										<SyntaxHighlighter
											language={match[1]}
											style={codeStyle}
											showLineNumbers
										>
											{children as string}
										</SyntaxHighlighter>
									</div>
								) : (
									<code
										className={`${
											className || ''
										} rounded bg-lightBackground px-1 py-0.5 text-sm text-primary`}
										{...props}
									>
										{children}
									</code>
								)
							}
						}}
					/>
				</article>
				<div className="mb-12">
					<Giscus
						id="comments"
						repo="asierzapata/asierzapata.com"
						repoId="R_kgDOIbCpww"
						category="Posts"
						categoryId="DIC_kwDOIbCpw84CTqfb"
						mapping="og:title"
						strict="0"
						reactionsEnabled="1"
						emitMetadata="0"
						inputPosition="top"
						theme="dark"
						lang="en"
						loading="lazy"
					/>
				</div>
			</div>
		</div>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { PostDetail }

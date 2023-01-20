import React from 'react'
import _ from 'lodash'

import invariant from 'tiny-invariant'

/* ====================================================== */
/*                        Types                          */
/* ====================================================== */

import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import type { Post } from '@/server/data_types/post'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { PostDetail } from '@/components/post_detail'

/* ====================================================== */
/*                     Data Loading                      */
/* ====================================================== */

import { renderPost } from '@/server/services/post_render'
import { getPostBySlugUseCase } from '@/server/modules/posts/get_post_by_slug_use_case'
import { getPostsUseCase } from '@/server/modules/posts/get_posts_use_case'
import Head from 'next/head'

export async function getStaticProps(
	context: GetStaticPropsContext<{ slug: string; preview: string }>
) {
	invariant(context.params, 'context.params is empty')
	invariant(context.params.slug, 'context.params.slug is required')

	const posts = await getPostBySlugUseCase(context.params.slug)

	if (!posts || _.isEmpty(posts)) return { notFound: true }

	const forcePreview = !!context.preview

	const [post, isPreview] = filterPostsToSingleItem({
		posts,
		forcePreview
	})

	const content = await renderPost(post.body)

	return {
		props: {
			isPreview,
			post,
			content
		}
	}
}

export async function getStaticPaths() {
	const firstPosts = await getPostsUseCase({ limit: 5 })

	return {
		paths: firstPosts.map(post => ({ params: { slug: post.slug } })),
		fallback: 'blocking'
	}
}

/* ====================================================== */
/*                      Component                         */
/* ====================================================== */

export default function PostWithId({
	isPreview,
	post,
	content
}: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<>
			<Head>
				<meta property="og:title" content={post.title} />
				<meta property="og:type" content="article" />
				{post.mainImage ? (
					<meta property="og:image" content={post.mainImage.toString()} />
				) : null}
			</Head>
			<PostDetail isPreview={isPreview} post={post} content={content} />
		</>
	)
}

/* ====================================================== */
/*                        Helpers                         */
/* ====================================================== */

/**
 * Helper function to return the correct version of the document
 * If we're in "preview mode" and have multiple documents, return the draft
 */
function filterPostsToSingleItem({
	posts,
	forcePreview
}: {
	posts: Post | Post[]
	forcePreview: boolean
}): [Post, boolean] {
	if (!Array.isArray(posts)) {
		return [posts, isPostInDraft(posts)]
	}

	if (!posts[0]) throw Error('There are no posts')

	if (posts.length === 1) {
		return [posts[0], isPostInDraft(posts[0])]
	}

	if (forcePreview) {
		const postInDraft = posts.find(item => isPostInDraft(item))
		if (!postInDraft) {
			return [posts[0], false]
		}
		return [postInDraft, true]
	}

	return [posts[0], isPostInDraft(posts[0])]
}

function isPostInDraft(post: Post) {
	return post._id.startsWith(`drafts.`)
}

import React from 'react'

import _ from 'lodash'

import { useQueryParam } from '@/lib/query_params'

/* ====================================================== */
/*                      Components                       */
/* ====================================================== */

import { PostFeed } from '@/components/post_feed'

/* ====================================================== */
/*                        Types                           */
/* ====================================================== */

import type {
	GetServerSidePropsContext,
	InferGetServerSidePropsType
} from 'next'
import type { PostFeedFilters } from '@/components/post_feed'

/* ====================================================== */
/*                     Data Loading                      */
/* ====================================================== */

import { getPostsUseCase } from '@/server/modules/posts/get_posts_use_case'
import { parsePostType } from '@/server/data_types/post'

export async function getServerSideProps(
	context: GetServerSidePropsContext<{ slug: string }>
) {
	const posts = await getPostsUseCase({
		postType: !_.isEmpty(context.query.filterPostType)
			? parsePostType(context.query.filterPostType)
			: undefined
	})

	return {
		props: {
			posts
		}
	}
}

const parseFilterPostType = (value: unknown) => {
	if (!value || value === '') return ''
	return parsePostType(value)
}

/* ====================================================== */
/*                   Implementation                      */
/* ====================================================== */

export default function Posts({
	posts
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [filterPostType, setFilterPostType] = useQueryParam<PostFeedFilters>(
		'filterPostType',
		parseFilterPostType,
		''
	)

	const handlePostFilterSelected = React.useCallback(
		(filterPostType: PostFeedFilters) => {
			setFilterPostType(filterPostType)
		},
		[setFilterPostType]
	)

	return (
		<PostFeed
			posts={posts}
			filterPostType={filterPostType}
			onPostFilterSelected={handlePostFilterSelected}
		/>
	)
}

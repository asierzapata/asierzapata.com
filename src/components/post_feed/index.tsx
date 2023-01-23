import React from 'react'

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

import type { PostSummary, PostType } from '@/server/data_types/post'

import {
	PostTypesDisplayMapping,
	PostTypesArray
} from '@/server/data_types/post'

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { classnames } from '@/lib/classnames'
import { DoubleArrowDownIcon, DoubleArrowUpIcon } from '@radix-ui/react-icons'

import { motion } from 'framer-motion'
import { PostCard } from '@/components/post_card'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

export type PostFeedFilters = PostType | ''

const PostFeed = ({
	posts,
	filterPostType,
	onPostFilterSelected
}: {
	posts: PostSummary[]
	filterPostType?: PostFeedFilters
	onPostFilterSelected: (postFilter: PostFeedFilters) => void
}) => {
	const [areFiltersOpen, setAreFiltersOpen] = React.useState(true)

	const toggleFilters = React.useCallback(
		() => setAreFiltersOpen(!areFiltersOpen),
		[areFiltersOpen, setAreFiltersOpen]
	)

	const postFiltersContainerClassnames = classnames(
		'flex flex-row flex-wrap items-center justify-center gap-6 w-full overflow-hidden'
	)

	const stickyHeaderClassname = classnames(
		'sticky top-0 z-10 flex w-full flex-col p-5 lg:p-4 backdrop-blur-lg'
	)

	return (
		<div className="max-h-screen w-full overflow-y-auto">
			<div className="flex h-full w-full flex-col">
				<div className={stickyHeaderClassname}>
					<div className="flex flex-row items-center justify-around pl-10">
						<span className="flex flex-1 flex-row items-center justify-around">
							Posts
						</span>
						<button
							className="transition-color flex flex-row items-center justify-start gap-4 rounded border-[1px] border-transparent px-3 py-1 font-medium duration-300 ease-in-out hover:border-primary hover:text-primary focus:border-primary focus:text-primary"
							onClick={toggleFilters}
						>
							{areFiltersOpen ? <DoubleArrowUpIcon /> : <DoubleArrowDownIcon />}
						</button>
					</div>
					<motion.div
						initial={{
							height: '0px',
							opacity: 0
						}}
						animate={{
							height: areFiltersOpen ? '100%' : '0px',
							opacity: areFiltersOpen ? 1 : 0,
							marginTop: areFiltersOpen ? '16px' : '0px'
						}}
						className={postFiltersContainerClassnames}
					>
						<button
							className={classnames(
								'rounded border-[1px] border-primary py-1 px-2 text-sm duration-300 ease-in-out',
								filterPostType === '' && 'bg-primary text-background',
								filterPostType !== '' && 'hover:text-primary focus:text-primary'
							)}
							onClick={() => onPostFilterSelected('')}
						>
							All
						</button>
						{PostTypesArray.map(postType => (
							<button
								key={postType}
								className={classnames(
									'rounded border-[1px] border-primary py-1 px-2 text-sm duration-300 ease-in-out',
									filterPostType === postType && 'bg-primary text-background',
									filterPostType !== postType &&
										'hover:text-primary focus:text-primary'
								)}
								onClick={() => onPostFilterSelected(postType)}
							>
								{PostTypesDisplayMapping[postType]}
							</button>
						))}
					</motion.div>
				</div>
				<div className="mx-auto flex h-full w-full flex-col gap-6 p-4 py-8 md:w-10/12 lg:w-8/12 xl:w-7/12 2xl:w-6/12">
					{posts.map(post => (
						<PostCard key={post._id} post={post} />
					))}
					<div className="flex h-28 items-center justify-center bg-background px-4 pb-6 italic">
						The End 🎉
					</div>
				</div>
			</div>
		</div>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { PostFeed }

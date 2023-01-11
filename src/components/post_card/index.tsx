import type { PostSummary, PostType } from '@/server/data_types/post'

import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { classnames } from '@/lib/classnames'

// TODO: implement correct scaling of images https://hdoro.dev/performant-sanity-io-images and separate it into a component

function PostCard({ post }: { post: PostSummary }) {
	return (
		<Link className="flex w-full justify-center" href={`/posts/${post.slug}`}>
			<div
				className="
						w-full rounded
						bg-gradient-to-br from-primary via-darkPrimary to-secondary
						p-0.5 transition duration-300 hover:from-secondary hover:to-primary
					"
			>
				<div
					className="
							group flex h-full flex-row justify-start
							gap-6 rounded bg-background p-4 transition
							duration-300 hover:bg-lightBackground
						"
				>
					<Image
						loading="lazy"
						className="bg-grey aspect-auto rounded"
						src={`${post.mainImage}?auto=format&h=72&w=128&dpr=3`}
						alt={post.title}
						height={72}
						width={128}
					/>
					<div className="flex flex-1 flex-col justify-between">
						<div className="flex flex-row flex-wrap-reverse items-start justify-between gap-2">
							<span className="flex-shrink truncate text-xl font-medium text-text group-hover:text-primary">
								{post.title}
							</span>
							<PostTypeBadge postType={post.type} />
						</div>
						<div className="mt-4 sm:mt-0">
							<span className="text-sm font-thin text-text group-hover:text-primary">
								{format(new Date(post.publishedAt), 'MMMM do, yyyy')} |{' '}
								{post.estimatedDuration} min
							</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	)
}

function PostTypeBadge({ postType }: { postType: PostType }) {
	const badgeClassname = classnames(
		'rounded px-2 py-1 text-xs font-extralight group-hover:bg-primary',
		postType === 'article' && 'bg-primary',
		postType === 'snippet' && 'bg-darkPrimary',
		postType === 'tutorial' && 'bg-secondary',
		postType === 'book-review' && 'bg-darkText text-background'
	)

	return (
		<span className={badgeClassname}>
			{postType === 'article' && 'Article'}
			{postType === 'snippet' && 'Snippet'}
			{postType === 'tutorial' && 'Tutorial'}
			{postType === 'book-review' && 'Book Review'}
		</span>
	)
}

export { PostCard }

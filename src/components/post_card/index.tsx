import type { PostSummary, PostType } from '@/server/data_types/post'

import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { classnames } from '@/lib/classnames'
import { Card } from '@/ui/card/card'
import { PostTypesDisplayMapping } from '@/server/data_types/post'

// TODO: implement correct scaling of images https://hdoro.dev/performant-sanity-io-images and separate it into a component

function PostCard({ post }: { post: PostSummary }) {
	return (
		<Link className="flex w-full justify-center" href={`/posts/${post.slug}`}>
			<Card>
				<div className="flex items-center justify-center">
					<Image
						loading="lazy"
						className="bg-grey aspect-auto rounded"
						src={`${post.mainImage}?auto=format&h=72&w=128&dpr=3`}
						alt={post.title}
						height={72}
						width={128}
					/>
				</div>

				<div className="flex flex-1 flex-col justify-between gap-4">
					<div className="flex flex-row flex-wrap-reverse items-start justify-between gap-2">
						<span className="flex-shrink truncate text-xl font-medium text-text group-hover:text-primary">
							{post.title}
						</span>
						<PostTypeBadge postType={post.type} />
					</div>
					{/*<div className="flex flex-row flex-wrap-reverse items-start justify-between gap-2">*/}
					<span className="flex-shrink text-sm font-thin text-text line-clamp-2 group-hover:text-primary">
						{post.description}
					</span>
					{/*</div>*/}
					<div className="">
						<span className="text-sm font-thin text-text group-hover:text-primary">
							{format(new Date(post.publishedAt), 'MMMM do, yyyy')} |{' '}
							{post.estimatedDuration} min
						</span>
					</div>
				</div>
			</Card>
		</Link>
	)
}

function PostTypeBadge({ postType }: { postType: PostType }) {
	const badgeClassname = classnames(
		'rounded px-2 py-1 text-xs font-extralight group-hover:bg-primary bg-secondary'
	)

	return (
		<span className={badgeClassname}>{PostTypesDisplayMapping[postType]}</span>
	)
}

export { PostCard }

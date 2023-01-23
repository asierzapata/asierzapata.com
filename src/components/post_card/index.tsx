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
				<div className="flex w-full flex-wrap items-center justify-center gap-6 md:flex-nowrap md:gap-4">
					<div className="hidden min-w-[128px] items-center justify-center md:flex">
						<Image
							loading="lazy"
							className="bg-grey aspect-auto rounded"
							src={`${post.mainImage}?auto=format&h=72&w=128&dpr=3`}
							alt={post.title}
							height={72}
							width={128}
						/>
					</div>
					<div className="flex min-w-[128px] items-center justify-center md:hidden">
						<Image
							loading="lazy"
							className="bg-grey aspect-auto rounded"
							src={`${post.mainImage}?auto=format&h=144&w=256&dpr=3`}
							alt={post.title}
							height={144}
							width={256}
						/>
					</div>
					<div className="flex flex-col justify-between gap-4">
						<div className="flex flex-row items-start justify-between gap-2">
							<span className="text-xl font-medium text-text line-clamp-1 group-hover:text-primary">
								{post.title}
							</span>
							<PostTypeBadge postType={post.type} />
						</div>
						<span className="flex-shrink text-sm font-thin text-text line-clamp-1 group-hover:text-primary">
							{post.description}
						</span>
						<div>
							<span className="text-sm font-thin text-text group-hover:text-primary">
								{format(new Date(post.publishedAt), 'MMMM do, yyyy')} |{' '}
								{post.estimatedDuration} min
							</span>
						</div>
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

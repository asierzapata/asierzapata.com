/* ====================================================== */
/*                      Components                       */
/* ====================================================== */

/* ====================================================== */
/*                        Types                          */
/* ====================================================== */

import type { InferGetStaticPropsType } from 'next'

/* ====================================================== */
/*                     Data Loading                      */
/* ====================================================== */

import { getPostsUseCase } from '@/server/modules/posts/get_posts_use_case'
import { PostCard } from '@/components/post_card'

export const getStaticProps = async () => {
	const posts = await getPostsUseCase({ limit: 5, cursor: 0 })

	return {
		props: {
			posts
		}
	}
}

/* ====================================================== */
/*                      Component                        */
/* ====================================================== */

function Subscribed({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<div className="max-h-screen w-full overflow-y-auto">
			<main className="m-auto mt-4 flex w-10/12 flex-col gap-8 py-6 px-4 md:w-9/12 lg:w-8/12 xl:w-7/12">
				<div className="mx-auto mt-12 flex flex-col text-center">
					<h1
						className="
							mb-4
							animate-text
							bg-gradient-to-br from-secondary to-primary
							bg-clip-text
							text-5xl
							font-extrabold
							text-transparent
						"
					>
						Thank you so much!
					</h1>
					<h2
						className="
							mb-4
							text-center
							text-lg
							font-bold
						"
					>
						Now that you are subscribed, you will receive a notification when I
						publish a new post. Here are the last two.
					</h2>
				</div>
				<div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-6">
					{posts.map(post => (
						<PostCard key={post._id} post={post} />
					))}
				</div>
			</main>
		</div>
	)
}

export default Subscribed

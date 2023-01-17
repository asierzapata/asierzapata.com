/* ====================================================== */
/*                      Components                       */
/* ====================================================== */

import Image from 'next/image'
import Link from 'next/link'
import FaceDrawing from '@/../public/face_drawing.svg'
import { PostCard } from '@/components/post_card'
import { GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons'

/* ====================================================== */
/*                        Types                          */
/* ====================================================== */

import type { InferGetStaticPropsType } from 'next'

/* ====================================================== */
/*                     Data Loading                      */
/* ====================================================== */

import { getPostsUseCase } from '@/server/modules/posts/get_posts_use_case'

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

function Home({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<main className="m-auto w-10/12 py-6 md:w-9/12 lg:w-8/12 xl:w-7/12 mt-4">
			<div className="mb-6 flex w-full flex-col-reverse items-center justify-around gap-8 py-6 lg:flex-row">
				<div className="flex flex-col items-center justify-center">
					<h1
						className="
							mb-4 animate-text
							bg-gradient-to-br from-secondary to-primary
							bg-clip-text text-5xl
							font-extrabold
							text-transparent
						"
					>
						Hi! I&apos;m Asier
					</h1>
					<h2 className="mb-8 text-center text-xl">
						I&apos;m a Tech Lead and Fullstack Web Developer working at{' '}
						<a
							className="font-semibold hover:text-primary"
							href="https://edpuzzle.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							Edpuzzle
						</a>
					</h2>
					<h4 className="mb-4 text-center text-lg">Contact with me through</h4>
					<div className="flex flex-row items-center justify-between gap-4">
						<Link
							href="https://twitter.com/intent/tweet?text=%40asierzapata"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-between gap-3 rounded bg-darkPrimary px-4 py-2 font-semibold text-background transition-colors ease-in hover:bg-primary"
						>
							<TwitterLogoIcon /> Twitter
						</Link>
						<Link
							href="https://github.com/asierzapata"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-between gap-3 rounded bg-darkPrimary px-4 py-2 font-semibold text-background transition-colors ease-in hover:bg-primary"
						>
							<GitHubLogoIcon /> GitHub
						</Link>
					</div>
				</div>
				<div className="rounded-lg bg-text shadow-2xl">
					<Image
						src={FaceDrawing}
						alt="Asier Zapata Drawn Portrait"
						width={240}
						height={240}
					/>
				</div>
			</div>
			<div className="w-full py-6">
				<h1 className="mb-8 text-left text-3xl font-bold text-darkPrimary">
					Latest Posts
				</h1>
				<div className="flex flex-row flex-wrap items-start justify-evenly gap-6">
					{posts.map(post => (
						<PostCard key={post._id} post={post} />
					))}
				</div>
			</div>
		</main>
	)
}

export default Home

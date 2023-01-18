import React from 'react'

import * as Fathom from 'fathom-client'

import { useRouter } from 'next/router'

import { useCopyToClipboard } from '@/lib/clipboard/use_copy_to_clipboard'
import { api } from '@/utils/api'

/* ====================================================== */
/*                       Components                      */
/* ====================================================== */

import { Command } from 'cmdk'
import {
	ArrowRightIcon,
	CopyIcon,
	FileTextIcon,
	GitHubLogoIcon,
	MagnifyingGlassIcon,
	TwitterLogoIcon
} from '@radix-ui/react-icons'
import { Toast } from '@/components/toast'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

type GeneralSearchProps = {
	onSearchPosts: () => void
	onCloseCommandPalette: () => void
}

const GeneralSearch = ({
	onSearchPosts,
	onCloseCommandPalette
}: GeneralSearchProps) => {
	const router = useRouter()

	const [showCopiedToast, setShowCopiedToast] = React.useState(false)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, copyUrlToClipboard] = useCopyToClipboard()

	const latestPosts = api.post.getLatestPosts.useQuery({ numberOfPosts: 5 })

	const isHomePage = router.pathname === '/'
	const isPostsPage = router.pathname === '/posts'
	const isPostPage = router.pathname === '/posts/[slug]'
	const isStackPage = router.pathname === '/stack'

	const handleCopyCurrentUrl = React.useCallback(async () => {
		Fathom.trackGoal('UAMOGDZI', 0)
		await copyUrlToClipboard(window.location.toString())
		setShowCopiedToast(true)
	}, [copyUrlToClipboard])

	return (
		<>
			<Command.Input autoFocus placeholder="What do you want to search for?" />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group heading="Posts">
					<Command.Item onSelect={onSearchPosts}>
						<MagnifyingGlassIcon /> Search for Post
					</Command.Item>
					{latestPosts.isLoading && (
						<Command.Loading>Fetching latest Posts…</Command.Loading>
					)}
					{latestPosts.data?.map(post => (
						<Command.Item
							key={post._id}
							onSelect={() => {
								void router.push(`/posts/${post.slug}`)
								onCloseCommandPalette()
							}}
						>
							<FileTextIcon /> {post.title}
						</Command.Item>
					))}
				</Command.Group>

				<Command.Group heading="Navigation">
					<Command.Item
						onSelect={() => {
							router.back()
							onCloseCommandPalette()
						}}
					>
						<ArrowRightIcon /> Go Back
					</Command.Item>
					{!isHomePage && (
						<Command.Item
							onSelect={() => {
								void router.push('/')
								onCloseCommandPalette()
							}}
						>
							<ArrowRightIcon /> Go to Home
						</Command.Item>
					)}
					{!isPostsPage && (
						<Command.Item
							onSelect={() => {
								void router.push('/posts')
								onCloseCommandPalette()
							}}
						>
							<ArrowRightIcon /> Go to Posts
						</Command.Item>
					)}
					{!isStackPage && (
						<Command.Item
							onSelect={() => {
								void router.push('/stack')
								onCloseCommandPalette()
							}}
						>
							<ArrowRightIcon /> Go to Stack
						</Command.Item>
					)}
				</Command.Group>

				<Command.Group heading="Actions">
					<Command.Item onSelect={void handleCopyCurrentUrl}>
						<CopyIcon /> Copy Current URL
					</Command.Item>
					{isPostPage && (
						<Command.Item
							onSelect={() => {
								Fathom.trackGoal('JPEAN03Y', 0)
								// TODO: this should be a link or something like that to avoid browser behaviours like blocking the opening of the URL
								window.open(
									`https://twitter.com/intent/tweet?text=${encodeURIComponent(
										`@asierzapata ${window.location.toString()}`
									)}`,
									'_blank'
								)
							}}
						>
							<TwitterLogoIcon /> Share post on Twitter
						</Command.Item>
					)}
				</Command.Group>

				<Command.Group heading="Contact">
					<Command.Item
						onSelect={() => {
							Fathom.trackGoal('FMQFDG7M', 0)
							window.open(
								'https://twitter.com/intent/tweet?text=%40asierzapata',
								'_blank'
							)
						}}
					>
						<TwitterLogoIcon /> Twitter
					</Command.Item>
					<Command.Item
						onSelect={() => {
							Fathom.trackGoal('ADQ3I876', 0)
							window.open('https://github.com/asierzapata', '_blank')
						}}
					>
						<GitHubLogoIcon /> GitHub
					</Command.Item>
				</Command.Group>
			</Command.List>
			{showCopiedToast && (
				<Toast
					portal
					duration={5000}
					onOpenChange={() => setShowCopiedToast(false)}
				>
					<Toast.Content>
						<Toast.Description>
							<span className="text-sm text-text">
								The URL is on you clipboard
							</span>
						</Toast.Description>
					</Toast.Content>
				</Toast>
			)}
		</>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { GeneralSearch }

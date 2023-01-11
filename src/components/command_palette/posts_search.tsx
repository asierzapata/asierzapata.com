import React from 'react'
import _ from 'lodash'

/* ====================================================== */
/*                       Components                      */
/* ====================================================== */

import { Command } from 'cmdk'
import { useRouter } from 'next/router'
import { api } from '@/utils/trpc'
import { FileTextIcon } from '@radix-ui/react-icons'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

type PostSearchProps = {
	onCloseCommandPalette: () => void
}

const PostsSearch = ({ onCloseCommandPalette }: PostSearchProps) => {
	const router = useRouter()

	const [textQuery, setTextQuery] = React.useState('')

	const handleInputChanged = React.useCallback((search: string) => {
		setTextQuery(search)
	}, [])

	const searchResults = api.post.searchPosts.useQuery({
		numberOfPosts: 5,
		textQuery
	})

	console.log(searchResults.data)
	console.log(searchResults.isLoading)
	console.log(searchResults.error)

	return (
		<>
			<Command.Input
				autoFocus
				placeholder="Whats the title of the post?"
				value={textQuery}
				onValueChange={handleInputChanged}
			/>
			<Command.List>
				{searchResults.isLoading && (
					<Command.Loading>Fetching search results…</Command.Loading>
				)}
				{!searchResults.isLoading && _.isEmpty(searchResults.data) && (
					<Command.Empty>No results found.</Command.Empty>
				)}
				{searchResults.data?.map(post => (
					<Command.Item
						key={post._id}
						onSelect={() => {
							router.push(`/posts/${post.slug}`)
							onCloseCommandPalette()
						}}
					>
						<FileTextIcon /> {post.title}
					</Command.Item>
				))}
			</Command.List>
		</>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { PostsSearch }

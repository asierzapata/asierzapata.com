import React from "react";

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

import type { Post, PostSummary, PostType } from "@/server/data_types/post";
import type { renderPost } from "@/server/services/post_render";

import {
	PostTypesDisplayMapping,
	PostTypesArray,
} from "@/server/data_types/post";

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { PostDetail } from "../post_detail";
import Link from "next/link";

import { classnames } from "@/lib/classnames";
import { format } from "date-fns";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";

import { motion } from "framer-motion";

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const PostFeed = ({
	posts,
	selectedPost,
	selectedPostContent,
	onPostFilterSelected,
}: {
	posts: PostSummary[];
	selectedPost?: Post;
	selectedPostContent?: Awaited<ReturnType<typeof renderPost>>;
	onPostFilterSelected: (postType: PostType) => void;
}) => {
	const [areFiltersOpen, setAreFiltersOpen] = React.useState(false);
	const toggleFilters = React.useCallback(
		() => setAreFiltersOpen((_areFiltersOpen) => !_areFiltersOpen),
		[]
	);
	const postFiltersContainerClassnames = classnames(
		"flex flex-row flex-wrap items-center justify-around gap-2 w-full overflow-y-auto",
		areFiltersOpen && "pt-4 h-full opacity-1",
		!areFiltersOpen && "h-0 opacity-0"
	);
	const stickyHeaderClassname = classnames(
		"sticky top-0 z-10 flex w-full flex-col border-b-2 p-4 backdrop-blur-xl backdrop-saturate-200",
		areFiltersOpen && "gap-4",
		!areFiltersOpen && "gap-0"
	);
	return (
		<div className="flex h-full w-full flex-row">
			<div className="h-screen w-[325px] overflow-y-auto border-r-2 border-r-lightBackground xl:w-[350px]">
				<div className={stickyHeaderClassname}>
					<div className="flex flex-row items-center justify-around">
						<span className="flex flex-1 flex-row items-center justify-around">
							Posts
						</span>
						<button
							className="transition-color  flex flex-row items-center justify-start gap-4 rounded px-3 py-1 font-medium duration-300 ease-in-out hover:bg-lightBackground hover:text-primary"
							onClick={toggleFilters}
						>
							<MixerHorizontalIcon />
						</button>
					</div>
					<motion.div layout className={postFiltersContainerClassnames}>
						{PostTypesArray.map((postType) => (
							<button
								key={postType}
								className="rounded border-2 border-primary bg-lightBackground py-1 px-2 text-sm duration-300 ease-in-out hover:bg-background hover:text-primary"
								onClick={() => onPostFilterSelected(postType)}
							>
								{PostTypesDisplayMapping[postType]}
							</button>
						))}
					</motion.div>
				</div>
				<ul className="flex h-full w-full flex-col gap-6 p-4">
					{posts.map((post) => (
						<Link
							href={`/posts/${post.slug}`}
							key={post._id}
							className="
								group flex h-28 flex-row justify-start
								gap-6 rounded bg-background p-4 transition
								duration-300 hover:bg-lightBackground
							"
						>
							<div className="flex w-full flex-col justify-between gap-2">
								<div className="flex flex-row items-start justify-between gap-2">
									<div className="font-medium text-text line-clamp-2 group-hover:text-primary">
										{post.title}
									</div>
									<PostTypeBadge postType={post.type} />
								</div>
								<span className="text-sm font-thin text-text group-hover:text-primary">
									{format(new Date(post.publishedAt), "MMMM do, yyyy")} |{" "}
									{post.estimatedDuration} min
								</span>
							</div>
						</Link>
					))}
					<div className="flex h-28 items-center justify-center bg-background p-4 pb-6 italic">
						The End 🎉
					</div>
				</ul>
			</div>
			<div className="flex h-screen flex-1 items-center justify-center overflow-y-auto">
				{!selectedPost && (
					<span className="text-lg font-semibold">Select a post</span>
				)}
				{selectedPost && !selectedPostContent && (
					<span className="text-lg font-semibold">
						Ups! Something went really wrong
					</span>
				)}
				{selectedPost && selectedPostContent && (
					<PostDetail post={selectedPost} content={selectedPostContent} />
				)}
			</div>
		</div>
	);
};

// TODO: separate
function PostTypeBadge({ postType }: { postType: PostType }) {
	const badgeClassname = classnames(
		"rounded px-1 py-0.5 text-xs font-extralight group-hover:bg-primary",
		postType === "article" && "bg-primary",
		postType === "snippet" && "bg-darkPrimary",
		postType === "tutorial" && "bg-secondary",
		postType === "book-review" && "bg-darkText text-background"
	);

	return (
		<span className={badgeClassname}>
			{postType === "article" && "Article"}
			{postType === "snippet" && "Snippet"}
			{postType === "tutorial" && "Tutorial"}
			{postType === "book-review" && "Book Review"}
		</span>
	);
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { PostFeed };

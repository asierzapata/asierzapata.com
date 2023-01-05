import React from "react";

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

import type { Post, PostSummary, PostType } from "@/server/data_types/post";
import type { renderPost } from "@/server/services/post_render";

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { PostDetail } from "../post_detail";
import Link from "next/link";

import { classnames } from "@/lib/classnames";
import { format } from "date-fns";

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

const PostFeed = ({
	posts,
	selectedPost,
	selectedPostContent,
}: {
	posts: PostSummary[];
	selectedPost?: Post;
	selectedPostContent?: Awaited<ReturnType<typeof renderPost>>;
}) => {
	return (
		<div className="flex h-full w-full flex-row">
			<div className="h-full max-h-full w-96 overflow-y-auto border-r-2 border-r-lightBackground p-4">
				<ul className="flex w-full flex-col gap-6">
					{posts.map((post) => (
						<Link
							href={`/posts/${post.slug}`}
							key={post._id}
							className="
								group flex h-full flex-row justify-start
								gap-6 rounded bg-background p-4 transition
								duration-300 hover:bg-lightBackground
							"
						>
							<div className="flex flex-1 flex-col justify-between gap-2">
								<div className="flex flex-row flex-wrap-reverse items-center justify-between gap-2">
									<span className="flex-shrink truncate text-lg font-medium text-text group-hover:text-primary">
										{post.title}
									</span>
									<PostTypeBadge postType={post.type} />
								</div>
								<span className="text-sm font-thin text-text group-hover:text-primary">
									{format(new Date(post.publishedAt), "MMMM do, yyyy")} |{" "}
									{post.estimatedDuration} min
								</span>
							</div>
						</Link>
					))}
				</ul>
			</div>
			<div className="flex h-full max-h-screen w-full items-center justify-center overflow-y-auto">
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

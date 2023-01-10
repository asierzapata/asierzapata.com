import React from "react";

import { useRouter } from "next/router";

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

import type { PostSummary, PostType } from "@/server/data_types/post";

import {
	PostTypesDisplayMapping,
	PostTypesArray,
} from "@/server/data_types/post";

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import Link from "next/link";

import { classnames } from "@/lib/classnames";
import { format } from "date-fns";
import { DoubleArrowDownIcon, DoubleArrowUpIcon } from "@radix-ui/react-icons";

import { motion } from "framer-motion";

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

export type PostFeedFilters = PostType | "";

const PostFeed = ({
	posts,
	filterPostType,
	onPostFilterSelected,
}: {
	posts: PostSummary[];
	filterPostType?: PostFeedFilters;
	onPostFilterSelected: (postFilter: PostFeedFilters) => void;
}) => {
	const [areFiltersOpen, setAreFiltersOpen] = React.useState(true);

	const toggleFilters = React.useCallback(
		() => setAreFiltersOpen(!areFiltersOpen),
		[areFiltersOpen, setAreFiltersOpen]
	);

	const postFiltersContainerClassnames = classnames(
		"flex flex-row flex-wrap items-center justify-center gap-6 w-full overflow-hidden"
	);

	const stickyHeaderClassname = classnames(
		"sticky top-0 z-10 flex w-full flex-col p-4 backdrop-blur-lg"
	);

	return (
		<div className="max-h-screen w-full overflow-y-auto">
			<div className="flex h-full w-full flex-col">
					<div className={stickyHeaderClassname}>
						<div className="flex flex-row items-center justify-around">
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
								height: "0px",
								opacity: 0,
							}}
							animate={{
								height: areFiltersOpen ? "100%" : "0px",
								opacity: areFiltersOpen ? 1 : 0,
								marginTop: areFiltersOpen ? "16px" : "0px",
							}}
							className={postFiltersContainerClassnames}
						>
							<button
								className={classnames(
									"rounded border-2 border-primary py-1 px-2 text-sm duration-300 ease-in-out",
									filterPostType === "" && "bg-primary text-background",
									filterPostType !== "" &&
										"border-2 hover:text-primary focus:text-primary"
								)}
								onClick={() => onPostFilterSelected("")}
							>
								All
							</button>
							{PostTypesArray.map((postType) => (
								<button
									key={postType}
									className={classnames(
										"rounded border-2 border-primary py-1 px-2 text-sm duration-300 ease-in-out",
										filterPostType === postType && "bg-primary text-background",
										filterPostType !== postType &&
											"border-2 hover:text-primary focus:text-primary"
									)}
									onClick={() => onPostFilterSelected(postType)}
								>
									{PostTypesDisplayMapping[postType]}
								</button>
							))}
						</motion.div>
					</div>
					<div className="flex h-full w-full flex-col gap-6 p-4 md:w-10/12 lg:w-8/12 xl:w-7/12 2xl:w-6/12 mx-auto">
						{posts.map((post, index, array) => (
							<>
								<PostFeedListItem
									key={post._id}
									post={post}
								/>
								{index !== array.length - 1 && <div className="w-full h-0.5 rounded bg-primary" />}
							</>
						))}
						<div className="flex h-28 items-center justify-center bg-background px-4 pb-6 italic">
							The End 🎉
						</div>
					</div>
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

const PostFeedListItem = ({
	post,
}: {
	post: PostSummary;
}) => {
	const router = useRouter();
	const linkClassnames = classnames(
		"group flex h-34 flex-row justify-start gap-6 rounded p-4 transition duration-300 hover:bg-lightBackground active:bg-lightBackground",
	);
	return (
		<Link
			href={{
				pathname: `/posts/[slug]`,
				query: { ...router.query, slug: post.slug },
			}}
			key={post._id}
			className={linkClassnames}
		>
			<div className="flex w-full flex-col justify-between gap-4">
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
	);
};

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { PostFeed };

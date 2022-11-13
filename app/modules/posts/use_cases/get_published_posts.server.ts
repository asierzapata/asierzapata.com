import * as postsRepository from "../infrastructure/posts_repository.server";

async function getPublishedPosts({
	includeTranslatedPosts,
	cursor,
	order,
	limit
}: {
	includeTranslatedPosts: boolean;
	cursor?: number;
	order?: "asc" | "desc";
	limit?: number;
}) {
	return postsRepository.getPublishedPosts({
		includeTranslatedPosts,
		cursor,
		order,
		limit
	});
}

export { getPublishedPosts };

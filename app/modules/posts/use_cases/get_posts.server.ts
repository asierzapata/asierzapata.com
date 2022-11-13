import * as postsRepository from "../infrastructure/posts_repository.server";

async function getPosts(
	cursor?: number,
	order?: "asc" | "desc",
	limit?: number
) {
	return postsRepository.getPosts(cursor, order, limit);
}

export { getPosts };

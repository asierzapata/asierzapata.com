import * as postsRepository from "../infrastructure/posts_repository.server";

async function getPostBySlug(slug: string) {
	return postsRepository.getPostBySlug(slug);
}

export { getPostBySlug };

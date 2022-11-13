import * as postsRepository from "../infrastructure/posts_repository.server";

async function getPostById(id: number) {
	return postsRepository.getPostById(id);
}

export { getPostById };

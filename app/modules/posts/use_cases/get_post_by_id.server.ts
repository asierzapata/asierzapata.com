import * as postsRepository from "../infrastructure/posts_repository.server";

async function getPostById({
	id,
	includeTranslatedPosts
}: { id: number; includeTranslatedPosts: boolean }) {
	return postsRepository.getPostById({ id, includeTranslatedPosts });
}

export { getPostById };

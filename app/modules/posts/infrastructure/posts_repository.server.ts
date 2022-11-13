import { PostStatus } from "@prisma/client";
import { prisma } from "~/db.server";

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
	const limitStatement = limit || 5;
	const orderStatement = {
		createdAt: order || "asc"
	};
	const whereStatement = {
		status: PostStatus.PUBLISHED
	};
	const includeStatement = {
		TranslatedPost: includeTranslatedPosts
	};

	if (cursor) {
		return prisma.post.findMany({
			take: limitStatement,
			cursor: {
				id: cursor
			},
			orderBy: orderStatement,
			where: whereStatement,
			include: includeStatement
		});
	}

	return prisma.post.findMany({
		take: limitStatement,
		orderBy: orderStatement,
		where: whereStatement,
		include: includeStatement
	});
}

async function getPostById({
	id,
	includeTranslatedPosts
}: { id: number; includeTranslatedPosts: boolean }) {
	return prisma.post.findFirst({
		where: {
			id
		},
		include: {
			TranslatedPost: includeTranslatedPosts
		}
	});
}

export { getPublishedPosts, getPostById };

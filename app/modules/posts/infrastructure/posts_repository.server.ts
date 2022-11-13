import { prisma } from "~/db.server";

async function getPosts(
	cursor?: number,
	order?: "asc" | "desc",
	limit?: number
) {
	const _limit = limit || 5;
	const _order = order || "asc";

	if (cursor) {
		return prisma.post.findMany({
			take: _limit,
			cursor: {
				id: cursor
			},
			orderBy: {
				createdAt: _order
			}
		});
	}

	return prisma.post.findMany({
		take: _limit,
		orderBy: {
			createdAt: _order
		}
	});
}

async function getPostBySlug(slug: string) {
	return prisma.post.findFirst({
		where: {
			slug
		}
	});
}

async function getPostById(id: number) {
	return prisma.post.findFirst({
		where: {
			id
		}
	});
}

export { getPosts, getPostBySlug, getPostById };

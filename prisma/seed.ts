import { Language, PostStatus, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
	const newPost = {
		language: Language.ENGLISH,
		title: "My First Post",
		abstract: "This is my very First Post",
		estimatedTimeToRead: 2,
		content: `
				# This is my first post\n
				\n
				Isn't it great?
			`.trim(),
		status: PostStatus.PUBLISHED,
		publishedAt: new Date()
	};

	await prisma.post.create({
		data: newPost
	});
}

seed();

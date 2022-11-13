import { Language, PostStatus, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
	const newPost = {
			status: PostStatus.PUBLISHED,
			publishedAt: new Date(),
		}


	const newTranslatedPosts = [
		{
			language: Language.ENGLISH,
			title: "My First Post",
			subtitle: "This is my very First Post",
			estimatedTimeToRead: 2,
			content: `
				# This is my first post\n
				\n
				Isn't it great?
			`.trim()
		},
		{
			language: Language.SPANISH,
			title: "Mi Primer Artículo",
			subtitle: "Este es mi primer artículo",
			estimatedTimeToRead: 2,
			content: `
				# Este es mi primer artículo\n
				\n
				Increíble, verdad?
			`.trim()
		}
	];

	const post = await prisma.post.create({
		data: newPost
	});

	for(const translatedPost of newTranslatedPosts) {
		await prisma.translatedPost.create({
			data: { postId: post.id, ...translatedPost }
		});
	}

}

seed();

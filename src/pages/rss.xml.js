import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context) {
	const posts = await getCollection('posts', ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true && data.date <= new Date() : true
	})

	return rss({
		title: 'Async by Asier Zapata',
		description: 'Thoughts and musings on web development and technology.',
		site: context.site,
		items: posts.map(post => ({
			title: post.data.title,
			pubDate: post.data.date,
			description: post.data.description,
			link: `/posts/${post.id}/`,
		})),
		customData: `<language>en-us</language>`,
	})
}

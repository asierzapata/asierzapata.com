export default {
	name: 'post',
	title: 'Post',
	type: 'document',
	fields: [
		{
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: Rule => Rule.required().min(5).max(96)
		},
		{
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: {
				source: 'title',
				maxLength: 96
			},
			validation: Rule => Rule.required()
		},
		{
			name: 'author',
			title: 'Author',
			type: 'reference',
			to: { type: 'author' },
			validation: Rule => Rule.required()
		},
		{
			name: 'mainImage',
			title: 'Main image',
			type: 'image'
		},
		{
			name: 'type',
			title: 'Type',
			type: 'reference',
			to: { type: 'postType' },
			validation: Rule => Rule.required()
		},
		{
			name: 'publishedOnce',
			type: 'boolean',
			hidden: true
		},
		{
			name: 'publishedAt',
			title: 'Published at',
			type: 'datetime',
			validation: Rule => Rule.required()
		},
		{
			name: 'estimatedDuration',
			title: 'Estimated duration of the post',
			type: 'number'
		},
		{
			name: 'body',
			title: 'Body',
			type: 'markdown'
		}
	],

	preview: {
		select: {
			title: 'title',
			category: 'category.name',
			media: 'mainImage'
		}
	}
}

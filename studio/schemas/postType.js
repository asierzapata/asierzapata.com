export default {
	name: 'postType',
	title: 'Post Type',
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
			name: 'description',
			title: 'Description',
			type: 'text',
			validation: Rule => Rule.required().min(10).max(96)
		}
	]
}

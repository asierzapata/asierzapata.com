export default {
	name: 'postType',
	title: 'Post Type',
	type: 'document',
	fields: [
		{
			name: 'name',
			title: 'Name',
			type: 'string',
			validation: Rule => Rule.required().min(5).max(96)
		},
		{
			name: 'link',
			title: 'Link',
			type: 'url',
			validation: Rule => Rule.required()
		},
		{
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: {
				source: 'name',
				maxLength: 96
			},
			validation: Rule => Rule.required()
		}
	]
}

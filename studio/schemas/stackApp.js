export default {
	name: 'stackApp',
	title: 'Stack App',
	type: 'document',
	fields: [
		{
			name: 'name',
			title: 'Name',
			type: 'string',
			validation: Rule => Rule.required().min(5).max(96)
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
		},
		{
			name: 'image',
			title: 'Image',
			type: 'image',
			validation: Rule => Rule.required()
		},
		{
			name: 'link',
			title: 'Link',
			type: 'url',
			validation: Rule => Rule.required()
		},
		{
			name: 'description',
			title: 'Description',
			type: 'text',
			validation: Rule => Rule.required()
		}
	]
}

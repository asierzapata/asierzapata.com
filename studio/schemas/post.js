export default {
	name: "post",
	title: "Post",
	type: "document",
	fields: [
		{
			name: "title",
			title: "Title",
			type: "string",
		},
		{
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "title",
				maxLength: 96,
			},
		},
		{
			name: "author",
			title: "Author",
			type: "reference",
			to: { type: "author" },
		},
		{
			name: "mainImage",
			title: "Main image",
			type: "image",
		},
		{
			name: "categories",
			title: "Categories",
			type: "array",
			of: [{ type: "reference", to: { type: "category" } }],
		},
		{
			name: "publishedAt",
			title: "Published at",
			type: "datetime",
		},
		{
			name: "estimatedTimeToRead",
			title: "Estimated time to read in minutes",
			type: "number",
		},
		{
			name: "body",
			title: "Body",
			type: "markdown",
		},
	],

	preview: {
		select: {
			title: "title",
			author: "author.name",
			media: "mainImage",
		},
		prepare(selection) {
			const { author } = selection;
			return Object.assign({}, selection, {
				subtitle: author && `by ${author}`,
			});
		},
	},
};

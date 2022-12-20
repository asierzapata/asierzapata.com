export default {
	name: "project",
	title: "Project",
	type: "document",
	fields: [
		{
			name: "title",
			title: "Title",
			type: "string",
		},
		{
			name: "description",
			title: "Description",
			type: "string",
		},
		{
			name: "image",
			title: "Image",
			type: "image",
			options: {
				hotspot: true,
			},
		},
		{
			name: "links",
			title: "Links",
			type: "array",
			of: [
				{
					type: "object",
					name: "inline",
					fields: [
						{
							type: "string",
							name: "source",
							options: {
								list: [
									{ title: "GitHub", value: "github" },
									{ title: "Web", value: "web" },
								],
								layout: "radio", // <-- defaults to 'dropdown'
							},
						},
						{ type: "url", name: "url" },
					],
				},
			],
		},
		{
			name: "createdAt",
			title: "Created at",
			type: "datetime",
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

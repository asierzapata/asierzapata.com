import { bundleMDX } from "mdx-bundler";

async function renderPost(postContent: string) {
	const { code, frontmatter } = await bundleMDX({
		source: postContent.trim()
	});

	return { code, frontmatter };
}

export { renderPost };

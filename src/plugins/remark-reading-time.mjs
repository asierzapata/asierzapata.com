export function remarkReadingTime() {
	return function (tree, { data }) {
		const textOnPage = getReadingTimeText(tree)
		const words = textOnPage.split(/\s+/).length
		const readingTime = Math.ceil(words / 200)

		data.astro.frontmatter.minutesRead = readingTime
	}
}

function getReadingTimeText(node) {
	if (!node) return ''
	if (node.type === 'code') return ''
	if (node.type === 'image') return node.alt || ''
	if (node.value) return node.value
	if (node.children) return node.children.map(getReadingTimeText).join(' ')
	return ''
}

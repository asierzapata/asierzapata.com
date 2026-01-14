// @ts-check
import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs'
import { remarkAlert } from 'remark-github-blockquote-alert'

import expressiveCode from 'astro-expressive-code'

// https://astro.build/config
export default defineConfig({
	site: 'https://asierzapata.com',
	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [
		expressiveCode(),
		mdx({
			remarkPlugins: [remarkReadingTime, remarkAlert],
		}),
		react(),
	],

	markdown: {
		shikiConfig: {
			// Choose from Shiki's built-in themes (or add your own)
			// https://github.com/shikijs/shiki/blob/main/docs/themes.md
			// theme: /** @type {any} */ (customTheme),
			theme: 'catppuccin-latte',
			// Add custom languages
			// Note: Shiki has countless langs built-in, including .astro!
			// https://github.com/shikijs/shiki/blob/main/docs/languages.md
			langs: [],
			// Enable word wrap to prevent horizontal scrolling
			wrap: true,
		},
	},
})

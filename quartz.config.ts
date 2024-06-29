import { QuartzConfig } from './quartz/cfg'
import * as Plugin from './quartz/plugins'

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
	configuration: {
		pageTitle: "Asier's Digital Garden",
		enableSPA: true,
		enablePopovers: true,
		analytics: {
			provider: 'google',
			tagId: 'G-H3XEQ1CXLR',
		},
		locale: 'en-US',
		baseUrl: 'asierzapata.com',
		ignorePatterns: ['private', 'templates', '.obsidian'],
		defaultDateType: 'created',
		theme: {
			fontOrigin: 'googleFonts',
			cdnCaching: true,
			typography: {
				header: 'Schibsted Grotesk',
				body: 'Source Sans Pro',
				code: 'IBM Plex Mono',
			},
			colors: {
				lightMode: {
					light: '#faf8f8', // white for background
					lightgray: '#e5e5e5', // very light gray for subtle contrast
					gray: '#4e4e4e', // lighter gray for standard contrast
					darkgray: '#2b2b2b', // medium gray for text
					dark: '#0f0e17', // darker gray for high contrast elements
					secondary: '#ff8906', // vibrant green for highlights
					tertiary: '#e53170', // fresh green for accents
					highlight: 'rgba(255, 137, 6, 0.15)', // green highlight
				},
				darkMode: {
					light: '#0f0e17', // very dark gray for background
					lightgray: '#2e2f3e', // dark gray for subtle contrast
					gray: '#A9ACBC', // medium dark gray for standard contrast
					darkgray: '#C6C8D2', // lighter green-gray for text
					dark: '#E3E4E9', // very light green-gray for high contrast elements
					secondary: '#ff8906', // medium green-gray for links and highlights
					tertiary: '#e53170', // fresh green for success messages and accents
					highlight: 'rgba(255, 137, 6, 0.15)', // medium green-gray highlight
				},
			},
		},
	},
	plugins: {
		transformers: [
			Plugin.FrontMatter(),
			Plugin.CreatedModifiedDate({
				priority: ['frontmatter', 'filesystem'],
			}),
			Plugin.SyntaxHighlighting({
				theme: {
					light: 'github-light',
					dark: 'github-dark',
				},
				keepBackground: false,
			}),
			Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
			Plugin.GitHubFlavoredMarkdown(),
			Plugin.TableOfContents(),
			Plugin.CrawlLinks({ markdownLinkResolution: 'shortest' }),
			Plugin.Description(),
			Plugin.Latex({ renderEngine: 'katex' }),
		],
		filters: [Plugin.RemoveDrafts()],
		emitters: [
			Plugin.AliasRedirects(),
			Plugin.ComponentResources(),
			Plugin.ContentPage(),
			Plugin.FolderPage(),
			Plugin.TagPage(),
			Plugin.ContentIndex({
				enableSiteMap: true,
				enableRSS: true,
			}),
			Plugin.Assets(),
			Plugin.Static(),
			Plugin.NotFoundPage(),
		],
	},
}

export default config

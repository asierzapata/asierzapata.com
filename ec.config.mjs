import { defineEcConfig, setLuminance, setAlpha } from 'astro-expressive-code'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'

// https://expressive-code.com/reference/configuration/
export default defineEcConfig({
	/* Basics */
	defaultLocale: 'en-US',
	defaultProps: {
		wrap: true,
		preserveIndent: true,
		showLineNumbers: true,
		collapseStyle: 'collapsible-auto',
	},
	minSyntaxHighlightingColorContrast: 0,

	/* Plugins */
	plugins: [pluginLineNumbers(), pluginCollapsibleSections()],

	/* Styles */
	styleOverrides: {
		// borderColor: context => 'var(--color-primary-subtle)',

		focusBorder: context => 'var(--color-primary-subtle)',
		codeBackground: context => '#fafafa',
		codePaddingBlock: '0.8571429em',
		codePaddingInline: '1.1428571em',

		/* Editor & Terminal Frames */
		frames: {
			frameBoxShadowCssValue: 'none',
			inlineButtonBackgroundActiveOpacity: '0.2',
			inlineButtonBackgroundHoverOrFocusOpacity: '0.1',
			terminalBackground: ({ theme }) => '#fafafa',
			tooltipSuccessBackground: ({ theme }) => 'var(--color-primary-subtle)',
			tooltipSuccessForeground: ({ theme }) => 'var(--color-slate-500)',
			editorActiveTabIndicatorTopColor: ({ theme }) => 'var(--color-primary)',
			editorActiveTabForeground: ({ theme }) => 'var(--color-primary)',
		},

		/* Text & Line Markers */
		textMarkers: {
			backgroundOpacity: '0.25',
			borderOpacity: '0.5',
		},

		/* Collapsible Sections */
		collapsibleSections: {
			closedBackgroundColor: ({ theme }) =>
				setAlpha(theme.colors['editor.foldBackground'], 0.06) || 'rgb(84 174 255 / 20%)',
		},
	},

	/* Theme */
	themes: ['catppuccin-latte'],
	themeCssRoot: ':root',
})

import { PageLayout, SharedLayout } from './quartz/cfg'
import * as Component from './quartz/components'

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
	head: Component.Head(),
	header: [],
	footer: Component.Footer({
		links: {
			GitHub: 'https://github.com/asierzapata/asierzapata.com',
		},
	}),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
	beforeBody: [
		Component.Breadcrumbs(),
		Component.ArticleTitle(),
		Component.ContentMeta(),
		Component.TagList(),
	],
	left: [
		Component.PageTitle(),
		Component.MobileOnly(Component.Spacer()),
		Component.Search(),
		Component.Darkmode(),
		Component.DesktopOnly(Component.Explorer()),
		Component.DesktopOnly(
			Component.RecentNotes({
				limit: 5,
				title: 'Recent Notes',
				showTags: false,
			}),
		),
	],
	right: [
		Component.DesktopOnly(Component.TableOfContents()),
		Component.MobileOnly(
			Component.RecentNotes({
				limit: 5,
				title: 'Recent Notes',
				showTags: false,
			}),
		),
		Component.Graph(),
		Component.Backlinks(),
	],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
	beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
	left: [
		Component.PageTitle(),
		Component.MobileOnly(Component.Spacer()),
		Component.Search(),
		Component.Darkmode(),
		Component.DesktopOnly(Component.Explorer()),
	],
	right: [],
}

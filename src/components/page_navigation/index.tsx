import React from 'react'

import { classnames } from '@/lib/classnames'

/* ====================================================== */
/*                       Components                      */
/* ====================================================== */

import Link from 'next/link'
import {
	HomeIcon,
	FileTextIcon,
	LayersIcon,
	// BookmarkIcon,
	HamburgerMenuIcon,
	MagnifyingGlassIcon
} from '@radix-ui/react-icons'
import { motion } from 'framer-motion'
import { SidebarContext } from './sidebar_context'
import { useCommandPaletteContext } from '@/components/command_palette/command_palette_context'

/* ====================================================== */
/*                    Implementation                     */
/* ====================================================== */

type PageNavigationProps = {
	children: React.ReactNode
}

const NavBar = ({
	onToggleSidebar,
	onContentClicked
}: {
	onToggleSidebar: () => void
	onContentClicked: () => void
}) => {
	const { toggleCommandPalette } = useCommandPaletteContext()

	return (
		<>
			<div className="flex flex-row items-center justify-start py-5 lg:px-6">
				<button
					className="rounded px-3 py-1 text-sm hover:bg-background hover:text-primary lg:hidden"
					onClick={onToggleSidebar}
				>
					<HamburgerMenuIcon />
				</button>
				<h1
					className="animate-text
							bg-gradient-to-br from-secondary to-primary
							bg-clip-text
							px-3 text-lg font-medium
							text-transparent
							lg:px-0
						"
				>
					Asier Zapata
				</h1>
			</div>
			<button
				className="flex w-full flex-row items-center justify-around gap-2 rounded bg-background py-2 pl-6 pr-4 text-sm font-light text-darkText"
				onClick={toggleCommandPalette}
			>
				<MagnifyingGlassIcon /> <span className="pl-2">Search</span>
				<div className="flex flex-1 items-center justify-end">
					<span className="rounded bg-lightBackground py-0.5 px-1 text-xs font-extralight text-primary">
						Ctrl + K
					</span>
				</div>
			</button>

			<div className="flex w-full flex-col gap-2 px-3 py-4">
				<Link
					href="/"
					className="transition-color flex w-full flex-row items-center justify-start gap-4 rounded px-3 py-1 font-medium duration-300 ease-in-out hover:bg-background hover:text-primary"
					onClick={onContentClicked}
				>
					<HomeIcon />
					Home
				</Link>
				<Link
					href="/posts"
					className="transition-color flex w-full flex-row items-center justify-start gap-4 rounded px-3 py-1 font-medium duration-300 ease-in-out hover:bg-background hover:text-primary"
					onClick={onContentClicked}
				>
					<FileTextIcon />
					Posts
				</Link>
				<Link
					href="/stack"
					className="transition-color flex w-full flex-row items-center justify-start gap-4 rounded px-3 py-1 font-medium duration-300 ease-in-out hover:bg-background hover:text-primary"
					onClick={onContentClicked}
				>
					<LayersIcon />
					Stack
				</Link>
				{/* I will keep this page onhold */}
				{/* <Link
						href="/bookmarks"
						className="transition-color flex w-full flex-row items-center justify-start gap-4 rounded px-3 py-1 font-medium duration-300 ease-in-out hover:bg-background hover:text-primary"
						onClick={onContentClicked}
					>
						<BookmarkIcon /> Bookmarks
					</Link> */}
			</div>
		</>
	)
}

const PageNavigation = ({ children }: PageNavigationProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

	const handleToggleSidebar = React.useCallback(() => {
		setIsSidebarOpen(_isSidebarOpen => !_isSidebarOpen)
	}, [])

	const handleContentClicked = React.useCallback(() => {
		if (isSidebarOpen) handleToggleSidebar()
	}, [handleToggleSidebar, isSidebarOpen])

	const childrenContainerClassnames = classnames(
		'w-full h-full transition-opacity ease-in-out duration-300',
		isSidebarOpen && 'opacity-25 lg:opacity-100'
	)

	const sidebarClassnames = classnames(
		'px-4 w-64 flex-col bg-lightBackground absolute top-0 z-20 min-h-screen',
		!isSidebarOpen && 'left-[-300px]',
		isSidebarOpen && 'left-0'
	)

	const sidebarContextValue = React.useMemo(() => {
		return {
			toggleSidebar: handleToggleSidebar
		}
	}, [handleToggleSidebar])

	return (
		<SidebarContext.Provider value={sidebarContextValue}>
			<div className="flex max-h-screen min-h-full w-full flex-row">
				<button
					className="rounded absolute z-20 top-0 left-0 my-5 mx-4 px-3 py-1 text-sm self-start hover:bg-lightBackground hover:text-primary lg:hidden"
					onClick={handleToggleSidebar}
				>
					<HamburgerMenuIcon />
				</button>
				<motion.nav layout className={sidebarClassnames}>
					<NavBar
						onToggleSidebar={handleToggleSidebar}
						onContentClicked={handleContentClicked}
					/>
				</motion.nav>
				<nav className="hidden min-h-screen w-64 flex-col bg-lightBackground px-4 lg:flex">
					<NavBar
						onToggleSidebar={handleToggleSidebar}
						onContentClicked={handleContentClicked}
					/>
				</nav>
				<div
					className={childrenContainerClassnames}
					onClick={handleContentClicked}
				>
					{children}
				</div>
			</div>
		</SidebarContext.Provider>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { PageNavigation }

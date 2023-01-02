import React from "react";

import { classnames } from "@/lib/classnames";

/* ====================================================== */
/*                       Components                      */
/* ====================================================== */

import Link from "next/link";
import {
	HomeIcon,
	FileTextIcon,
	LayersIcon,
	Pencil2Icon,
	// BookmarkIcon,
	HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import { motion } from "framer-motion";

/* ====================================================== */
/*                    Implementation                     */
/* ====================================================== */

type PageNavigationProps = {
	children: React.ReactNode;
};

const PageNavigation = ({ children }: PageNavigationProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

	const handleToggleSidebar = React.useCallback(() => {
		setIsSidebarOpen((_isSidebarOpen) => !_isSidebarOpen);
	}, []);

	const handleClickOnContent = React.useCallback(() => {
		if (isSidebarOpen) handleToggleSidebar();
	}, [handleToggleSidebar, isSidebarOpen]);

	const childrenContainerClassnames = classnames(
		"w-full overflow-y-auto transition-opacity ease-in-out duration-300 pt-[88px]",
		isSidebarOpen && "opacity-25 lg:opacity-100"
	);

	const sidebarClassnames = classnames(
		"px-4 w-64 flex-col bg-lightBackground lg:flex-grow-0 lg:flex-shrink-0 max-lg:fixed max-lg:top-0 max-lg:z-10 h-screen",
		!isSidebarOpen && "left-[-300px]",
		isSidebarOpen && "left-0"
	);

	return (
		<div className="flex max-h-screen min-h-full w-full flex-col lg:flex-row">
			<motion.nav layout className={sidebarClassnames}>
				<div className="flex flex-row items-center justify-start py-5 lg:px-6 ">
					<button
						className="rounded px-3 py-1 text-sm hover:bg-background hover:text-primary lg:hidden"
						onClick={handleToggleSidebar}
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
				<div className="flex w-full flex-col gap-2 px-3 py-2">
					<Link
						href="/"
						className="transition-color flex w-full flex-row items-center justify-start gap-4 rounded px-3 py-1 font-medium duration-300 ease-in-out hover:bg-background hover:text-primary"
						onClick={handleClickOnContent}
					>
						<HomeIcon />
						Home
					</Link>
					<Link
						href="/posts"
						className="transition-color flex w-full flex-row items-center justify-start gap-4 rounded px-3 py-1 font-medium duration-300 ease-in-out hover:bg-background hover:text-primary"
						onClick={handleClickOnContent}
					>
						<FileTextIcon />
						Posts
					</Link>
					<Link
						href="/stack"
						className="transition-color flex w-full flex-row items-center justify-start gap-4 rounded px-3 py-1 font-medium duration-300 ease-in-out hover:bg-background hover:text-primary"
						onClick={handleClickOnContent}
					>
						<LayersIcon />
						Stack
					</Link>
					<Link
						href="/ama"
						className="transition-color flex w-full flex-row items-center justify-start gap-4 rounded px-3 py-1 font-medium duration-300 ease-in-out hover:bg-background hover:text-primary"
						onClick={handleClickOnContent}
					>
						<Pencil2Icon />
						AMA
					</Link>
					{/* I will keep this page onhold */}
					{/* <Link
						href="/bookmarks"
						className="transition-color flex w-full flex-row items-center justify-start gap-4 rounded px-3 py-1 font-medium duration-300 ease-in-out hover:bg-background hover:text-primary"
						onClick={handleClickOnContent}
					>
						<BookmarkIcon /> Bookmarks
					</Link> */}
				</div>
			</motion.nav>
			<div
				className="fixed w-full py-5 px-6 text-xl lg:hidden"
				onClick={handleClickOnContent}
			>
				<button onClick={handleToggleSidebar}>
					<HamburgerMenuIcon />
				</button>
			</div>
			<div
				className={childrenContainerClassnames}
				onClick={handleClickOnContent}
			>
				{children}
			</div>
		</div>
	);
};

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { PageNavigation };

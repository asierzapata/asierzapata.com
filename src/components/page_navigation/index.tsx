import React from "react";

/* ====================================================== */
/*                       Components                      */
/* ====================================================== */

import Link from "next/link";

/* ====================================================== */
/*                    Implementation                     */
/* ====================================================== */

const PageNavigation = () => {
	return (
		<div className="w-full px-12 py-6 lg:py-12">
			<nav className="max-w-8xl mx-auto flex items-center justify-between">
				<Link
					href="/"
					className="text-2xl font-medium text-primary hover:text-darkPrimary"
				>
					Asier Zapata
				</Link>
				<ul>
					<li>
						<Link
							href="/posts"
							className="px-5 py-2 text-primary hover:text-darkPrimary"
						>
							Blog
						</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
};

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { PageNavigation };

import React from "react";

/* ====================================================== */
/*                       Components                      */
/* ====================================================== */

import { Link } from "@remix-run/react";

/* ====================================================== */
/*                    Implementation                     */
/* ====================================================== */

const PageNavigation = () => {
	return (
		<div className="px-12 py-6 lg:py-12 w-full">
			<nav className="mx-auto flex max-w-8xl items-center justify-between">
				<Link to="/" className="text-2xl font-medium text-primary">
					Asier Zapata
				</Link>
				<ul>
					<li>
						<Link
							to="posts"
							className="text-blue-600 px-5 py-2 hover:text-primary"
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

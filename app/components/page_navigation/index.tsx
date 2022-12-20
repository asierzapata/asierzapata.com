import React from "react";

/* ====================================================== */
/*                       Components                      */
/* ====================================================== */

import { Link, NavLink } from "@remix-run/react";

/* ====================================================== */
/*                    Implementation                     */
/* ====================================================== */

const PageNavigation = () => {
	return (
		<div className="px-12 py-6 lg:py-12 w-full">
			<nav className="mx-auto flex max-w-8xl items-center justify-between">
				<Link
					to="/"
					className="text-2xl font-medium text-primary hover:text-darkPrimary"
				>
					Asier Zapata
				</Link>
				<ul>
					<li>
						<NavLink
							to="posts"
							className={({ isActive }) =>
								isActive
									? "px-5 py-2 text-darkPrimary hover:text-primary"
									: "px-5 py-2 text-primary hover:text-darkPrimary"
							}
						>
							Blog
						</NavLink>
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

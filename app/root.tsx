import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration
} from "@remix-run/react";
import { PageNavigation } from "./components/page_navigation/page_navigation";

import styles from "./tailwind.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => ({
	charset: "utf-8",
	title: "Asier Zapata",
	viewport: "width=device-width,initial-scale=1"
});

export default function App() {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<PageNavigation />
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}

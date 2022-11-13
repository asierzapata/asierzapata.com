import { Link } from "@remix-run/react";

export default function Index() {
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
			<h1>Asier Zapata</h1>
			<div className="mx-auto mt-16 max-w-7xl text-center">
				<Link to="/posts" className="text-xl text-blue-600 underline">
					Blog Posts
				</Link>
			</div>
		</div>
	);
}

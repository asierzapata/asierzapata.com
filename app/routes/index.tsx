import { Link } from "@remix-run/react";

export default function Index() {
	// TODO: Add more presentation text
	return (
		<main>
			<div className="px-12 py-6 flex w-full flex-row items-center justify-around">
				<h1 className="text-xl font-medium">Hi! I'm Asier</h1>
				<div className="bg-dark rounded">
					<img
						className="max-h-80"
						src="/face_drawing.svg"
						alt="Asier Zapata Drawn Portrait"
					/>
				</div>
			</div>
		</main>
	);
}

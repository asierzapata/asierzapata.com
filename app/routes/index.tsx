import { Link } from "@remix-run/react";

export default function Index() {
	// TODO: Add more presentation text
	return (
		<main>
			<div className="px-12 py-6 flex w-full flex-row flex-wrap-reverse items-center justify-around gap-8">
				<h1 className="text-xl font-medium">Hi! I'm Asier</h1>
				<div className="bg-light rounded-lg shadow-2xl">
					<img
						className="max-h-60 md:max-h-80"
						src="/face_drawing.svg"
						alt="Asier Zapata Drawn Portrait"
					/>
				</div>
			</div>
		</main>
	);
}

import { Link } from "@remix-run/react";

export default function Index() {
	// TODO: Add more presentation text
	return (
		<main>
			<div className="px-12 py-6 flex w-full flex-col-reverse lg:flex-row items-center justify-around gap-8">
				<div className="flex flex-col items-center justify-center">
					<h1
						className="text-5xl font-extrabold
						bg-gradient-to-br bg-clip-text text-transparent
						from-light via-orange to-light
						animate-text
						mb-4
					"
					>
						Hi! I'm Asier
					</h1>
					<h2 className="text-xl text-center">
						I'm a Tech Lead and Fullstack Web Developer using JavaScript
						currently working at{" "}
						<a className="hover:text-orange font-semibold" href="edpuzzle.com">
							Edpuzzle
						</a>
					</h2>
				</div>
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

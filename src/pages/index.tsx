/* ====================================================== */
/*                      Components                       */
/* ====================================================== */

import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "@/components/project_card";
import FaceDrawing from "@/../public/face_drawing.svg";

/* ====================================================== */
/*                        Types                          */
/* ====================================================== */

import type { InferGetStaticPropsType } from "next";

/* ====================================================== */
/*                     Data Loading                      */
/* ====================================================== */

import { getProjectsUserCase } from "@/server/modules/projects/get_projects_use_case";

export const getStaticProps = async () => {
	const projects = await getProjectsUserCase();

	return {
		props: {
			projects,
		},
	};
};

/* ====================================================== */
/*                      Component                        */
/* ====================================================== */

function Home({ projects }: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<main>
			<div className="mb-6 flex w-full flex-col-reverse items-center justify-around gap-8 px-12 py-6 lg:flex-row">
				<div className="flex flex-col items-center justify-center">
					<h1
						className="
							mb-4 animate-text
							bg-gradient-to-br from-secondary to-primary
							bg-clip-text text-5xl
							font-extrabold
							text-transparent
						"
					>
						Hi! I&apos;m Asier
					</h1>
					<h2 className="mb-8 text-center text-xl">
						I&apos;m a Tech Lead and Fullstack Web Developer working at{" "}
						<a
							className="font-semibold hover:text-primary"
							href="https://edpuzzle.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							Edpuzzle
						</a>
					</h2>
					<Link
						href="/posts"
						className="rounded bg-darkPrimary px-4 py-2 font-semibold text-background transition-colors ease-in hover:bg-primary"
					>
						Discover my blog here
					</Link>
				</div>
				<div className="rounded-lg bg-text shadow-2xl">
					<Image
						// className="h-60 md:h-80"
						src={FaceDrawing}
						alt="Asier Zapata Drawn Portrait"
						width={240}
						height={240}
					/>
				</div>
			</div>
			<div className="w-full px-12 py-6">
				<h1 className="mb-8 text-left text-3xl font-bold text-darkPrimary">
					Projects
				</h1>
				<div className="flex flex-row flex-wrap items-start justify-evenly gap-6">
					{projects.map((project) => (
						<ProjectCard key={project._id} project={project} />
					))}
				</div>
			</div>
		</main>
	);
}

export default Home;

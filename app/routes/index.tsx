import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import _ from "lodash";

import { getProjectsUserCase } from "~/modules/projects/get_projects_use_case.server";

import { GlobeIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

/* ====================================================== */
/*                     Data Loading                      */
/* ====================================================== */

type LoaderData = {
	projects: Awaited<ReturnType<typeof getProjectsUserCase>>;
};

export const loader = async () => {
	const projects = await getProjectsUserCase();

	return json<LoaderData>({
		projects,
	});
};

/* ====================================================== */
/*                      Component                        */
/* ====================================================== */

export default function Home() {
	const { projects } = useLoaderData<typeof loader>();

	return (
		<main>
			<div className="px-12 py-6 mb-6 flex w-full flex-col-reverse lg:flex-row items-center justify-around gap-8">
				<div className="flex flex-col items-center justify-center">
					<h1
						className="text-5xl font-extrabold
						bg-gradient-to-br bg-clip-text text-transparent
						from-secondary to-primary
						animate-text
						mb-4
					"
					>
						Hi! I'm Asier
					</h1>
					<h2 className="text-xl text-center mb-8">
						I'm a Tech Lead and Fullstack Web Developer working at{" "}
						<a
							className="hover:text-primary font-semibold"
							href="https://edpuzzle.com"
						>
							Edpuzzle
						</a>
					</h2>
					<Link
						to="/posts"
						className="bg-darkPrimary transition-colors ease-in hover:bg-primary px-4 py-2 rounded text-background font-semibold"
					>
						Discover my blog here
					</Link>
				</div>
				<div className="bg-text rounded-lg shadow-2xl">
					<img
						className="max-h-60 md:max-h-80"
						src="/face_drawing.svg"
						alt="Asier Zapata Drawn Portrait"
					/>
				</div>
			</div>
			<div className="px-12 py-6 flex w-full flex-col items-start justify-around">
				<h1 className="text-3xl text-left font-bold mb-8 text-darkPrimary">
					Projects
				</h1>
				{projects.map((project) => (
					<ProjectCard key={project._id} project={project} />
				))}
			</div>
		</main>
	);
}

function ProjectCard({
	project,
}: {
	project: Awaited<ReturnType<typeof getProjectsUserCase>>[number];
}) {
	return (
		<div
			className="flex flex-col rounded-md px-8 py-4 h-full w-full max-w-sm
					group transition duration-300
					border border-transparent"
		>
			<h3 className="text-xl font-semibold mb-6 text-primary">
				{project.title}
			</h3>
			<img src={project.image} alt={project.title} className="rounded mb-4" />
			<h4 className="mb-4 italic font-light">{project.description}</h4>
			<div className="flex flex-row items-center justify-around">
				{project.links.map((link) => (
					<a href={link.url} className="hover:text-primary">
						{link.source === "web" ? <GlobeIcon className="w-5 h-5" /> : null}
						{link.source === "github" ? (
							<GitHubLogoIcon className="w-5 h-5" />
						) : null}
					</a>
				))}
			</div>
		</div>
	);
}

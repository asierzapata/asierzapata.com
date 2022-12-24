import type { Project } from "@/server/data_types/project";

import Image from "next/image";
import { GlobeIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

function ProjectCard({ project }: { project: Project }) {
	return (
		<div
			className="group flex h-full w-full max-w-sm flex-col rounded-md border
					border-transparent px-8 py-4
					transition duration-300"
		>
			<h3 className="mb-6 text-xl font-semibold text-primary">
				{project.title}
			</h3>
			<Image
				src={project.image}
				alt={project.title}
				className="mb-4 rounded"
				width={318}
				height={318}
			/>
			<h4 className="mb-4 font-light italic">{project.description}</h4>
			<div className="flex flex-row items-center justify-center gap-6">
				{project.links.map((link) => (
					<a
						key={link.url}
						className="hover:text-primary"
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
					>
						{link.source === "web" ? <GlobeIcon className="h-5 w-5" /> : null}
						{link.source === "github" ? (
							<GitHubLogoIcon className="h-5 w-5" />
						) : null}
					</a>
				))}
			</div>
		</div>
	);
}

export { ProjectCard };

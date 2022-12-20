import { z } from "zod";
import { getClient } from "~/services/sanity/client";

export async function getProjectsUserCase() {
	const projects = await getClient().fetch(
		`*[_type == "project"] {
			_id,
			title,
			description,
			links,
			"image": image.asset->url,
			createdAt
		}`
	);
	const ProjectsListSchema = z.array(
		z.object({
			_id: z.string(),
			title: z.string(),
			description: z.string(),
			image: z.string(),
			links: z.array(
				z.object({
					source: z.enum(["github", "web"]),
					url: z.string().url(),
				})
			),
			createdAt: z.string(),
		})
	);
	return ProjectsListSchema.parse(projects);
}

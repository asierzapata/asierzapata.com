import { getClient } from "@/server/services/sanity/client";
import { parseProjects } from "@/server/data_types/project";

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
	return parseProjects(projects)
}

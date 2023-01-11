import { z } from 'zod'

const ProjectSchema = z.object({
	_id: z.string(),
	title: z.string(),
	description: z.string(),
	image: z.string(),
	links: z.array(
		z.object({
			source: z.enum(['github', 'web']),
			url: z.string().url()
		})
	),
	createdAt: z.string()
})

export function parseProjects(projects: unknown[]): Project[] {
	return projects.map(project => parseProject(project))
}

export function parseProject(project: unknown): Project {
	return ProjectSchema.parse(project)
}

export type Project = typeof ProjectSchema._type

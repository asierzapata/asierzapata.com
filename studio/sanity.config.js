import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import schemas from './schemas/schema'
import { markdownSchema } from 'sanity-plugin-markdown'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'

export default defineConfig({
	title: 'Asier Zapata Personal Page',
	projectId: 'lz94831n',
	dataset: 'production',
	plugins: [deskTool(), visionTool(), markdownSchema(), unsplashImageAsset()],
	tools: prev => {
		// 👇 Uses environment variables set by Vite in development mode
		if (import.meta.env.DEV) {
			return prev
		}
		return prev.filter(tool => tool.name !== 'vision')
	},
	schema: {
		types: schemas
	}
})

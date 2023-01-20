export const config = {
	apiVersion: '2021-10-21',
	// Find these in your ./studio/sanity.json file
	dataset: 'production',
	projectId: 'lz94831n',
	useCdn: typeof document !== 'undefined' // server-side is statically generated, the CDN is only necessary beneficial if queries are called on-demand
}

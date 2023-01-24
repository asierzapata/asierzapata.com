import * as React from 'react'
import NewPostTemplate from './new_post_template'

export default function NewPost() {
	return (
		<NewPostTemplate
			post={{
				_id: '942cced4-6182-4c29-9766-95261f619e49',
				authorName: 'Asier Zapata',
				description:
					'Journey through learning how the recording on the web works and its quirks.',
				estimatedDuration: 6,
				mainImage:
					'https://cdn.sanity.io/images/lz94831n/production/862f22953f2acdd154d3c47ae649abe3472fb620-4240x2827.jpg',
				publishedAt: '2023-01-20T19:00:00.000Z',
				slug: 'recording-audio-on-the-web',
				title: 'Recording Audio on the Web',
				type: 'article'
			}}
		/>
	)
}

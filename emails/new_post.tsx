import * as React from 'react'
import NewPostTemplate from './new_post_template'

export default function NewPost() {
	return (
		<NewPostTemplate
			post={{
				description:
					'Journey through learning how the recording on the web works and its quirks.',
				mainImage:
					'https://cdn.sanity.io/images/lz94831n/production/862f22953f2acdd154d3c47ae649abe3472fb620-4240x2827.jpg',
				slug: 'recording-audio-on-the-web',
				title: 'Recording Audio on the Web'
			}}
		/>
	)
}

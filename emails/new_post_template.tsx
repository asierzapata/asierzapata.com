import { Button } from '@react-email/button'
import { Container } from '@react-email/container'
import { Head } from '@react-email/head'
import { Hr } from '@react-email/hr'
import { Html } from '@react-email/html'
import { Img } from '@react-email/img'
import { Link } from '@react-email/link'
import { Preview } from '@react-email/preview'
import { Section } from '@react-email/section'
import { Text } from '@react-email/text'
import * as React from 'react'
import type { PostSummary } from '@/server/data_types/post'

export default function NewPostTemplate({ post }: { post: PostSummary }) {
	return (
		<Html>
			<Head />
			<Preview>{post.title}</Preview>
			<Section style={main}>
				<Container style={container}>
					<Text style={h1}>
						I have published a new <strong>post</strong>
					</Text>
					<Img
						src={post.mainImage}
						width="256"
						height="171"
						alt={post.title}
						style={{ ...postImage, marginTop: '32px' }}
					/>
					<Text style={title}>{post.title}</Text>
					<Text style={description}>{post.description}</Text>

					<Section style={{ textAlign: 'center', paddingTop: '16px' }}>
						<Button
							pX={20}
							pY={12}
							style={btn}
							href={`https://asierzapata.com/posts/${post.slug}?utm_campaign=post-engagement&utm_source=newsletter&utm_medium=email`}
						>
							Read it here
						</Button>
					</Section>
					<Text style={alternateLink}>
						<br />
						If you can&apos;t open the post, copy and paste this URL into your
						browser:{' '}
						<Link
							href={`https://asierzapata.com/posts/${post.slug}?utm_campaign=post-engagement&utm_source=newsletter&utm_medium=email`}
							target="_blank"
							style={link}
							rel="noreferrer"
						>
							{`https://asierzapata.com/posts/${post.slug}?utm_campaign=post-engagement&utm_source=newsletter&utm_medium=email`}
						</Link>
					</Text>
					<Hr style={hr} />
					<Text style={footer}>
						If you were not expecting this, you can ignore this email. If you
						are concerned about your email&apos;s safety, please reply to this
						to get in touch.
					</Text>
				</Container>
			</Section>
		</Html>
	)
}

const main = {
	backgroundColor: '#0f0e17',
	margin: '0 auto'
}

const container = {
	borderRadius: '5px',
	margin: '40px auto',
	padding: '20px',
	maxWidth: '465px'
}

const postImage = {
	margin: '0 auto',
	borderRadius: '0.5rem'
}

const h1 = {
	color: '#fffffe',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '24px',
	fontWeight: 'normal',
	textAlign: 'center' as const,
	margin: '30px 0',
	padding: '0'
}

const title = {
	color: '#fffffe',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '20px',
	fontWeight: 'normal',
	textAlign: 'center' as const,
	margin: '30px 0',
	padding: '0'
}

const description = {
	color: '#fffffe',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '16px',
	fontWeight: 'thin',
	textAlign: 'center' as const,
	margin: '30px 0',
	padding: '0'
}

const link = {
	color: '#ff8906',
	textDecoration: 'none'
}

const alternateLink = {
	color: '#fffffe',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '12px',
	lineHeight: '24px'
}

const btn = {
	backgroundColor: '#ff8906',
	borderRadius: '5px',
	color: '#0f0e17',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '12px',
	fontWeight: 500,
	lineHeight: '50px',
	textDecoration: 'none',
	textAlign: 'center' as const,
	width: '70%'
}

const hr = {
	border: 'none',
	borderTop: '1px solid #eaeaea',
	margin: '26px 0',
	width: '100%'
}

const footer = {
	color: '#a7a9be',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '12px',
	lineHeight: '24px'
}

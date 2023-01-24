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

export default function ReminderConfirmation() {
	return (
		<Html>
			<Head />
			<Preview>Reminder to confirm your subscription to my newsletter</Preview>
			<Section style={main}>
				<Container style={container}>
					<Section style={{ marginTop: '32px' }}>
						<Img
							src="https://asierzapata.com/email_logo.png"
							width="100"
							height="100"
							alt="Asier Zapata Logo"
							style={logo}
						/>
					</Section>
					<Text style={h1}>
						Confirm your subscription to my <strong>newsletter</strong>
					</Text>
					<Text style={text}>Hi {`{{ email }}`},</Text>
					<Text style={text}>
						This is a small reminder about your subscription to my newsletter.
						We are all very busy people! But I promise this won&apos;t take you
						long.
					</Text>
					<Section style={{ textAlign: 'center', paddingTop: '16px' }}>
						<Button pX={20} pY={12} style={btn} href="{{ confirmation_url }}">
							Confirm clicking here
						</Button>
					</Section>
					<Text style={text}>
						<br />
						or copy and paste this URL into your browser:{' '}
						<Link
							href="{{ confirmation_url }}"
							target="_blank"
							style={link}
							rel="noreferrer"
						>
							{`{{ confirmation_url }}`}
						</Link>
					</Text>
					<Hr style={hr} />
					<Text style={footer}>
						This email was intended for{' '}
						<span style={black}>{`{{ email }}`}</span>. If you were not
						expecting this, you can ignore this email. If you are concerned
						about your email&apos;s safety, please reply to this to get in
						touch.
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

const logo = {
	margin: '0 auto',
	backgroundColor: '#fffffe',
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

const link = {
	color: '#067df7',
	textDecoration: 'none'
}

const text = {
	color: '#fffffe',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '14px',
	lineHeight: '24px'
}

const black = {
	color: 'black'
}

const btn = {
	backgroundColor: '#ff8906',
	borderRadius: '5px',
	color: '#fff',
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

import { env } from '@/env/server.mjs'

const BUTTONDOWN_API_URL = 'https://api.buttondown.email/v1'

const BUTTONDOWN_API_KEY = env.BUTTONDOWN_API_KEY

export const addNewSubscriber = async ({ email }: { email: string }) => {
	let response
	try {
		const buttondownRoute = `${BUTTONDOWN_API_URL}/subscribers`
		response = await fetch(buttondownRoute, {
			body: JSON.stringify({
				email
			}),
			headers: {
				Authorization: `Token ${BUTTONDOWN_API_KEY}`,
				'Content-Type': 'application/json'
			},
			method: 'POST'
		})
	} catch (error) {
		throw error
	}

	if (response.status >= 400) {
		const jsonResponse = (await response.json()) as Record<string, unknown>
		if (jsonResponse.code && jsonResponse.code === 'email_already_exists') {
			throw new Error('The email address is already subscribed.')
		}
		throw new Error('There was an error subscribing to the list.')
	}

	return
}

export const sendNotificationEmail = async ({
	subject,
	body
}: {
	subject: string
	body: string
}) => {
	let response
	try {
		const buttondownRoute = `${BUTTONDOWN_API_URL}/emails`
		response = await fetch(buttondownRoute, {
			body: JSON.stringify({
				included_tags: [],
				excluded_tags: [],
				subject,
				body,
				email_type: 'private',
				status: 'sent',
				metadata: {}
			}),
			headers: {
				Authorization: `Token ${BUTTONDOWN_API_KEY}`,
				'Content-Type': 'application/json'
			},
			method: 'POST'
		})
	} catch (error) {
		throw error
	}

	if (response.status >= 400) {
		const jsonResponse = (await response.json()) as Record<string, unknown>
		throw new Error(
			`There was an error sending the email: ${JSON.stringify(jsonResponse)}`
		)
	}

	return
}

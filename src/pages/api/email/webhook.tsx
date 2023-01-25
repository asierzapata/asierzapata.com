import React from 'react'
import _ from 'lodash'

/* ====================================================== */
/*                       Env Vars                         */
/* ====================================================== */

import { env } from '@/env/server.mjs'
const secret = env.SANITY_WEBHOOK_SECRET

/* ====================================================== */
/*                        Webhook                         */
/* ====================================================== */

import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

import type { NextApiRequest, NextApiResponse } from 'next'

import { z } from 'zod'
import { PostTypesEnum } from '@/server/data_types/post'

const PostSchema = z.object({
	title: z.string(),
	slug: z.string(),
	estimatedDuration: z.number(),
	mainImage: z.string(),
	description: z.string(),
	type: PostTypesEnum
})

/* ====================================================== */
/*                        Email                           */
/* ====================================================== */

import { render } from '@react-email/render'
import NewPostTemplate from '../../../../emails/new_post_template'
import { sendNotificationEmail } from '@/server/services/buttondown/buttondown_service'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	let signature = req.headers[SIGNATURE_HEADER_NAME] || ''
	if (_.isArray(signature)) signature = signature[0] || ''
	const body = await readBody(req) // Read the body into a string
	if (!isValidSignature(body, signature, secret)) {
		res.status(401).json({ success: false, message: 'Invalid signature' })
		return
	}

	const jsonBody: unknown = JSON.parse(body)
	const post = PostSchema.parse(jsonBody)

	const emailBody = render(<NewPostTemplate post={post} />, {
		pretty: true
	})

	await sendNotificationEmail({
		subject: `New Post: ${post.title}`,
		body: emailBody
	})

	res.json({ success: true })
}

// Next.js will by default parse the body, which can lead to invalid signatures
export const config = {
	api: {
		bodyParser: false
	}
}

async function readBody(readable: NextApiRequest) {
	const chunks = []
	for await (const chunk of readable) {
		chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
	}
	return Buffer.concat(chunks).toString('utf8')
}

import React from 'react'

import { api } from '@/utils/api'

/* ====================================================== */
/*                         Types                          */
/* ====================================================== */

/* ====================================================== */
/*                       Components                       */
/* ====================================================== */

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Spinner } from '@/ui/spinner'

/* ====================================================== */
/*                    Implementation                      */
/* ====================================================== */

type FormData = {
	email: string
}

const FormSchema = z.object({
	email: z.string().email()
})

const SubscriptionForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormData>({
		resolver: zodResolver(FormSchema)
	})

	const createSubscription = api.subscription.createSubscription.useMutation()

	const onSubmit = React.useCallback(
		({ email }: FormData, e?: React.BaseSyntheticEvent) => {
			if (e) e.preventDefault()
			createSubscription.mutate({ email })
		},
		[createSubscription]
	)

	return (
		<form
			className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-6"
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="text-center text-lg">
				Subscribe here to my mailing list! You will be the first to be notified
				about any new posts
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="email" className="text-sm">
					Email
				</label>
				<div
					className="
						w-full rounded
						bg-gradient-to-br from-primary via-darkPrimary to-secondary
						p-[1px] transition duration-300 hover:from-secondary hover:to-primary
					"
				>
					<input
						className="w-full rounded bg-background py-1 px-2 text-text focus:border-primary"
						type="email"
						placeholder="your@email.com"
						{...register('email', { required: true })}
					/>
				</div>
				{errors.email && (
					<span className="text-sm text-secondary">This field is required</span>
				)}
			</div>
			{createSubscription.error && (
				<span className="text-sm text-secondary">
					{createSubscription.error.message}
				</span>
			)}
			<button
				className="flex items-center justify-center gap-3 rounded bg-darkPrimary px-4 py-2 font-semibold text-background transition-colors ease-in hover:bg-primary"
				type="submit"
			>
				{createSubscription.isLoading ? (
					<Spinner type="primary" />
				) : (
					'Subscribe'
				)}
			</button>
		</form>
	)
}

/* ====================================================== */
/*                      Public API                        */
/* ====================================================== */

export { SubscriptionForm }
